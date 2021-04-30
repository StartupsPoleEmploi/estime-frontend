import { Injectable } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { AideSociale } from '@app/commun/models/aide-sociale';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { SimulationAidesSociales } from '@app/commun/models/simulation-aides-sociales';
import { SimulationMensuelle } from "@models/simulation-mensuelle";

@Injectable({providedIn: 'root'})
export class AidesService {

  public getMontantAAH(simulationSelected: SimulationMensuelle): number {
    let montant = 0;
    if(simulationSelected.mesAides) {
      for (let [codeAide, aide] of Object.entries(simulationSelected.mesAides)) {
        if(codeAide === CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES) {
          montant = Number(aide.montant);
        }
      }
    }
    return montant;
  }

  public getMontantASS(simulationSelected: SimulationMensuelle): number {
    let montant = 0;
    if(simulationSelected.mesAides) {
      for (let [codeAide, aide] of Object.entries(simulationSelected.mesAides)) {
        if(codeAide === CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE) {
          montant = Number(aide.montant);
        }
      }
    }
    return montant;
  }

  public getMessageAlerteASS(simulationSelected: SimulationMensuelle): string {
    let message = null;
    if(simulationSelected.mesAides) {
      for (let [codeAide, aide] of Object.entries(simulationSelected.mesAides)) {
        if(codeAide === CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE) {
          message = aide.messageAlerte;
        }
      }
    }
    return message;
  }

  public getMontantRSA(simulationSelected: SimulationMensuelle): number {
    let montant = 0;
    if(simulationSelected.mesAides) {
      for (let [codeAide, aide] of Object.entries(simulationSelected.mesAides)) {
        if(codeAide === CodesAidesEnum.RSA) {
          montant = Number(aide.montant);
        }
      }
    }
    return montant;
  }

  public getMontantPensionInvalidite(demandeurEmploiConnecte: DemandeurEmploi): number {
    let montant = 0;
    if(demandeurEmploiConnecte.ressourcesFinancieres &&
        demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM &&
          demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM.pensionInvalidite
    ) montant = Number(demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM.pensionInvalidite);
    return montant;
  }

  public getMontantAllocationSupplementaireInvalidite(demandeurEmploiConnecte: DemandeurEmploi): number {
    let montant = 0;
    if(demandeurEmploiConnecte.ressourcesFinancieres &&
        demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM &&
          demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM.allocationSupplementaireInvalidite
    ) montant = Number(demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM.allocationSupplementaireInvalidite);
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
        const aides = Object.values(simulationSelected.mesAides);
        aides.forEach((aide) => {
          if(this.isAideDemandeurPourraObtenir(aide)) {
            hasAidesObtenir = true;
            }
        });
    }
    return hasAidesObtenir;
  }

  public getAideByCodeFromSimulationMensuelle(simulationMensuelle: SimulationMensuelle, codeAideToFind: string): AideSociale {
    let aideSocial = null;

    for (let [codeAide, aide] of Object.entries(simulationMensuelle.mesAides)) {
        if(aide && codeAide === codeAideToFind) {
          aideSocial = aide;
        }
    }
    return aideSocial;
  }

  public getAideByCode(simulationAidesSociales: SimulationAidesSociales, codeAideToFind: string): AideSociale {
    let aideSocial = null;
    simulationAidesSociales.simulationsMensuelles.forEach(simulationMensuelle => {
      for (let [codeAide, aide] of Object.entries(simulationMensuelle.mesAides)) {
        if(aide && codeAide === codeAideToFind) {
          aideSocial = aide;
        }
      }
    });
    return aideSocial;
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
        for (let [codeAide, aide] of Object.entries(simulationSelected.mesAides)) {
          if(aide && codeAide === codeAideToFind) {
            hasAidesObtenir = true;
          }
        }
    }
    return hasAidesObtenir;
  }

  public isAideDemandeurPourraObtenir(aide: AideSociale): boolean {
    return aide && aide.code !== CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE
        && aide.code !== CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES
        && aide.code !== CodesAidesEnum.RSA
  }

}