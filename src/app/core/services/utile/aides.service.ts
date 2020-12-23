import { Injectable } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { SimulationAidesSociales } from '@app/commun/models/simulation-aides-sociales';
import { SimulationMensuelle } from "@models/simulation-mensuelle";

@Injectable({providedIn: 'root'})
export class AidesService {

  public getMontantASS(simulationSelected: SimulationMensuelle): number {
    let montant = 0;
    if(simulationSelected.mesAides) {
      for (let [codeAide, aide] of Object.entries(simulationSelected.mesAides)) {
        if(codeAide === CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE) {
          montant = aide.montant;
        }
      }
    }
    return montant;
  }

  public hasAidesObtenirSimulationAidesSociales(simulationAidesSociales: SimulationAidesSociales): boolean  {
    let hasAidesObtenirSimulationAidesSociales = false;
    simulationAidesSociales.simulationsMensuelles.forEach(simulationMensuelle => {
      if(this.hasAidesObtenir(simulationMensuelle)) {
        hasAidesObtenirSimulationAidesSociales = true;
      }
    });
    return hasAidesObtenirSimulationAidesSociales;
  }

  public hasAidesObtenir(simulationSelected: SimulationMensuelle): boolean {
    let hasAidesObtenir = false;
    if(simulationSelected) {
      if(Object.entries(simulationSelected.mesAides).length > 1) {
        hasAidesObtenir = true;
      }
      if(Object.entries(simulationSelected.mesAides).length === 1) {
        for (let [codeAide, aide] of Object.entries(simulationSelected.mesAides)) {
          if(aide && codeAide !== CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE) {
            hasAidesObtenir = true;
          }
        }
      }
    }
    return hasAidesObtenir;
  }

  public hasAide(simulationAidesSociales: SimulationAidesSociales, codeAide: string) {
    let hasAide = false;
    simulationAidesSociales.simulationsMensuelles.forEach(simulationMensuelle => {
      if(this.hasAideByCode(simulationMensuelle, codeAide)) {
        hasAide = true;
      }
    });
    return hasAide;
  }

  public hasAideByCode(simulationSelected: SimulationMensuelle, codeAideToFind: string): boolean {
    let hasAidesObtenir = false;
    if(simulationSelected) {
      if(Object.entries(simulationSelected.mesAides).length > 1) {
        hasAidesObtenir = true;
      }
      if(Object.entries(simulationSelected.mesAides).length === 1) {
        for (let [codeAide, aide] of Object.entries(simulationSelected.mesAides)) {
          if(aide && codeAide === codeAideToFind) {
            hasAidesObtenir = true;
          }
        }
      }
    }
    return hasAidesObtenir;
  }

}