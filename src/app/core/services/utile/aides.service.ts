import { Injectable } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { Aide } from '@app/commun/models/aide';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { SimulationAides } from '@app/commun/models/simulation-aides';
import { SimulationMensuelle } from "@models/simulation-mensuelle";

@Injectable({providedIn: 'root'})
export class AidesService {

  private static AIDE_MOBILITE_TRAJET_KM_ALLER_MINIMUM = 30;
  private static AIDE_MOBILITE_TRAJET_KM_ALLER_MINIMUM_DOM = 10;

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
        demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM &&
          demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.pensionInvalidite
    ) montant = Number(demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.pensionInvalidite);
    return montant;
  }

  public getMontantAllocationSupplementaireInvalidite(demandeurEmploiConnecte: DemandeurEmploi): number {
    let montant = 0;
    if(demandeurEmploiConnecte.ressourcesFinancieres &&
        demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM &&
          demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite
    ) montant = Number(demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite);
    return montant;
  }

  public hasAidesObtenirSimulationAides(simulationAides: SimulationAides): boolean  {
    let hasAidesObtenirSimulationAides = false;
    simulationAides.simulationsMensuelles.forEach(simulationMensuelle => {
      if(this.hasAidesObtenir(simulationMensuelle)) {
        hasAidesObtenirSimulationAides = true;
      }
    });
    return hasAidesObtenirSimulationAides;
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

  public getAideByCodeFromSimulationMensuelle(simulationMensuelle: SimulationMensuelle, codeAideToFind: string): Aide {
    let aide = null;

    for (let [codeAide, aideSimulationMensuelle] of Object.entries(simulationMensuelle.mesAides)) {
      if(aideSimulationMensuelle && codeAide === codeAideToFind) {
        aide = aideSimulationMensuelle;
      }
    }
    return aide;
  }

  public getAideByCode(simulationAides: SimulationAides, codeAideToFind: string): Aide {
    let aide = null;
    simulationAides.simulationsMensuelles.forEach(simulationMensuelle => {
      for (let [codeAide, aideSimulationMensuelle] of Object.entries(simulationMensuelle.mesAides)) {
        if(aideSimulationMensuelle && codeAide === codeAideToFind) {
          aide = aideSimulationMensuelle;
        }
      }
    });
    return aide;
  }

  public hasAide(simulationAides: SimulationAides, codeAide: string) {
    let hasAide = false;
    simulationAides.simulationsMensuelles.forEach(simulationMensuelle => {
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

  public isAideDemandeurPourraObtenir(aide: Aide): boolean {
    return aide && aide.code !== CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE
        && aide.code !== CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES
        && aide.code !== CodesAidesEnum.RSA
  }

  /**
   * Méthode permettant de déterminée si le demandeur pourra prétendre à l'aide à la mobilité.
   * Est éligible :
   *  - si des DOM et trajet supérieur ou égale au seuil minimum d'éligibilité pour les DOM
   *  - si métropolitain et trajet supérieur ou égale au seuil minimum d'éligibilité pour les métropolitains
   * @param demandeurEmploiConnecte
   * @param distanceKmDomicileTravail
   * @returns true si isEligibleAideMobilite
   */
  public isEligibleAideMobilite(demandeurEmploiConnecte: DemandeurEmploi, distanceKmDomicileTravail: number): boolean {
    return (demandeurEmploiConnecte.informationsPersonnelles.habiteDansDOM
      && distanceKmDomicileTravail >= AidesService.AIDE_MOBILITE_TRAJET_KM_ALLER_MINIMUM_DOM)
      || (!demandeurEmploiConnecte.informationsPersonnelles.habiteDansDOM
      && distanceKmDomicileTravail >= AidesService.AIDE_MOBILITE_TRAJET_KM_ALLER_MINIMUM) ;
  }

}