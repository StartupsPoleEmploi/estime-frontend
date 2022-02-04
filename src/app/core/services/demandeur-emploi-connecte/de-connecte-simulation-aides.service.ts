import { Injectable } from '@angular/core';
import { SimulationAides } from "@models/simulation-aides";
import { SessionStorageService } from "ngx-webstorage";
import { KeysStorageEnum } from "@app/commun/enumerations/keys-storage.enum";
import { DeConnecteService } from './de-connecte.service';
import { DeConnecteRessourcesFinancieresService } from './de-connecte-ressources-financieres.service';
import { SimulationMensuelle } from '@models/simulation-mensuelle';
import { NumberUtileService } from '../utile/number-util.service';
import { AidesCPAM } from '@app/commun/models/aides-cpam';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { Aide } from '@app/commun/models/aide';
import { CodesRessourcesFinancieresEnum } from '@app/commun/enumerations/codes-ressources-financieres.enum';
import { LibellesRessourcesFinancieresEnum } from '@app/commun/enumerations/libelles-ressources-financieres.enum';
import { AidesService } from '../utile/aides.service';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { LibellesAidesEnum } from '@app/commun/enumerations/libelles-aides.enum';

@Injectable({ providedIn: 'root' })
export class DeConnecteSimulationAidesService {

  private simulationAides: SimulationAides;


  codesAidesEnum: typeof CodesAidesEnum = CodesAidesEnum;
  libellesAidesEnum: typeof LibellesAidesEnum = LibellesAidesEnum;
  codesRessourcesFinancieresEnum: typeof CodesRessourcesFinancieresEnum = CodesRessourcesFinancieresEnum;
  libellesRessourcesFinancieresEnum: typeof LibellesRessourcesFinancieresEnum = LibellesRessourcesFinancieresEnum;

  constructor(
    private aidesService: AidesService,
    private deConnecteService: DeConnecteService,
    private deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    private numberUtileService: NumberUtileService,
    private sessionStorageService: SessionStorageService
  ) {

  }

  public getSimulationAides(): SimulationAides {
    if (!this.simulationAides) {
      this.simulationAides = this.sessionStorageService.retrieve(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION_AIDES_SOCIALE);
    }
    return this.simulationAides;
  }

  public setSimulationAides(simulationAides: SimulationAides): void {
    this.simulationAides = simulationAides;
    this.saveSimulationAidesInSessionStorage();
  }

  public calculerMontantTotalRessourcesMois(simulation: SimulationMensuelle): number {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    const ressourcesFinancieres = demandeurEmploiConnecte.ressourcesFinancieres;

    const salaireFuturTravail = this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.futurTravail.salaire.montantNet);
    const beneficesMicroEntreprise = this.numberUtileService.getMontantSafe(this.deConnecteRessourcesFinancieresService.getBeneficesMicroEntrepriseSur1Mois());
    const chiffreAffairesIndependant = this.numberUtileService.getMontantSafe(this.deConnecteRessourcesFinancieresService.getChiffreAffairesIndependantSur1Mois());
    const revenusImmobilier = this.numberUtileService.getMontantSafe(this.deConnecteRessourcesFinancieresService.getRevenusImmobilierSur1Mois());
    const montantAidesCPAM = this.calculerMontantAidesCPAM(ressourcesFinancieres.aidesCPAM);
    const montantTotalAidesMoisSimule = this.calculerMontantAidesSimuleesMois(simulation);

    return Math.floor(salaireFuturTravail + beneficesMicroEntreprise + chiffreAffairesIndependant + revenusImmobilier + montantAidesCPAM + montantTotalAidesMoisSimule);
  }

  private calculerMontantAidesSimuleesMois(simulation: SimulationMensuelle) {
    let montant = 0;
    if (simulation.mesAides) {
      const aides = Object.values(simulation.mesAides);
      aides.forEach((aide) => {
        if (aide) {
          montant += this.numberUtileService.getMontantSafe(aide.montant);
        }
      });
    }
    return montant;
  }

  private calculerMontantAidesCPAM(aidesCPAM: AidesCPAM) {
    let montant = 0;
    if (aidesCPAM) {
      montant += this.numberUtileService.getMontantSafe(aidesCPAM.pensionInvalidite)
        + this.numberUtileService.getMontantSafe(aidesCPAM.allocationSupplementaireInvalidite);
    }
    return montant
  }

  private saveSimulationAidesInSessionStorage(): void {
    this.sessionStorageService.store(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION_AIDES_SOCIALE, this.simulationAides);
  }



  public getAidesSimulationMensuelle(simulationMensuelle: SimulationMensuelle): Aide[] {
    let aides = [];
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.AIDE_RETOUR_EMPLOI), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.RSA), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.AIDE_MOBILITE), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.AGEPI), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.ALLOCATION_ADULTES_HANDICAPES), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.ALLOCATIONS_FAMILIALES), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.ALLOCATION_SOUTIEN_FAMILIAL), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.COMPLEMENT_FAMILIAL), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.PENSIONS_ALIMENTAIRES), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.PRIME_ACTIVITE), aides);
    return aides;
  }

  public getRevenusApresSimulation(demandeurEmploi: DemandeurEmploi): Aide[] {
    let revenusMois = [];
    this.addAideToAidesArray(this.createAideAvecRevenus(this.codesRessourcesFinancieresEnum.PAIE, this.libellesRessourcesFinancieresEnum.SALAIRE, this.deConnecteRessourcesFinancieresService.getFuturSalaireNet()), revenusMois);
    this.addAideToAidesArray(this.createAideAvecRevenus(this.codesAidesEnum.PENSION_INVALIDITE, this.libellesAidesEnum.PENSION_INVALIDITE, this.deConnecteRessourcesFinancieresService.getPensionInvalidite()), revenusMois);
    this.addAideToAidesArray(this.createAideAvecRevenus(this.codesAidesEnum.ALLOCATION_SUPPLEMENTAIRE_INVALIDITE, this.libellesAidesEnum.ALLOCATION_SUPPLEMENTAIRE_INVALIDITE, this.deConnecteRessourcesFinancieresService.getAllocationSupplementaireInvalidite()), revenusMois);
    this.addAideToAidesArray(this.createAideAvecRevenus(this.codesRessourcesFinancieresEnum.MICRO_ENTREPRENEUR, this.libellesRessourcesFinancieresEnum.MICRO_ENTREPRENEUR, this.deConnecteRessourcesFinancieresService.getBeneficesMicroEntrepriseSur1Mois()), revenusMois);
    this.addAideToAidesArray(this.createAideAvecRevenus(this.codesRessourcesFinancieresEnum.TRAVAILLEUR_INDEPENDANT, this.libellesRessourcesFinancieresEnum.TRAVAILLEUR_INDEPENDANT, this.deConnecteRessourcesFinancieresService.getChiffreAffairesIndependantSur1Mois()), revenusMois);
    this.addAideToAidesArray(this.createAideAvecRevenus(this.codesRessourcesFinancieresEnum.IMMOBILIER, this.libellesRessourcesFinancieresEnum.IMMOBILIER, this.deConnecteRessourcesFinancieresService.getRevenusImmobilierSur1Mois()), revenusMois);
    return revenusMois;
  }

  private addAideToAidesArray(aide: Aide, aides: Aide[]) {
    if (aide != null) aides.push(aide);
    return aides;
  }

  private createAideAvecRevenus(code, nom, montant): Aide {
    let aide = null;
    if (montant > 0) {
      aide = new Aide();
      aide.code = code;
      aide.nom = nom;
      aide.montant = montant;
    }
    return aide;
  }

}