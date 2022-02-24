import { Injectable } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { Simulation } from '@app/commun/models/simulation';
import { SimulationMensuelle } from "@models/simulation-mensuelle";
import { RessourceFinanciere } from '@app/commun/models/ressource-financiere';
import { Aide } from '@app/commun/models/aide';
import { AidesService } from './aides.service';

@Injectable({ providedIn: 'root' })
export class RessourcesFinancieresService {

  constructor(
    private aidesService: AidesService
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

  public isRessourceFinanciereDemandeurPourraObtenir(ressourceFinanciere: RessourceFinanciere): boolean {
    return ressourceFinanciere && ressourceFinanciere.code !== CodesAidesEnum.SALAIRE
      && ressourceFinanciere.code !== CodesAidesEnum.IMMOBILIER
      && ressourceFinanciere.code !== CodesAidesEnum.MICRO_ENTREPRENEUR
      && ressourceFinanciere.code !== CodesAidesEnum.TRAVAILLEUR_INDEPENDANT;
  }

  public isRessourceFinanciereAvecDetail(ressourceFinanciere: RessourceFinanciere): boolean {
    if (typeof ressourceFinanciere == typeof Aide) {
      let aide = ressourceFinanciere as Aide;
      return this.aidesService.isAideAvecDetail(aide);
    } return false;
  }
}