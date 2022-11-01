import { Injectable } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { SimulationMensuelle } from "@models/simulation-mensuelle";
import { AidesService } from './aides.service';
import { Simulation } from '@app/commun/models/simulation';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { DetailTemporalite } from '@app/commun/models/detail-temporalite';
import { DetailMensuel } from '@app/commun/models/detail-mensuel';
import { SituationTemporaliteEnum } from '@app/commun/enumerations/situation-temporalite.enum';
import { RessourcesFinancieresAvantSimulationUtileService } from './ressources-financieres-avant-simulation-utile.service';
import { DeConnecteService } from './../demandeur-emploi-connecte/de-connecte.service';
import { DeConnecteInfosPersonnellesService } from '../demandeur-emploi-connecte/de-connecte-infos-personnelles.service';
import { DateUtileService } from './date-util.service';

@Injectable({ providedIn: 'root' })
export class DetailTemporaliteService {

  codesAidesEnum: typeof CodesAidesEnum = CodesAidesEnum;

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
    alf: 0,
    pi: 0
  }

  constructor(
    private aidesService: AidesService,
    private dateUtileService: DateUtileService,
    private ressourcesFinancieresAvantSimulationUtileService: RessourcesFinancieresAvantSimulationUtileService,
    private deConnecteService: DeConnecteService,
    private deConnecteInfosPersonellesService: DeConnecteInfosPersonnellesService
  ) {
    this.demandeurEmploi = this.deConnecteService.getDemandeurEmploiConnecte();
  }

  public createDetailTemporalite(simulation: Simulation): DetailTemporalite {

    this.initDetailTemporalite();
    this.initSituation();

    simulation.simulationsMensuelles.forEach((simulationMensuelle, index) => {
      this.handleMois(simulationMensuelle, index);
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

  /** Méthode permettant d'initialiser les données de situation du demandeur avec ses ressources avant simulation */
  private initSituation(): void {
    if (this.demandeurEmploi != null && this.demandeurEmploi.ressourcesFinancieresAvantSimulation != null) {
      this.initSituationAidesCAF();
      this.initSituationAidesPoleEmploi();
      this.initSituationAidesCPAM();
    }
  }

  private initSituationAidesCAF(): void {
    if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF != null) {
      if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.allocationAAH != null) {
        this.situation.aah = this.getMontantReel(this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.allocationAAH);
      }
      if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA != null) {
        this.situation.rsa = this.getMontantReel(this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA);
      }
      this.initSituationAidesLogement();
    }
  }

  private initSituationAidesLogement(): void {
    if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement != null) {
      if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement != null) {
        this.situation.apl = this.getMontantReel(this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins1);
      }
      if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale != null) {
        this.situation.alf = this.getMontantReel(this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins1);
      }
      if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale != null) {
        this.situation.als = this.getMontantReel(this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins1);
      }
    }
  }

  private initSituationAidesPoleEmploi(): void {
    if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesPoleEmploi != null) {
      if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE != null) {
        this.situation.are = this.getMontantReel(this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationMensuelleNet);
      }
      if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS != null) {
        this.situation.rsa = this.getMontantReel(this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.allocationMensuelleNet);
      }
    }
  }

  private initSituationAidesCPAM(): void {
    if (this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCPAM != null) {
      this.situation.pi = this.getMontantReel(this.demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCPAM.pensionInvalidite);
    }
  }

  private handleMois(simulationMensuelle: SimulationMensuelle, indexMois: number): void {
    this.handleChangementSalaire(indexMois);
    this.handleChangementAGEPIEtAideMob(simulationMensuelle, indexMois);
    this.handleBeneficiaireACRE(simulationMensuelle, indexMois);
    this.handleChangementASS(simulationMensuelle, indexMois);
    this.handleChangementRSA(simulationMensuelle, indexMois);
    this.handleChangementAAH(simulationMensuelle, indexMois);
    this.handleChangementARE(simulationMensuelle, indexMois);
    this.handleChangementComplementARE(simulationMensuelle, indexMois);
    this.handleChangementAL(simulationMensuelle, indexMois);
    this.handleChangementPPA(simulationMensuelle, indexMois);
    this.handleChangementPI(simulationMensuelle, indexMois);
  }

  private handleChangementSalaire(indexMois: number): void {
    if (indexMois == 0) {
      this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.SALAIRE);
    }
  }

  private handleChangementAGEPIEtAideMob(simulationMensuelle: SimulationMensuelle, indexMois: number): void {
    if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AGEPI) || this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AIDE_MOBILITE)) {
      // Si uniquement AGEPI
      if (!this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AGEPI)) {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.AIDE_MOBILITE);
      }
      // Si uniquement de l'aide à la mobilité
      else if (!this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AIDE_MOBILITE)) {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.AGEPI);
      }
      // Si AGEPI + aide à la mobilité
      else if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AGEPI) && this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AIDE_MOBILITE)) {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.AGEPI_AIDE_MOBILITE);
      }
    }
  }

  private handleChangementASS(simulationMensuelle: SimulationMensuelle, indexMois: number): void {
    if (!this.deConnecteInfosPersonellesService.isBeneficiaireACRE()) {
      if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE)) {
        // Si on est au premier mois
        if (indexMois == 0) {
          this.addDetailTemporaliteMois(indexMois, this.getPhraseAllocationPEPremierMois(simulationMensuelle));
        }
        else if (indexMois == 1) {
          // On conditionne l'affichage du détail au nombre de mois travaillés avant la simulation
          const nombreMoisTravailles3DernierMoisAvantSimulation = this.ressourcesFinancieresAvantSimulationUtileService.getNombreMoisTravaillesXDerniersMois(this.demandeurEmploi.ressourcesFinancieresAvantSimulation, 3)
          switch (nombreMoisTravailles3DernierMoisAvantSimulation) {
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
      } else {
        if (this.checkForChangeInSituation(this.situation.ass, this.aidesService.getMontantASS(simulationMensuelle))) {
          this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.FIN_ASS);
        }
      }
    }
  }

  private handleBeneficiaireACRE(simulationMensuelle: SimulationMensuelle, indexMois: number): void {
    if (this.deConnecteInfosPersonellesService.isBeneficiaireACRE()) {
      if (indexMois == 0 && this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE)) {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.ASS_BENEFICIAIRE_ACRE);
      } else if (this.checkForChangeInSituation(this.situation.ass, this.aidesService.getMontantASS(simulationMensuelle)) && !this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE)) {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.FIN_ASS_BENEFICIAIRE_ACRE);
      }
    }
  }

  private handleChangementRSA(simulationMensuelle: SimulationMensuelle, indexMois: number): void {
    // Si le demandeur reçoit du RSA le premier mois on lui indique qu'il peut le cumuler avec un salaire
    if (indexMois == 0 && this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.RSA)) {
      this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.RSA);
    } else {
      // Si le montant du RSA a changé par rapport au mois précédent
      if (this.checkForChangeInSituation(this.situation.rsa, this.aidesService.getMontantRSA(simulationMensuelle))) {
        // Si de la prime d'activité est arrivée
        if (this.checkForChangeInSituation(this.situation.ppa, this.aidesService.getMontantPrimeActivite(simulationMensuelle))) {
          if (!this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.RSA)) {
            this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.FIN_RSA_PRIME_ACTIVITE);
          } else {
            this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.RSA_RECALCUL_PRIME_ACTIVITE);
          }
        }
        // Si le demandeur n'a plus le droit a du RSA
        else if (!this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.RSA)) {
          this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.FIN_RSA);
        }
        // Sinon, le montant du RSA a simplement été recalculé
        else {
          this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.RSA_RECALCUL);
        }
      }
    }
  }

  private handleChangementAAH(simulationMensuelle: SimulationMensuelle, indexMois: number): void {
    // Si on est au premier mois
    if (indexMois == 0 && this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES)) {
      this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.AAH);
    } else {
      // Si le montant de l'AAH a changé par rapport au mois précédent
      if (this.checkForChangeInSituation(this.situation.aah, this.aidesService.getMontantAAH(simulationMensuelle))) {
        // Si le demandeur a toujours de l'AAH
        if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES)) {
          this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.AAH_PARTIEL);
        }
        // Sinon le demandeur n'a plus le droit a de l'AAH
        else {
          this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.FIN_AAH);
        }
      }
    }
  }

  private handleChangementARE(simulationMensuelle: SimulationMensuelle, indexMois: number): void {
    // Si on est au premier mois
    if (indexMois == 0 && this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AIDE_RETOUR_EMPLOI)) {
      this.addDetailTemporaliteMois(indexMois, this.getPhraseAllocationPEPremierMois(simulationMensuelle, false));
    }
  }

  private handleChangementComplementARE(simulationMensuelle: SimulationMensuelle, indexMois: number): void {
    // Si on est au premier ou deuxième mois
    if (indexMois <= 1) {
      if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.COMPLEMENT_AIDE_RETOUR_EMPLOI) && this.checkForChangeInSituation(this.situation.are, this.aidesService.getMontantComplementARE(simulationMensuelle))) {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.COMPLEMENT_ARE);
      } else if (!this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.COMPLEMENT_AIDE_RETOUR_EMPLOI) && this.checkForChangeInSituation(this.situation.are, this.aidesService.getMontantComplementARE(simulationMensuelle))) {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.NON_ELIGIBLE_COMPLEMENT_ARE);
      }
    }
    // Sinon si on est à n'importe quel autre mois
    else if (!this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.COMPLEMENT_AIDE_RETOUR_EMPLOI) && this.checkForChangeInSituation(this.situation.are, this.aidesService.getMontantComplementARE(simulationMensuelle))) {
      this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.FIN_COMPLEMENT_ARE);
    }
  }

  private handleChangementAL(simulationMensuelle: SimulationMensuelle, indexMois: number): void {
    // Si le montant de l'aide au logement a changé par rapport au mois précédent
    if (this.checkForChangeInSituation(this.situation.apl, this.aidesService.getMontantAidePersonnaliseeLogement(simulationMensuelle)) || this.checkForChangeInSituation(this.situation.alf, this.aidesService.getMontantAllocationLogementFamiliale(simulationMensuelle)) || this.checkForChangeInSituation(this.situation.als, this.aidesService.getMontantAllocationLogementSociale(simulationMensuelle))) {
      // Si le demandeur a toujours de l'aide au logement
      if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT) || this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE) || this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE)) {
        if (this.checkPasDAide(this.situation.apl) && this.checkPasDAide(this.situation.alf) && this.checkPasDAide(this.situation.als)) {
          // Si le demandeur d'emploi n'avait pas d'AL avant
          this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.ELIGIBLE_AL);
        } else if (indexMois == 1) {
          // Si le montant de l'AL à changer car sa situation a changé suite à sa reprise d'emploi
          this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.AL_CHANGEMENT_SITUATION);
        }
        // Sinon c'est la déclaration trimestrielle qui a modifié le montant de l'al
        else {
          this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.AL_DECLA_TRI);
        }
      }
      // Sinon le demandeur n'a plus le droit a de l'aide au logement
      else {
        this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.FIN_AL);
      }
    }
  }

  private handleChangementPPA(simulationMensuelle: SimulationMensuelle, indexMois: number): void {
    // Si le montant de la prime d'activité a changé par rapport au mois précédent
    if (this.checkForChangeInSituation(this.situation.ppa, this.aidesService.getMontantPrimeActivite(simulationMensuelle))) {
      // Si le demandeur a toujours de la prime d'activité
      if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.PRIME_ACTIVITE) && !this.checkForChangeInSituation(this.situation.rsa, this.aidesService.getMontantRSA(simulationMensuelle))) {
        // Si le demandeur avait de la prime d'activité au mois précédent
        if (this.situation.ppa != 0) {
          this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.PRIME_ACTIVITE_RECALCUL);
        }
        // Si le demandeur n'avait de prime d'activité au mois précédent
        else {
          if (indexMois != 0) this.addDetailTemporaliteMois(indexMois - 1, this.getPhrasePPAAnticipee(simulationMensuelle));
          this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.PRIME_ACTIVITE);
        }
      }
    }
  }

  private handleChangementPI(simulationMensuelle: SimulationMensuelle, indexMois: number): void {
    if (this.aidesService.hasAideByCode(simulationMensuelle, CodesAidesEnum.PENSION_INVALIDITE) && indexMois == 0) {
      this.addDetailTemporaliteMois(indexMois, SituationTemporaliteEnum.PENSION_INVALIDITE_CUMUL);
    }
  }

  // Méthode qui permet de mettre à jour la situation mensuelle du demandeur avec les données du mois en cours
  private applyNewSituation(simulationMensuelle: SimulationMensuelle): void {
    this.situation.rsa = this.aidesService.getMontantRSA(simulationMensuelle);
    this.situation.are = this.aidesService.getMontantComplementARE(simulationMensuelle);
    this.situation.aah = this.aidesService.getMontantAAH(simulationMensuelle);
    this.situation.ass = this.aidesService.getMontantASS(simulationMensuelle);
    this.situation.ppa = this.aidesService.getMontantPrimeActivite(simulationMensuelle);
    this.situation.apl = this.aidesService.getMontantAidePersonnaliseeLogement(simulationMensuelle);
    this.situation.als = this.aidesService.getMontantAllocationLogementSociale(simulationMensuelle);
    this.situation.alf = this.aidesService.getMontantAllocationLogementFamiliale(simulationMensuelle);
  }

  private checkPasDAide(montantAide: number): boolean {
    return this.getMontantReel(montantAide) == 0;
  }

  // Fonction qui permet de vérifier si le montant d'une aide à changer ce mois ci
  private checkForChangeInSituation(montantMoisPrecedent: number, montantActuel: number): boolean {
    return this.getMontantReel(montantMoisPrecedent) != this.getMontantReel(montantActuel);
  }

  private addDetailTemporaliteMois(indexMois: number, situation: string): void {
    this.detailTemporalite.detailsMensuels[indexMois].details.push(situation);
  }

  private getMontantReel(valeur): number {
    return valeur != null ? valeur : 0;
  }

  private getPhrasePPAAnticipee(simulationMensuelle: SimulationMensuelle): string {
    const dateSimulation = this.dateUtileService.getDateFromStringDate(simulationMensuelle.datePremierJourMoisSimule);
    const dateSimulationMMoins1 = this.dateUtileService.enleverMoisToDate(dateSimulation, 1);
    const moisSimulationMMoins1 = this.dateUtileService.getLibelleMoisFromDate(dateSimulationMMoins1);
    let libelleMois = "";

    switch (moisSimulationMMoins1) {
      case "août":
      case "avril":
      case "octobre":
        libelleMois = `d'${moisSimulationMMoins1}`;
        break;
      default:
        libelleMois = `de ${moisSimulationMMoins1}`;
        break;
    }
    return SituationTemporaliteEnum.PRIME_ACTIVITE_ANTICIPE + libelleMois;
  }


  private getPhraseAllocationPEPremierMois(simulationMensuelle: SimulationMensuelle, isASS: boolean = true): string {
    const dateSimulation = this.dateUtileService.getDateFromStringDate(simulationMensuelle.datePremierJourMoisSimule);
    const libelleMoisM = this.dateUtileService.getLibelleMoisFromDate(dateSimulation)
    const dateSimulationMMoins1 = this.dateUtileService.enleverMoisToDate(dateSimulation, 1);
    const moisSimulationMMoins1 = this.dateUtileService.getLibelleMoisFromDate(dateSimulationMMoins1);
    let libelleMoisMMoins1 = "";
    const typeAllocation = isASS ? 'ASS' : 'ARE';

    switch (moisSimulationMMoins1) {
      case "août":
      case "avril":
      case "octobre":
        libelleMoisMMoins1 = `d'${moisSimulationMMoins1}`;
        break;
      default:
        libelleMoisMMoins1 = `de ${moisSimulationMMoins1}`;
        break;
    }

    return `Vous percevez début ${libelleMoisM} le paiement de votre droit ${typeAllocation} ${libelleMoisMMoins1}, et fin ${libelleMoisM} votre nouveau salaire.`;
  }

}