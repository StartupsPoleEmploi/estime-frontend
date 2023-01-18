import { Injectable } from '@angular/core';
import { AidesLogement } from '@app/commun/models/aides-logement';
import { AllocationARE } from '@app/commun/models/allocation-are';
import { AllocationASS } from '@app/commun/models/allocation-ass';
import { AllocationsLogement } from '@app/commun/models/allocations-logement';
import { NombreMoisTravailles } from '@app/commun/models/nombre-mois-travailles';
import { PeriodeTravailleeAvantSimulation } from '@app/commun/models/periode-travaillee-avant-simulation';
import { Personne } from '@app/commun/models/personne';
import { Salaire } from '@app/commun/models/salaire';
import { NumberUtileService } from "@app/core/services/utile/number-util.service";
import { AidesCAF } from "@models/aides-caf";
import { AidesCPAM } from '@models/aides-cpam';
import { AidesFamiliales } from '@models/aides-familiales';
import { AidesPoleEmploi } from "@models/aides-pole-emploi";
import { MoisTravailleAvantSimulation } from '@models/mois-travaille-avant-simulation';
import { RessourcesFinancieresAvantSimulation } from "@app/commun/models/ressources-financieres-avant-simulation";
import { SalaireService } from './salaire.service';
import { ControleChampFormulaireService } from './controle-champ-formulaire.service';
import { DateUtileService } from './date-util.service';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';

@Injectable({ providedIn: 'root' })
export class RessourcesFinancieresAvantSimulationUtileService {

  public readonly NOMBRE_MAX_MOIS_TRAVAILLES: number = 14;

  constructor(
    private controleChampFormulaireService: ControleChampFormulaireService,
    private dateUtileService: DateUtileService,
    private numberUtileService: NumberUtileService,
    private salaireService: SalaireService
  ) {

  }

  public creerAidesCPAM(): AidesCPAM {
    return new AidesCPAM();
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
    return new AidesCAF();
  }

  public creerAidesPoleEmploi(): AidesPoleEmploi {
    return new AidesPoleEmploi();
  }

