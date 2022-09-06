import { Injectable } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { SimulationMensuelle } from "@models/simulation-mensuelle";
import { RessourceFinanciere } from '@app/commun/models/ressource-financiere';
import { Aide } from '@app/commun/models/aide';
import { AidesService } from './aides.service';
import { NumberUtileService } from './number-util.service';
import { AidesCPAM } from '@app/commun/models/aides-cpam';
import { LibellesAidesEnum } from '@app/commun/enumerations/libelles-aides.enum';
import { RessourcesFinancieresService } from './ressources-financieres.service';

@Injectable({ providedIn: 'root' })
export class SimulationService {

  codesAidesEnum: typeof CodesAidesEnum = CodesAidesEnum;
  libellesAidesEnum: typeof LibellesAidesEnum = LibellesAidesEnum;

  constructor(
    private aidesService: AidesService,
    private numberUtileService: NumberUtileService,
    private ressourcesFinancieresService: RessourcesFinancieresService
  ) { }

  public calculerMontantTotalRessourcesMois(simulation: SimulationMensuelle): number {
    const montantTotalRessourcesFinancieresMoisSimule = this.calculerMontantRessourcesFinancieresMois(simulation);
    const montantTotalAidesMoisSimule = this.calculerMontantAidesMois(simulation);

    return Math.floor(montantTotalRessourcesFinancieresMoisSimule + montantTotalAidesMoisSimule);
  }

  public calculerMontantAidesMois(simulation: SimulationMensuelle) {
    let montant = 0;
    if (simulation.aides) {
      const aides = this.getAidesSimulationMensuelle(simulation);
      aides.forEach((aide) => {
        if (aide) {
          montant += this.numberUtileService.getMontantSafe(aide.montant);
        }
      });
    }
    return montant;
  }

  public calculerMontantRessourcesFinancieresMois(simulation: SimulationMensuelle) {
    let montant = 0;
    if (simulation.ressourcesFinancieres) {
      const aides = this.getRessourcesFinancieresSimulationMensuelle(simulation);
      aides.forEach((ressourcesFinancieres) => {
        if (ressourcesFinancieres) {
          montant += this.numberUtileService.getMontantSafe(ressourcesFinancieres.montant);
        }
      });
    }
    return montant;
  }

  public calculerMontantAidesCPAM(aidesCPAM: AidesCPAM) {
    let montant = 0;
    if (aidesCPAM) {
      montant += this.numberUtileService.getMontantSafe(aidesCPAM.pensionInvalidite);
    }
    return montant
  }

  public getAidesSimulationMensuelle(simulationMensuelle: SimulationMensuelle): Aide[] {
    let aides = [];
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.AGEPI), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.AIDE_MOBILITE), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.AIDE_RETOUR_EMPLOI), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.ALLOCATION_ADULTES_HANDICAPES), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.ALLOCATIONS_FAMILIALES), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.ALLOCATION_SOUTIEN_FAMILIAL), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.COMPLEMENT_FAMILIAL), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.PENSION_INVALIDITE), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.PENSIONS_ALIMENTAIRES), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.PRESTATION_ACCUEIL_JEUNE_ENFANT), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.PRIME_ACTIVITE), aides);
    this.addAideToAidesArray(this.aidesService.getAideByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.RSA), aides);
    return aides;
  }

  public getRessourcesFinancieresSimulationMensuelle(simulationMensuelle: SimulationMensuelle): RessourceFinanciere[] {
    let ressourcesFinancieres = [];
    this.addRessourceFinanciereToRessourcesFinancieresArray(this.ressourcesFinancieresService.getRessourceFinanciereByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.IMMOBILIER), ressourcesFinancieres);
    this.addRessourceFinanciereToRessourcesFinancieresArray(this.ressourcesFinancieresService.getRessourceFinanciereByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.MICRO_ENTREPRENEUR), ressourcesFinancieres);
    this.addRessourceFinanciereToRessourcesFinancieresArray(this.ressourcesFinancieresService.getRessourceFinanciereByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.SALAIRE), ressourcesFinancieres);
    this.addRessourceFinanciereToRessourcesFinancieresArray(this.ressourcesFinancieresService.getRessourceFinanciereByCodeFromSimulationMensuelle(simulationMensuelle, this.codesAidesEnum.TRAVAILLEUR_INDEPENDANT), ressourcesFinancieres);
    return ressourcesFinancieres;
  }

  public getRessourcesFinancieresEtAidesSimulationMensuelle(simulationMensuelle: SimulationMensuelle): RessourceFinanciere[] {
    return this.getRessourcesFinancieresSimulationMensuelle(simulationMensuelle).concat(this.getAidesSimulationMensuelle(simulationMensuelle));
  }

  private addAideToAidesArray(aide: Aide, aides: Aide[]) {
    if (aide != null) aides.push(aide);
    return aides;
  }

  private addRessourceFinanciereToRessourcesFinancieresArray(ressourceFinanciere: RessourceFinanciere, ressourcesFinancieres: RessourceFinanciere[]) {
    if (ressourceFinanciere != null) ressourcesFinancieres.push(ressourceFinanciere);
    return ressourcesFinancieres;
  }

}