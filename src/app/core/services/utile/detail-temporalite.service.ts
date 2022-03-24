import { Injectable } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { SimulationMensuelle } from "@models/simulation-mensuelle";
import { RessourceFinanciere } from '@app/commun/models/ressource-financiere';
import { Aide } from '@app/commun/models/aide';
import { AidesService } from './aides.service';
import { NumberUtileService } from './number-util.service';
import { LibellesAidesEnum } from '@app/commun/enumerations/libelles-aides.enum';
import { RessourcesFinancieresService } from './ressources-financieres.service';
import { Simulation } from '@app/commun/models/simulation';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { DetailTemporalite } from '@app/commun/models/detail-temporalite';
import { DetailMensuel } from '@app/commun/models/detail-mensuel';
import { SituationTemporaliteEnum } from '@app/commun/enumerations/situation-temporalite.enum';
import { AidesCAF } from '@app/commun/models/aides-caf';
import { AidesPoleEmploi } from '@app/commun/models/aides-pole-emploi';

@Injectable({ providedIn: 'root' })
export class DetailTemporaliteService {

  codesAidesEnum: typeof CodesAidesEnum = CodesAidesEnum;
  libellesAidesEnum: typeof LibellesAidesEnum = LibellesAidesEnum;

  detailTemporalite: DetailTemporalite;
  demandeurEmploi: DemandeurEmploi;
  situation = {
    rsa: 0,
    ass: 0,
    are: 0,
    aah: 0,
    ppa: 0,
    apl: 0,
    als: 0,
    alf: 0
  }

  constructor(
    private aidesService: AidesService,
    private numberUtileService: NumberUtileService,
    private ressourcesFinancieresService: RessourcesFinancieresService
  ) { }



  public createDetailTemporalite(demandeurEmploi: DemandeurEmploi, simulation: Simulation) {
    this.demandeurEmploi = demandeurEmploi;
    this.initDetailTemporalite();
    this.initSituation();

    simulation.simulationsMensuelles.forEach((simulationMensuelle, index) => {
      if (index == 0) {
        this.handlePremierMois(simulationMensuelle);
      } else {
        this.handleMois(simulationMensuelle, index);
      }
      this.applyNewSituation(simulationMensuelle);

    });

    return this.detailTemporalite;
  }

  private initDetailTemporalite(): void {
    const detailTemporalite = new DetailTemporalite();
    detailTemporalite.detailsMensuels = new Array<DetailMensuel>();

    detailTemporalite.detailsMensuels.push(this.initDetailMensuel());
    detailTemporalite.detailsMensuels.push(this.initDetailMensuel());
    detailTemporalite.detailsMensuels.push(this.initDetailMensuel());
    detailTemporalite.detailsMensuels.push(this.initDetailMensuel());
    detailTemporalite.detailsMensuels.push(this.initDetailMensuel());
    detailTemporalite.detailsMensuels.push(this.initDetailMensuel());

    this.detailTemporalite = detailTemporalite;

  }

  private initDetailMensuel(): DetailMensuel {
    const detailMensuel = new DetailMensuel();
    detailMensuel.details = new Array<string>();
    return detailMensuel;
  }

  private initSituation(): void {
    if (this.demandeurEmploi != null && this.demandeurEmploi.ressourcesFinancieresAvantSimulation != null) {
      this.initSituationAidesCAF();
      this.initSituationAidesPoleEmploi();
    }
  }

