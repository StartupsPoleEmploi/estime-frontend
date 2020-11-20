import { Injectable } from '@angular/core';
import { AllocationsCAF } from "@models/allocations-caf";
import { AllocationsPoleEmploi } from "@models/allocations-pole-emploi";
import { RessourcesFinancieres } from "@models/ressources-financieres";
import { NumberUtileService } from "@app/core/services/utile/number-util.service";

@Injectable({ providedIn: 'root' })
export class RessourcesFinancieresUtileService {

  constructor(
    private numberUtileService: NumberUtileService
  ) {

  }

  public creerRessourcesFinancieres(): RessourcesFinancieres {
    const ressourcesFinancieres = new RessourcesFinancieres();
    const allocationsPE = new AllocationsPoleEmploi();
    allocationsPE.nombreMoisCumulesAssEtSalaire = 0;
    ressourcesFinancieres.allocationsPoleEmploi = allocationsPE;
    const allocationsCAF = new AllocationsCAF();
    allocationsCAF.allocationsFamilialesMensuellesNetFoyer = 0;
    allocationsCAF.allocationsLogementMensuellesNetFoyer = 0;
    allocationsCAF.pensionsAlimentairesFoyer = 0;
    ressourcesFinancieres.allocationsCAF = allocationsCAF;
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
      ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNetARE = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNetARE);
      ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNetASS = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNetASS);
      ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE);
      ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS);
    }
    if (ressourcesFinancieres.allocationsCAF) {
      ressourcesFinancieres.allocationsCAF.allocationsFamilialesMensuellesNetFoyer = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCAF.allocationsFamilialesMensuellesNetFoyer);
      ressourcesFinancieres.allocationsCAF.allocationsLogementMensuellesNetFoyer = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCAF.allocationsLogementMensuellesNetFoyer);
      ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH);
      ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA);
      ressourcesFinancieres.allocationsCAF.pensionsAlimentairesFoyer = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.allocationsCAF.pensionsAlimentairesFoyer);
    }
    ressourcesFinancieres.salaireNet  = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.salaireNet);
    ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois);
    ressourcesFinancieres.revenusImmobilier3DerniersMois = this.numberUtileService.replaceCommaByDot(ressourcesFinancieres.revenusImmobilier3DerniersMois);
    return ressourcesFinancieres;
  }

}