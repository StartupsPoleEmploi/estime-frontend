import { Injectable } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { Simulation } from '@app/commun/models/simulation';
import { SimulationMensuelle } from "@models/simulation-mensuelle";
import { RessourceFinanciere } from '@app/commun/models/ressource-financiere';
import { DeConnecteBeneficiaireAidesService } from '../demandeur-emploi-connecte/de-connecte-beneficiaire-aides.service';
import { DeConnecteRessourcesFinancieresAvantSimulationService } from '../demandeur-emploi-connecte/de-connecte-ressources-financieres.service';

@Injectable({ providedIn: 'root' })
export class RessourcesFinancieresService {

  constructor(
    private deConnecteBeneficiaireAidesService: DeConnecteBeneficiaireAidesService,
    private deConnecteRessourcesFinanciresAvantSimulation: DeConnecteRessourcesFinancieresAvantSimulationService
  ) { }


  public hasRessourceFinanciere(simulation: Simulation, codeRessourceFinanciere: string) {
    let hasRessourceFinanciere = false;
    simulation.simulationsMensuelles.forEach(simulationMensuelle => {
      if (this.hasRessourceFinanciereByCode(simulationMensuelle, codeRessourceFinanciere)) {
        hasRessourceFinanciere = true;
      }
    });
    return hasRessourceFinanciere;
  }

  public hasRessourceFinanciereByCode(simulationSelected: SimulationMensuelle, codeRessourceFinanciereToFind: string): boolean {
    let hasRessourceFinanciere = false;
    if (simulationSelected) {
      for (let [codeRessourceFinanciere, ressourceFinanciere] of Object.entries(simulationSelected.ressourcesFinancieres)) {
        if (ressourceFinanciere && codeRessourceFinanciere === codeRessourceFinanciereToFind) {
          hasRessourceFinanciere = true;
        }
      }
    }
    return hasRessourceFinanciere;
  }

  public getRessourceFinanciereByCodeFromSimulationMensuelle(simulationMensuelle: SimulationMensuelle, codeRessourceFinanciereToFind: string): RessourceFinanciere {
    let ressourceFinanciere = null;
    for (let [codeRessourcesFinancieres, ressourceFinanciereSimulationMensuelle] of Object.entries(simulationMensuelle.ressourcesFinancieres)) {
      if (ressourceFinanciereSimulationMensuelle && codeRessourcesFinancieres === codeRessourceFinanciereToFind) {
        ressourceFinanciere = ressourceFinanciereSimulationMensuelle;
      }
    }
    return ressourceFinanciere;
  }

  public getRessourceFinanciereByCode(simulation: Simulation, codeRessourceFinanciereToFind: string): RessourceFinanciere {
    let ressourceFinanciere = null;
    simulation.simulationsMensuelles.forEach(simulationMensuelle => {
      for (let [codeRessourcesFinancieres, ressourceFinanciereSimulationMensuelle] of Object.entries(simulationMensuelle.ressourcesFinancieres)) {
        if (ressourceFinanciereSimulationMensuelle && codeRessourcesFinancieres === codeRessourceFinanciereToFind) {
          ressourceFinanciere = ressourceFinanciereSimulationMensuelle;
        }
      }
    });
    return ressourceFinanciere;
  }

  public getMontantRessourceFinanciereByCode(simulationSelected: SimulationMensuelle, codeAideSelected: string) {
    let montant = 0;
    if (this.getRessourceFinanciereByCodeFromSimulationMensuelle(simulationSelected, codeAideSelected)) {
      montant = this.getRessourceFinanciereByCodeFromSimulationMensuelle(simulationSelected, codeAideSelected).montant;
    }
    return montant;
  }

  public isRessourceFinanciereOuAideADemander(ressourceFinanciereOuAide: RessourceFinanciere): boolean {
    return ressourceFinanciereOuAide && (
      ressourceFinanciereOuAide.code == CodesAidesEnum.AIDE_MOBILITE
      || ressourceFinanciereOuAide.code == CodesAidesEnum.AGEPI
      || (!this.deConnecteBeneficiaireAidesService.isBeneficiaireAideLogement()
        && (ressourceFinanciereOuAide.code == CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT
          || ressourceFinanciereOuAide.code == CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE
          || ressourceFinanciereOuAide.code == CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE)
      )
      || (this.isPrimeActiviteADemander()
        && ressourceFinanciereOuAide.code == CodesAidesEnum.PRIME_ACTIVITE
      )
    )
  }

  private isPrimeActiviteADemander(): boolean {
    return !this.deConnecteBeneficiaireAidesService.hasFoyerRSA()
      && !this.deConnecteBeneficiaireAidesService.isBeneficiaireRSA()
      && !this.deConnecteRessourcesFinanciresAvantSimulation.hasPrimeActiviteAvantSimulation();
  }

  public isRessourceFinanciereOuAideAvecDescription(ressourceFinanciereOuAide: RessourceFinanciere): boolean {
    return ressourceFinanciereOuAide && (
      ressourceFinanciereOuAide.code == CodesAidesEnum.AIDE_MOBILITE
      || ressourceFinanciereOuAide.code == CodesAidesEnum.AGEPI
      || ressourceFinanciereOuAide.code == CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE
      || ressourceFinanciereOuAide.code == CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT
      || ressourceFinanciereOuAide.code == CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE
      || ressourceFinanciereOuAide.code == CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE
      || ressourceFinanciereOuAide.code == CodesAidesEnum.COMPLEMENT_AIDE_RETOUR_EMPLOI
      || ressourceFinanciereOuAide.code == CodesAidesEnum.PRIME_ACTIVITE
    )
  }

}