  private initSituationAidesCAF() {
    if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF != null) {
      if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.allocationAAH != null) {
        this.situation.aah = this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.allocationAAH;
      }
      if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA != null) {
        this.situation.rsa = this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA;
      }
      this.initSituationAidesLogement();
    }
  }

  private initSituationAidesLogement() {
    if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement != null) {
      if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement != null) {
        this.situation.apl = this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins1;
      }
      if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale != null) {
        this.situation.alf = this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins1;
      }
      if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale != null) {
        this.situation.als = this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins1;
      }
    }
  }

  private initSituationAidesPoleEmploi() {

    if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesPoleEmploi != null) {
      if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE != null) {
        this.situation.aah = this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationMensuelleNet;
      }
      if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS != null) {
        this.situation.rsa = this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.allocationMensuelleNet;
      }
    }
  }

  private handlePremierMois(simulationMensuelle) {
    const indexMois = 0;

    this.handleChangementAGEPIEtAideMob(simulationMensuelle, indexMois);
    this.handleChangementASS(simulationMensuelle, indexMois);

    if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.RSA)) {
      this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.RSA);
    }

    if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AIDE_RETOUR_EMPLOI)) {
      this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.COMPLEMENT_ARE);
    }

  }

  private handleMois(simulationMensuelle: SimulationMensuelle, indexMois) {
    this.handleChangementRSA(simulationMensuelle, indexMois);
    this.handleChangementAAH(simulationMensuelle, indexMois);
    this.handleChangementARE(simulationMensuelle, indexMois);
    this.handleChangementAL(simulationMensuelle, indexMois);
    this.handleChangementPPA(simulationMensuelle, indexMois);
  }

  private handleChangementAGEPIEtAideMob(simulationMensuelle: SimulationMensuelle, indexMois: number) {
    if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AGEPI) || this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AIDE_MOBILITE)) {
      if (!this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AGEPI)) {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.AIDE_MOBILITE);

      } else if (!this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AIDE_MOBILITE)) {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.AGEPI);

      } else if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AGEPI) && this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AIDE_MOBILITE)) {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.AGEPI_AIDE_MOBILITE);
      }
    }
  }

  private handleChangementASS(simulationMensuelle: SimulationMensuelle, indexMois: number) {
    if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE)) {
      switch (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.nombreMoisTravaillesDerniersMois) {
        case 0:
          this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.ASS_SANS_CUMUL);
          break;
        case 1:
          this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.ASS_1_MOIS_CUMUL);
          break;
        case 2:
          this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.ASS_2_MOIS_CUMUL);
          break;
        default:
          break;
      }
    }
  }

  private handleChangementRSA(simulationMensuelle: SimulationMensuelle, indexMois: number) {
    if (this.checkForChangeInSituation(this.situation.rsa, this.aidesService.getMontantRSA(simulationMensuelle))) {
      if (this.checkForChangeInSituation(this.situation.ppa, this.aidesService.getMontantPrimeActivite(simulationMensuelle))) {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.RSA_RECALCUL_PRIME_ACTIVITE)
      } else if (!this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.RSA)) {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.FIN_RSA);
      } else {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.RSA_RECALCUL);
      }
    }
  }

  private handleChangementAAH(simulationMensuelle: SimulationMensuelle, indexMois: number) {
    if (this.checkForChangeInSituation(this.situation.aah, this.aidesService.getMontantAAH(simulationMensuelle))) {
      if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES)) {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.AAH_PARTIEL);
      } else {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.FIN_AAH);
      }
    }
  }

  private handleChangementARE(simulationMensuelle: SimulationMensuelle, indexMois: number) {
    if (this.checkForChangeInSituation(this.situation.are, this.aidesService.getMontantARE(simulationMensuelle))) {
      if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AIDE_RETOUR_EMPLOI)) {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.COMPLEMENT_ARE_PARTIEL);
      } else {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.FIN_COMPLEMENT_ARE);
      }
    }
  }

  private handleChangementAL(simulationMensuelle: SimulationMensuelle, indexMois: number) {
    if (this.checkForChangeInSituation(this.situation.apl, this.aidesService.getMontantAidePersonnaliseeLogement(simulationMensuelle)) || this.checkForChangeInSituation(this.situation.alf, this.aidesService.getMontantAllocationLogementFamiliale(simulationMensuelle)) || this.checkForChangeInSituation(this.situation.als, this.aidesService.getMontantAllocationLogementSociale(simulationMensuelle))) {
      if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT) || this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE) || this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE)) {
        if (indexMois == 1) {
          this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.AL_CHANGEMENT_SITUATION);
        } else {
          this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.AL_DECLA_TRI);
        }
      } else {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.FIN_AL);

      }
    }
  }

  private handleChangementPPA(simulationMensuelle: SimulationMensuelle, indexMois: number) {
    if (this.checkForChangeInSituation(this.situation.ppa, this.aidesService.getMontantPrimeActivite(simulationMensuelle))) {
      if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.PRIME_ACTIVITE)) {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.PRIME_ACTIVITE);
      }
    }
  }

  private applyNewSituation(simulationMensuelle: SimulationMensuelle) {
    this.situation.rsa = this.aidesService.getMontantRSA(simulationMensuelle);
    this.situation.are = this.aidesService.getMontantARE(simulationMensuelle);
    this.situation.aah = this.aidesService.getMontantAAH(simulationMensuelle);
    this.situation.ppa = this.aidesService.getMontantPrimeActivite(simulationMensuelle);
    if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT) || this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE) || this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE)) {
      if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT)) {
        this.situation.apl = this.aidesService.getMontantAidePersonnaliseeLogement(simulationMensuelle);
      } else if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE)) {
        this.situation.alf = this.aidesService.getMontantAllocationLogementFamiliale(simulationMensuelle);
      } else if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE)) {
        this.situation.als = this.aidesService.getMontantAllocationLogementSociale(simulationMensuelle);
      }
    } else {
      this.situation.apl = 0;
      this.situation.als = 0;
      this.situation.alf = 0;
    }
  }

  private checkForChangeInSituation(montantMoisPrecedent: number, montantActuel: number): boolean {
    return montantMoisPrecedent != montantActuel;
  }

  private addDetailTemporaliteMois(indexMois: number, situation: string) {
    this.detailTemporalite.detailsMensuels[indexMois].details.push(situation);
  }

}