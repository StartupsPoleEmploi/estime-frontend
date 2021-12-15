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
import { DeConnecteBeneficiaireAidesService } from '../demandeur-emploi-connecte/de-connecte-beneficiaire-aides.service';
import { ControleChampFormulaireService } from './controle-champ-formulaire.service';
import { DateUtileService } from './date-util.service';

@Injectable({ providedIn: 'root' })
export class RessourcesFinancieresUtileService {

  constructor(
    private controleChampFormulaireService: ControleChampFormulaireService,
    private dateUtileService: DateUtileService,
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
    aidesLogement.allocationLogementFamiliale = this.creerAllocationLogement();
    aidesLogement.allocationLogementSociale = this.creerAllocationLogement();
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
    if (ressourcesFinancieres.salaire) {
      ressourcesFinancieres.salaire.montantNet = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.salaire.montantNet);
      ressourcesFinancieres.salaire.montantBrut = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.salaire.montantBrut);
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

  private getNombreMoisTravaillesDerniersMois(ressourcesFinancieres: RessourcesFinancieres): number {
    let nombreMoisTravaillesDerniersMois = 0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.periodeTravailleeAvantSimulation.mois[0]) ? 1 : 0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.periodeTravailleeAvantSimulation.mois[1]) ? 1 : 0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.periodeTravailleeAvantSimulation.mois[2]) ? 1 : 0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.periodeTravailleeAvantSimulation.mois[3]) ? 1 : 0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.periodeTravailleeAvantSimulation.mois[4]) ? 1 : 0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.periodeTravailleeAvantSimulation.mois[5]) ? 1 : 0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.periodeTravailleeAvantSimulation.mois[6]) ? 1 : 0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.periodeTravailleeAvantSimulation.mois[7]) ? 1 : 0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.periodeTravailleeAvantSimulation.mois[8]) ? 1 : 0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.periodeTravailleeAvantSimulation.mois[9]) ? 1 : 0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.periodeTravailleeAvantSimulation.mois[10]) ? 1 : 0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.periodeTravailleeAvantSimulation.mois[11]) ? 1 : 0;
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
      if (ressourcesFinancieres.aidesCAF.aidesFamiliales) {
        ressourcesFinancieres.aidesCAF.aidesFamiliales.allocationsFamiliales = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesFamiliales.allocationsFamiliales);
        ressourcesFinancieres.aidesCAF.aidesFamiliales.allocationSoutienFamilial = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesFamiliales.allocationSoutienFamilial);
        ressourcesFinancieres.aidesCAF.aidesFamiliales.complementFamilial = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesFamiliales.complementFamilial);
        ressourcesFinancieres.aidesCAF.aidesFamiliales.pensionsAlimentairesFoyer = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesFamiliales.pensionsAlimentairesFoyer);
        ressourcesFinancieres.aidesCAF.aidesFamiliales.prestationAccueilJeuneEnfant = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesCAF.aidesFamiliales.prestationAccueilJeuneEnfant);
      }
    }
  }

  private replaceCommaByDotMontantsAidesPoleEmploi(ressourcesFinancieres: RessourcesFinancieres): void {
    if (ressourcesFinancieres.aidesPoleEmploi.allocationASS) {
      ressourcesFinancieres.aidesPoleEmploi.allocationASS.allocationJournaliereNet = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesPoleEmploi.allocationASS.allocationJournaliereNet);
      ressourcesFinancieres.aidesPoleEmploi.allocationASS.allocationMensuelleNet = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesPoleEmploi.allocationASS.allocationMensuelleNet);
    }
    if (ressourcesFinancieres.aidesPoleEmploi.allocationARE) {
      ressourcesFinancieres.aidesPoleEmploi.allocationARE.allocationJournaliereNet = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesPoleEmploi.allocationARE.allocationJournaliereNet);
      ressourcesFinancieres.aidesPoleEmploi.allocationARE.allocationMensuelleNet = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.aidesPoleEmploi.allocationARE.allocationMensuelleNet);
    }
  }

}