  public creerAllocationARE(): AllocationARE {
    const allocationARE = new AllocationARE();
    allocationARE.allocationMensuelleNet = null;
    allocationARE.allocationJournaliereBrute = null;
    allocationARE.allocationJournaliereBruteTauxPlein = null;
    allocationARE.salaireJournalierReferenceBrut = null;
    allocationARE.nombreJoursRestants = null;
    allocationARE.hasDegressiviteAre = null;
    allocationARE.isTauxReduit = null;
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
  public replaceCommaByDotMontantsRessourcesFinancieresAvantSimulation(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation) {
    if (ressourcesFinancieresAvantSimulation.aidesPoleEmploi) {
      this.replaceCommaByDotMontantsAidesPoleEmploi(ressourcesFinancieresAvantSimulation);
    }
    if (ressourcesFinancieresAvantSimulation.aidesCAF) {
      this.replaceCommaByDotMontantsAidesCAF(ressourcesFinancieresAvantSimulation);
    }
    if (ressourcesFinancieresAvantSimulation.aidesCPAM) {
      this.replaceCommaByDotMontantsAidesCPAM(ressourcesFinancieresAvantSimulation);
    }
    if (ressourcesFinancieresAvantSimulation.salaire) {
      ressourcesFinancieresAvantSimulation.salaire.montantMensuelNet = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.salaire.montantMensuelNet);
      ressourcesFinancieresAvantSimulation.salaire.montantMensuelBrut = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.salaire.montantMensuelBrut);
    }
    ressourcesFinancieresAvantSimulation.beneficesMicroEntrepriseDernierExercice = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.beneficesMicroEntrepriseDernierExercice);
    ressourcesFinancieresAvantSimulation.chiffreAffairesIndependantDernierExercice = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.chiffreAffairesIndependantDernierExercice);
    ressourcesFinancieresAvantSimulation.revenusImmobilier3DerniersMois = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.revenusImmobilier3DerniersMois);
    ressourcesFinancieresAvantSimulation.pensionRetraite = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.pensionRetraite);
    return ressourcesFinancieresAvantSimulation;
  }

  /**
   * Fonction qui permet d'initialiser les options du select du nombre de mois travaillés
   * sur les 6 derniers mois dans le cas d'un demandeur AAH
   */
  public initOptionsNombreMoisTravailles(): Array<NombreMoisTravailles> {
    const optionsNombreMoisTravailles = new Array<NombreMoisTravailles>();
    for (let index = 0; index < this.NOMBRE_MAX_MOIS_TRAVAILLES; index++) {
      const nombreMoisTravaille = new NombreMoisTravailles();
      nombreMoisTravaille.index = index;
      nombreMoisTravaille.label = this.dateUtileService.getDateFormateeAvantDateJour(index);
      optionsNombreMoisTravailles.push(nombreMoisTravaille);
    }
    return optionsNombreMoisTravailles;
  }

  /**
 *
 * Fonction qui permet d'initialiser les salaires perçues avant la période de simulation
 * dans le cas où ceux-ci ne le seraient pas encore mais que hasTravailleAuCoursDerniersMois est déjà vrai
 * (quand on rafraichit la page ou qu'on change de situation par exemple)
 */
  public initSalairesAvantPeriodeSimulation(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): RessourcesFinancieresAvantSimulation {
    const isNull = (mois) => mois == null;
    if (ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation == null
      || ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation.mois.every(isNull)) {
      ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation = this.creerSalairesAvantPeriodeSimulation();
    }
    return ressourcesFinancieresAvantSimulation;
  }

  public creerSalairesAvantPeriodeSimulationPersonne(personne: Personne): PeriodeTravailleeAvantSimulation {
    let periodeTravailleeAvantSimulation = new PeriodeTravailleeAvantSimulation();
    const moisTravaillesArray = new Array<MoisTravailleAvantSimulation>();
    const dateActuelle = new Date();
    let montantMensuelNet = 0;
    let montantMensuelBrut = 0;
    if (personne.ressourcesFinancieresAvantSimulation != null && personne.ressourcesFinancieresAvantSimulation.salaire != null && personne.ressourcesFinancieresAvantSimulation.salaire.montantMensuelNet > 0) {
      montantMensuelNet = personne.ressourcesFinancieresAvantSimulation.salaire.montantMensuelNet;
      montantMensuelBrut = personne.ressourcesFinancieresAvantSimulation.salaire.montantMensuelBrut;
    }
    for (let index = 0; index < this.NOMBRE_MAX_MOIS_TRAVAILLES; index++) {
      const moisTravaille = new MoisTravailleAvantSimulation();
      const salaire = new Salaire();
      salaire.montantMensuelNet = montantMensuelNet;
      salaire.montantMensuelBrut = montantMensuelBrut;
      moisTravaille.isSansSalaire = false;
      moisTravaille.salaire = salaire;
      moisTravaille.date = this.dateUtileService.enleverMoisToDate(dateActuelle, index);
      moisTravaillesArray.push(moisTravaille);
    }
    periodeTravailleeAvantSimulation.mois = moisTravaillesArray;
    return periodeTravailleeAvantSimulation;
  }

  public creerSalairesAvantPeriodeSimulation(): PeriodeTravailleeAvantSimulation {
    let periodeTravailleeAvantSimulation = new PeriodeTravailleeAvantSimulation();
    const moisTravaillesArray = new Array<MoisTravailleAvantSimulation>();
    const dateActuelle = new Date();

    for (let index = 0; index < this.NOMBRE_MAX_MOIS_TRAVAILLES; index++) {
      const moisTravaille = new MoisTravailleAvantSimulation();
      const salaire = new Salaire();
      salaire.montantMensuelNet = 0;
      salaire.montantMensuelBrut = 0;
      moisTravaille.isSansSalaire = false;
      moisTravaille.salaire = salaire;
      moisTravaille.date = this.dateUtileService.enleverMoisToDate(dateActuelle, index);
      moisTravaillesArray.push(moisTravaille);
    }
    periodeTravailleeAvantSimulation.mois = moisTravaillesArray;
    return periodeTravailleeAvantSimulation;
  }

  public getNombreMaxMoisTravailleAuCoursDerniersMois() {
    return this.NOMBRE_MAX_MOIS_TRAVAILLES;
  }

  public isNombreMoisTravailleAuCoursDerniersMoisSelectedValide(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): boolean {
    return !ressourcesFinancieresAvantSimulation.hasTravailleAuCoursDerniersMois ||
      (ressourcesFinancieresAvantSimulation.hasTravailleAuCoursDerniersMois
        && ressourcesFinancieresAvantSimulation.nombreMoisTravaillesDerniersMois != 0)
  }

  public getNombreMoisTravaillesDerniersMois(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): number {
    let nombreMoisTravaillesAvantSimulation = 0;
    if (ressourcesFinancieresAvantSimulation != null && ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation != null
      && ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation.mois != null &&
      ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation.mois.length != 0) {
      ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation.mois.forEach((mois) => {
        nombreMoisTravaillesAvantSimulation += mois.salaire.montantMensuelNet > 0 ? 1 : 0;
      })
    }
    return nombreMoisTravaillesAvantSimulation;
  }


  public getNombreMoisTravaillesXDerniersMois(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation, nombreMoisAConsiderer: number): number {
    let nombreMoisTravaillesAvantSimulation = 0;
    if (ressourcesFinancieresAvantSimulation != null && ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation != null
      && ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation.mois != null &&
      ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation.mois.length != 0) {
      ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation.mois.forEach((mois, index) => {
        if (index < nombreMoisAConsiderer) {
          nombreMoisTravaillesAvantSimulation += mois.salaire.montantMensuelNet > 0 ? 1 : 0;
        }
      })
    }
    return nombreMoisTravaillesAvantSimulation;
  }


  public hasSalaireAvantSimulation(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): boolean {
    if (ressourcesFinancieresAvantSimulation != null && ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation != null) {
      return ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation.mois.some((mois: MoisTravailleAvantSimulation) => {
        return (mois != null && mois.salaire != null && mois.salaire.montantMensuelNet > 0);
      });
    } return false;
  }

  private isMoisTravaille(moisTravailleAvantSimulation: MoisTravailleAvantSimulation): boolean {
    return !moisTravailleAvantSimulation.isSansSalaire && moisTravailleAvantSimulation.salaire.montantMensuelNet > 0;
  }

  public calculSalaireMensuelBrut(salaire: Salaire) {
    if (salaire.montantMensuelNet != null) {
      salaire.montantMensuelBrut = this.salaireService.getBrutFromNet(salaire.montantMensuelNet);
    } else {
      salaire.montantMensuelBrut = undefined;
    }
  }

  public isMontantJournalierAssInvalide(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): boolean {
    return ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS && (ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.allocationJournaliereNet == 0 || ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.allocationJournaliereNet > this.controleChampFormulaireService.MONTANT_ASS_JOURNALIER_MAX);
  }

  public isMontantJournalierRSAInvalide(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): boolean {
    return ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA && ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA == 0;
  }

  private replaceCommaByDotMontantsAidesCAF(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): void {
    if (ressourcesFinancieresAvantSimulation.aidesCAF) {
      ressourcesFinancieresAvantSimulation.aidesCAF.allocationAAH = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCAF.allocationAAH);
      ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA);
      if (ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement) {
        if (ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement) {
          ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins1 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins1);
          ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins2 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins2);
          ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins3 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins3);
        }
        if (ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale) {
          ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins1 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins1);
          ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins2 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins2);
          ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins3 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins3);
        }
        if (ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale) {
          ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins1 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins1);
          ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins2 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins2);
          ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins3 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins3);
        }
      }
      if (ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales) {
        ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales.allocationsFamiliales = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales.allocationsFamiliales);
        ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales.allocationSoutienFamilial = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales.allocationSoutienFamilial);
        ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales.complementFamilial = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales.complementFamilial);
        ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales.pensionsAlimentairesFoyer = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales.pensionsAlimentairesFoyer);
        ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales.prestationAccueilJeuneEnfant = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales.prestationAccueilJeuneEnfant);
      }
    }
  }

  private replaceCommaByDotMontantsAidesCPAM(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): void {
    if (ressourcesFinancieresAvantSimulation.aidesCPAM) {
      ressourcesFinancieresAvantSimulation.aidesCPAM.pensionInvalidite = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCPAM.pensionInvalidite);
    }
  }

  private replaceCommaByDotMontantsAidesPoleEmploi(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): void {
    if (ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS) {
      ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.allocationJournaliereNet = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.allocationJournaliereNet);
      ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.allocationMensuelleNet = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.allocationMensuelleNet);
    }
    if (ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE) {
      ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.salaireJournalierReferenceBrut = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.salaireJournalierReferenceBrut);
      ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationJournaliereBrute = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationJournaliereBrute);
      ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationJournaliereBruteTauxPlein = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationJournaliereBruteTauxPlein);
      ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationMensuelleNet = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationMensuelleNet);
    }
  }

  /**
   * Fonction qui permet de déterminer si la saisie des champs de cumul salaire est correct.
   * @param ressourcesFinancieresAvantSimulation
   */
  public isChampsSalairesValides(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): boolean {
    let isChampsSalairesValides = true;
    if (ressourcesFinancieresAvantSimulation.hasTravailleAuCoursDerniersMois) {
      if (ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation != null && ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation.mois != null) {
        let tousLesSalairesAZero = true;
        ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation.mois.forEach((mois) => {
          if (mois.salaire != null && mois.salaire.montantMensuelNet != 0) {
            tousLesSalairesAZero = false;
          }
        });
        if (tousLesSalairesAZero) {
          isChampsSalairesValides = false;
        }
      } else {
        isChampsSalairesValides = false;
      }
    }
    return isChampsSalairesValides;
  }

  public hasPensionInvaliditeAvecSalaireAvantSimulation(demandeurEmploi: DemandeurEmploi): boolean {
    return demandeurEmploi.beneficiaireAides.beneficiairePensionInvalidite && this.hasSalaireAvantSimulation(demandeurEmploi.ressourcesFinancieresAvantSimulation);
  }

  public hasAllocationARE(demandeurEmploi: DemandeurEmploi): boolean {
    return (demandeurEmploi != null
      && demandeurEmploi.ressourcesFinancieresAvantSimulation != null
      && demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesPoleEmploi != null
      && demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE != null)
  }

  public hasPrimeActivite(demandeurEmploi: DemandeurEmploi): boolean {
    return (demandeurEmploi != null
      && demandeurEmploi.ressourcesFinancieresAvantSimulation != null
      && demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF != null
      && demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.hasPrimeActivite
      && demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.primeActivite != null
      && demandeurEmploi.ressourcesFinancieresAvantSimulation.aidesCAF.primeActivite > 0)
  }

}