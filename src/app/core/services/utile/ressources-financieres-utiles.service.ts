import { Injectable } from '@angular/core';
import { AllocationsCAF } from "@models/allocations-caf";
import { AllocationsPoleEmploi } from "@models/allocations-pole-emploi";
import { RessourcesFinancieres } from "@models/ressources-financieres";
import { NumberUtileService } from "@app/core/services/utile/number-util.service";
import { AllocationsCPAM } from '@app/commun/models/allocations-cpam';
import { AllocationsLogementMensuellesNetFoyer } from '@app/commun/models/allocations-logement-mensuelles-net-foyer';
import { ControleChampFormulaireService } from './controle-champ-formulaire.service';
import { SalaireAvantPeriodeSimulation } from '@app/commun/models/salaire-avant-periode-simulation';

@Injectable({ providedIn: 'root' })
export class RessourcesFinancieresUtileService {

  constructor(
    private controleChampFormulaireService: ControleChampFormulaireService,
    private numberUtileService: NumberUtileService
  ) {

  }

  public creerRessourcesFinancieres(): RessourcesFinancieres {
    const ressourcesFinancieres = new RessourcesFinancieres();
    ressourcesFinancieres.nombreMoisTravaillesDerniersMois = 0;
    const allocationsPE = new AllocationsPoleEmploi();
    ressourcesFinancieres.allocationsPoleEmploi = allocationsPE;
    const allocationsCAF = new AllocationsCAF();
    allocationsCAF.prochaineDeclarationRSA = null;
    allocationsCAF.allocationsFamilialesMensuellesNetFoyer = 0;
    const allocationsLogementMensuellesNetFoyer = new AllocationsLogementMensuellesNetFoyer();
    allocationsLogementMensuellesNetFoyer.moisNMoins1 = 0;
    allocationsLogementMensuellesNetFoyer.moisNMoins2 = 0;
    allocationsLogementMensuellesNetFoyer.moisNMoins3 = 0;
    allocationsCAF.allocationsLogementMensuellesNetFoyer = allocationsLogementMensuellesNetFoyer;
    allocationsCAF.pensionsAlimentairesFoyer = 0;
    allocationsCAF.prestationAccueilJeuneEnfant = 0;
    ressourcesFinancieres.allocationsCAF = allocationsCAF;
    const allocationsCPAM = new AllocationsCPAM();
    allocationsCPAM.allocationSupplementaireInvalidite = 0;
    allocationsCPAM.pensionInvalidite = 0;
    ressourcesFinancieres.allocationsCPAM = allocationsCPAM;
    return ressourcesFinancieres;
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
    if (ressourcesFinancieres.allocationsPoleEmploi) {
      ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNet = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNet);
      ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNet = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNet);
    }
    if (ressourcesFinancieres.allocationsCAF) {
      if (ressourcesFinancieres.allocationsCAF.allocationsFamilialesMensuellesNetFoyer) {
        ressourcesFinancieres.allocationsCAF.allocationsLogementMensuellesNetFoyer.moisNMoins1 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCAF.allocationsLogementMensuellesNetFoyer.moisNMoins1);
        ressourcesFinancieres.allocationsCAF.allocationsLogementMensuellesNetFoyer.moisNMoins2 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCAF.allocationsLogementMensuellesNetFoyer.moisNMoins2);
        ressourcesFinancieres.allocationsCAF.allocationsLogementMensuellesNetFoyer.moisNMoins3 = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCAF.allocationsLogementMensuellesNetFoyer.moisNMoins3);
      }
      ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH);
      ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA);
      ressourcesFinancieres.allocationsCAF.pensionsAlimentairesFoyer = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCAF.pensionsAlimentairesFoyer);
      ressourcesFinancieres.allocationsCAF.prestationAccueilJeuneEnfant = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCAF.prestationAccueilJeuneEnfant);
    }
    if (ressourcesFinancieres.allocationsCPAM) {
      ressourcesFinancieres.allocationsCPAM.pensionInvalidite = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCPAM.pensionInvalidite);
      ressourcesFinancieres.allocationsCPAM.allocationSupplementaireInvalidite = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCPAM.allocationSupplementaireInvalidite);
    }
    if(ressourcesFinancieres.salaire) {
      ressourcesFinancieres.salaire.montantNet  = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.salaire.montantNet);
      ressourcesFinancieres.salaire.montantBrut  = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.salaire.montantBrut);
    }
    ressourcesFinancieres.revenusMicroEntreprise3DerniersMois = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.revenusMicroEntreprise3DerniersMois);
    ressourcesFinancieres.beneficesTravailleurIndependantDernierExercice = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.beneficesTravailleurIndependantDernierExercice);
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
          case 4: {
            isChampsSalairesValides = this.getNombreMoisTravaillesDerniersMois(ressourcesFinancieres) >= 1;
            break;
          }
          case 5: {
            isChampsSalairesValides = this.getNombreMoisTravaillesDerniersMois(ressourcesFinancieres) >= 2;
            break;
          }
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
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisDemandeSimulation)?1:0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisMoins1MoisDemandeSimulation)?1:0;
    nombreMoisTravaillesDerniersMois += this.isMoisTravaille(ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisMoins2MoisDemandeSimulation)?1:0;
    return nombreMoisTravaillesDerniersMois;
  }

  private isMoisTravaille(salaireAvantPeriodeSimulation: SalaireAvantPeriodeSimulation): boolean {
    return !salaireAvantPeriodeSimulation.isSansSalaire && salaireAvantPeriodeSimulation.salaire.montantNet > 0;
  }

  public isMontantJournalierAssInvalide(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNet && (ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNet == 0 || ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNet > this.controleChampFormulaireService.MONTANT_ASS_JOURNALIER_MAX);
  }

  public isMontantJournalierRSAInvalide(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA && ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA == 0;
  }
}