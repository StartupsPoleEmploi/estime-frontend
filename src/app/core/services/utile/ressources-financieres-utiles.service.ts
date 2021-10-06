import { Injectable } from '@angular/core';
import { AidesLogement } from '@app/commun/models/aides-logement';
import { AllocationARE } from '@app/commun/models/allocation-are';
import { AllocationASS } from '@app/commun/models/allocation-ass';
import { AllocationsLogement } from '@app/commun/models/allocations-logement';
import { NumberUtileService } from "@app/core/services/utile/number-util.service";
import { AidesCAF } from "@models/aides-caf";
import { AidesCPAM } from '@models/aides-cpam';
import { AidesFamiliales } from '@models/aides-familiales';
import { AidesPoleEmploi } from "@models/aides-pole-emploi";
import { MoisTravailleAvantSimulation } from '@models/mois-travaille-avant-simulation';
import { RessourcesFinancieres } from "@models/ressources-financieres";
import { ControleChampFormulaireService } from './controle-champ-formulaire.service';

@Injectable({ providedIn: 'root' })
export class RessourcesFinancieresUtileService {

  constructor(
    private controleChampFormulaireService: ControleChampFormulaireService,
    private numberUtileService: NumberUtileService
  ) {

  }

  public creerAidesCPAM(): AidesCPAM {
    const aidesCPAM = new AidesCPAM();
    aidesCPAM.allocationSupplementaireInvalidite = 0;
    return aidesCPAM;
  }

  public creerAidesFamiliales(): AidesFamiliales {
    const aidesFamiliales = new AidesFamiliales();
    aidesFamiliales.allocationsFamiliales = 0;
    aidesFamiliales.allocationSoutienFamilial = 0;
    aidesFamiliales.complementFamilial = 0;
    aidesFamiliales.pensionsAlimentairesFoyer = 0;
    aidesFamiliales.prestationAccueilJeuneEnfant = 0;
    return aidesFamiliales;
  }

  public creerAidesLogement(): AidesLogement {
    const aidesLogement = new AidesLogement();
    aidesLogement.aidePersonnaliseeLogement = this.creerAllocationLogement();
    aidesLogement.allocationLogementFamiliale = this.creerAllocationLogement();;
    aidesLogement.allocationLogementSociale = this.creerAllocationLogement();;
    return aidesLogement;
  }

  public creerAllocationLogement(): AllocationsLogement {
    const allocationsLogement = new AllocationsLogement();
    allocationsLogement.moisNMoins1 = 0;
    allocationsLogement.moisNMoins2 = 0;
    allocationsLogement.moisNMoins3 = 0;
    return allocationsLogement;
  }

  public creerAidesCAF(): AidesCAF {
    const aidesCAF = new AidesCAF();
    return aidesCAF;
  }

  public creerAidesPoleEmploi(): AidesPoleEmploi {
    const aidesPoleEmploi = new AidesPoleEmploi();
    return aidesPoleEmploi;
  }

  public creerAllocationARE(): AllocationARE {
    const allocationARE = new AllocationARE();
    allocationARE.allocationJournaliereNet = null;
    allocationARE.allocationMensuelleNet = null;
    return allocationARE;
  }

  public creerAllocationASS(): AllocationASS {
    const allocationASS = new AllocationASS();
    allocationASS.allocationJournaliereNet = null;
    allocationASS.allocationMensuelleNet = null;
    allocationASS.dateDerniereOuvertureDroit = null;
    return allocationASS;
  }

