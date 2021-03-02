import { Injectable } from '@angular/core';
import { AllocationsCAF } from "@models/allocations-caf";
import { AllocationsPoleEmploi } from "@models/allocations-pole-emploi";
import { RessourcesFinancieres } from "@models/ressources-financieres";
import { NumberUtileService } from "@app/core/services/utile/number-util.service";
import { AllocationsCPAM } from '@app/commun/models/allocations-cpam';
import { AllocationsLogementMensuellesNetFoyer } from '@app/commun/models/allocations-logement-mensuelles-net-foyer';
import { ControleChampFormulaireService } from './controle-champ-formulaire.service';

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
    allocationsPE.nombreMoisCumulesAssEtSalaire = 0;
    ressourcesFinancieres.allocationsPoleEmploi = allocationsPE;
    const allocationsCAF = new AllocationsCAF();
    allocationsCAF.allocationsFamilialesMensuellesNetFoyer = 0;
    const allocationsLogementMensuellesNetFoyer = new AllocationsLogementMensuellesNetFoyer();
    allocationsLogementMensuellesNetFoyer.moisNMoins1 = 0;
    allocationsLogementMensuellesNetFoyer.moisNMoins2 = 0;
    allocationsLogementMensuellesNetFoyer.moisNMoins3 = 0;
    allocationsCAF.allocationsLogementMensuellesNetFoyer = allocationsLogementMensuellesNetFoyer;
    allocationsCAF.pensionsAlimentairesFoyer = 0;
    ressourcesFinancieres.allocationsCAF = allocationsCAF;
    const allocationsCPAM = new AllocationsCPAM();
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
    }
    if (ressourcesFinancieres.allocationsCPAM) {
      ressourcesFinancieres.allocationsCPAM.pensionInvalidite = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCPAM.pensionInvalidite);
    }
    ressourcesFinancieres.salaireNet  = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.salaireNet);
    ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois);
    ressourcesFinancieres.revenusImmobilier3DerniersMois = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.revenusImmobilier3DerniersMois);
    return ressourcesFinancieres;
  }

  public isNombreMoisCumulAssSalaireSelectedValide(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return !ressourcesFinancieres.allocationsPoleEmploi.hasCumuleAssEtSalaire ||
      (ressourcesFinancieres.allocationsPoleEmploi.hasCumuleAssEtSalaire
        && ressourcesFinancieres.allocationsPoleEmploi.nombreMoisCumulesAssEtSalaire != 0)
  }

  public isNombreMoisTravailleAuCours6DerniersMoisSelectedValide(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return !ressourcesFinancieres.hasTravailleAuCoursDerniersMois ||
      (ressourcesFinancieres.hasTravailleAuCoursDerniersMois
        && ressourcesFinancieres.nombreMoisTravaillesDerniersMois != 0)
  }

  public isMontantJournalierAssInvalide(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNet && (ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNet == 0 || ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNet > this.controleChampFormulaireService.MONTANT_ASS_JOURNALIER_MAX);
  }


}