  /**
   * Méthode permettant de remplacer les virgules présentes dans les montants
   * pour lesquels on autorise l'utilisateur à saisir un montant avec une virgule ou un point.
   *
   * Transformation nécessaire car seul le point est autoriser côté serveur.
   *
   * TODO JLA : à voir si on ne peut pas faire mieux avec un pipe.
   * Peut-être pas possible car l'utilisation d'un pipe avec le two way data binding ne fonctionne pas.
   */
  public replaceCommaByDotMontantsRessourcesFinancieres(ressourcesFinancieres: RessourcesFinancieres) {
    if (ressourcesFinancieres.aidesPoleEmploi) {
      this.replaceCommaByDotMontantsAidesPoleEmploi(ressourcesFinancieres);
    }
    if (ressourcesFinancieres.aidesCAF) {
      this.replaceCommaByDotMontantsAidesCAF(ressourcesFinancieres);
    }
    if (ressourcesFinancieres.aidesCPAM) {
      ressourcesFinancieres.aidesCPAM.pensionInvalidite = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCPAM.pensionInvalidite);
      ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite);
    }
    if(ressourcesFinancieres.salaire) {
      ressourcesFinancieres.salaire.montantNet  = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.salaire.montantNet);
      ressourcesFinancieres.salaire.montantBrut  = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.salaire.montantBrut);
    }
    ressourcesFinancieres.beneficesMicroEntrepriseDernierExercice = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.beneficesMicroEntrepriseDernierExercice);
    ressourcesFinancieres.chiffreAffairesIndependantDernierExercice = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.chiffreAffairesIndependantDernierExercice);
    ressourcesFinancieres.revenusImmobilier3DerniersMois = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.revenusImmobilier3DerniersMois);
    return ressourcesFinancieres;
  }

  public isNombreMoisTravailleAuCoursDerniersMoisSelectedValide(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return !ressourcesFinancieres.hasTravailleAuCoursDerniersMois ||
      (ressourcesFinancieres.hasTravailleAuCoursDerniersMois
        && ressourcesFinancieres.nombreMoisTravaillesDerniersMois != 0)
  }

  /**
   * Fonction qui permet de déterminer si la saisie des champs de cumul salaire est correct.
   * Conditions de validité :
   *  -> si le demandeur n'a pas travaillé ces derniers mois.
   *  -> si le demandeur est bénéficiaire ASS ou RSA et qu'au moins 1 champ salaire est renseigné.
   *  -> si le demandeur est bénéficiaire AAH.
   *    -> si il a indiqué avoir travaillé 4 mois et qu'au moins 1 champ salaire est renseigné,
   *    -> si il a indiqué avoir travaillé 5 mois et qu'au moins 2 champs salaire sont renseignés,
   *    -> si il a indiqué avoir travaillé 6 mois et que 3 champs salaire sont renseignés.
   *
   * @param ressourcesFinancieres
   */
  public isChampsSalairesValides(ressourcesFinancieres: RessourcesFinancieres, isBeneficiaireAAH: boolean, isBeneficiareASSOuRSA: boolean): boolean {
    let isChampsSalairesValides = true;
    if(ressourcesFinancieres.hasTravailleAuCoursDerniersMois) {
      if(isBeneficiareASSOuRSA) {
        isChampsSalairesValides = this.getNombreMoisTravaillesDerniersMois(ressourcesFinancieres) >= 1;
      }
      if(isBeneficiaireAAH) {
        //Le plus(+) est nécessaire sinon on tombe dans le default case - à revoir
        switch(+ressourcesFinancieres.nombreMoisTravaillesDerniersMois) {
          // si on indique n'avoir travaillé qu'1 mois on ne peut remplir plus d'1 salaire
          case 1: {
            isChampsSalairesValides = this.getNombreMoisTravaillesDerniersMois(ressourcesFinancieres) <= 1;
            break;
          }
          // si on indique n'avoir travaillé que 2 mois on ne peut remplir plus de 2 salaire
          case 2: {
            isChampsSalairesValides = this.getNombreMoisTravaillesDerniersMois(ressourcesFinancieres) <= 2;
            break;
          }
          // si on indique avoir travaillé 4 mois on doit remplir au moins 1 salaire
          case 4: {
            isChampsSalairesValides = this.getNombreMoisTravaillesDerniersMois(ressourcesFinancieres) >= 1;
            break;
          }
          // si on indique avoir travaillé 5 mois on doit remplir au moins 2 salaires
          case 5: {
            isChampsSalairesValides = this.getNombreMoisTravaillesDerniersMois(ressourcesFinancieres) >= 2;
            break;
          }
          // si on indique avoir travaillé 6 mois on doit remplir au moins 3 salaires
          case 6: {
            isChampsSalairesValides = this.getNombreMoisTravaillesDerniersMois(ressourcesFinancieres) === 3;
            break;
          }
          default: {
            isChampsSalairesValides = true;
            break;
          }
        }
      }
    }
    return isChampsSalairesValides;
  }

  private getNombreMoisTravaillesDerniersMois(ressourcesFinancieres: RessourcesFinancieres): number {
    let nombreMoisTravaillesDerniersMois = 0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins1)?1:0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins2)?1:0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins3)?1:0;
    return nombreMoisTravaillesDerniersMois;
  }

  private isMoisTravaille(moisTravailleAvantSimulation: MoisTravailleAvantSimulation): boolean {
    return !moisTravailleAvantSimulation.isSansSalaire && moisTravailleAvantSimulation.salaire.montantNet > 0;
  }

  public isMontantJournalierAssInvalide(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return ressourcesFinancieres.aidesPoleEmploi.allocationASS && (ressourcesFinancieres.aidesPoleEmploi.allocationASS.allocationJournaliereNet == 0 || ressourcesFinancieres.aidesPoleEmploi.allocationASS.allocationJournaliereNet > this.controleChampFormulaireService.MONTANT_ASS_JOURNALIER_MAX);
  }

  public isMontantJournalierRSAInvalide(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return ressourcesFinancieres.aidesCAF.allocationRSA && ressourcesFinancieres.aidesCAF.allocationRSA == 0;
  }

  private replaceCommaByDotMontantsAidesCAF(ressourcesFinancieres: RessourcesFinancieres): void {
    if (ressourcesFinancieres.aidesCAF) {
      ressourcesFinancieres.aidesCAF.allocationAAH = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.allocationAAH);
      ressourcesFinancieres.aidesCAF.allocationRSA = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.allocationRSA);
      if (ressourcesFinancieres.aidesCAF.aidesLogement) {
        if (ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement) {
          ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins1 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins1);
          ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins2 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins2);
          ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins3 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins3);
        }
        if (ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale) {
          ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins1 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins1);
          ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins2 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins2);
          ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins3 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins3);
        }
        if (ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale) {
          ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins1 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins1);
          ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins2 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins2);
          ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins3 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins3);
        }
      }
      if(ressourcesFinancieres.aidesCAF.aidesFamiliales) {
        ressourcesFinancieres.aidesCAF.aidesFamiliales.allocationsFamiliales = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesFamiliales.allocationsFamiliales);
        ressourcesFinancieres.aidesCAF.aidesFamiliales.allocationSoutienFamilial = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesFamiliales.allocationSoutienFamilial);
        ressourcesFinancieres.aidesCAF.aidesFamiliales.complementFamilial = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesFamiliales.complementFamilial);
        ressourcesFinancieres.aidesCAF.aidesFamiliales.pensionsAlimentairesFoyer = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesFamiliales.pensionsAlimentairesFoyer);
        ressourcesFinancieres.aidesCAF.aidesFamiliales.prestationAccueilJeuneEnfant = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesFamiliales.prestationAccueilJeuneEnfant);
      }
    }
  }

  private replaceCommaByDotMontantsAidesPoleEmploi(ressourcesFinancieres: RessourcesFinancieres): void {
    if(ressourcesFinancieres.aidesPoleEmploi.allocationASS) {
      ressourcesFinancieres.aidesPoleEmploi.allocationASS.allocationJournaliereNet = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesPoleEmploi.allocationASS.allocationJournaliereNet);
      ressourcesFinancieres.aidesPoleEmploi.allocationASS.allocationMensuelleNet = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesPoleEmploi.allocationASS.allocationMensuelleNet);
    }
    if(ressourcesFinancieres.aidesPoleEmploi.allocationARE) {
      ressourcesFinancieres.aidesPoleEmploi.allocationARE.allocationJournaliereNet = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesPoleEmploi.allocationARE.allocationJournaliereNet);
      ressourcesFinancieres.aidesPoleEmploi.allocationARE.allocationMensuelleNet = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesPoleEmploi.allocationARE.allocationMensuelleNet);
    }
  }

}