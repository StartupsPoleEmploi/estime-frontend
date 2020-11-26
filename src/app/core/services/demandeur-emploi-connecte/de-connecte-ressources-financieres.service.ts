import { Injectable } from '@angular/core';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { NumberUtileService } from "@app/core/services/utile/number-util.service";
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';

@Injectable({ providedIn: 'root' })
export class DeConnecteRessourcesFinancieresService {

  constructor(
    private deConnecteService: DeConnecteService,
    private numberUtileService: NumberUtileService,
    private personneUtileService: PersonneUtileService
  ) {

  }

  public getMontantRevenusVosRessources(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieres) {
      montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois);
      montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois);
    }
    return montant;
  }

  public getMontantRevenusRessourcesConjoint(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale && demandeurEmploiConnecte.situationFamiliale.conjoint) {
      const ressourcesFinancieresConjoint = demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres;
      montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresConjoint.salaireNet);
    }
    return montant;
  }

  public getMontantRevenusRessourcesPersonnesCharge(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale && demandeurEmploiConnecte.situationFamiliale.personnesACharge) {
      demandeurEmploiConnecte.situationFamiliale.personnesACharge.forEach((personne) => {
        if (this.personneUtileService.hasRessourcesFinancieres(personne)) {
          const ressourcesFinancieresPersonne = personne.ressourcesFinancieres;
          montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresPersonne.salaireNet);
        }
      });
    }
    return montant;
  }

  public getMontantAidesVosRessources(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if(demandeurEmploiConnecte.ressourcesFinancieres) {
      if (demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF) {
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH);
      }
      if(demandeurEmploiConnecte.ressourcesFinancieres.allocationsPoleEmploi) {
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS);
      }
    }
    return montant;
  }

  public getMontantAidesRessourcesConjoint(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale && demandeurEmploiConnecte.situationFamiliale.conjoint) {
      const ressourcesFinancieresConjoint = demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres;
      montant += this.getMontantAidesRessources(ressourcesFinancieresConjoint);
    }
    return montant;
  }

  public getMontantAidesRessourcesPersonnesCharge(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale && demandeurEmploiConnecte.situationFamiliale.personnesACharge) {
      demandeurEmploiConnecte.situationFamiliale.personnesACharge.forEach((personne) => {
        if (this.personneUtileService.hasRessourcesFinancieres(personne)) {
          const ressourcesFinancieresPersonne = personne.ressourcesFinancieres;
          montant += this.getMontantAidesRessources(ressourcesFinancieresPersonne);
        }
      });
    }
    return montant;
  }

  public getMontantAidesRessourcesFoyer(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    const ressourcesFinancieresFoyer = demandeurEmploiConnecte.ressourcesFinancieres;
    if (ressourcesFinancieresFoyer && ressourcesFinancieresFoyer.allocationsCAF) {
      montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.allocationsCAF.allocationsFamilialesMensuellesNetFoyer);
      montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.allocationsCAF.allocationsLogementMensuellesNetFoyer);
      montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.allocationsCAF.pensionsAlimentairesFoyer);
    }
    return montant;
  }

  private getMontantAidesRessources(ressourcesFinancieres: RessourcesFinancieres): number {
    let montant = 0;
    if (ressourcesFinancieres) {
      montant += this.getMontantAidesRessourcesCAF(ressourcesFinancieres);
      montant += this.getMontantAidesRessourcesPoleEmploi(ressourcesFinancieres);
    }
    return montant;
  }

  private getMontantAidesRessourcesCAF(ressourcesFinancieres: RessourcesFinancieres): number {
    let montant = 0;
    if (ressourcesFinancieres.allocationsCAF) {
      const allocationsCAF = ressourcesFinancieres.allocationsCAF;
      montant += this.numberUtileService.getMontantSafe(allocationsCAF.allocationMensuelleNetAAH)
        + this.numberUtileService.getMontantSafe(allocationsCAF.allocationMensuelleNetRSA);
    }
    return montant;
  }

  private getMontantAidesRessourcesPoleEmploi(ressourcesFinancieres: RessourcesFinancieres): number {
    let montant = 0;
    if (ressourcesFinancieres.allocationsPoleEmploi) {
      const allocationsPoleEmploi = ressourcesFinancieres.allocationsPoleEmploi;
      montant += this.numberUtileService.getMontantSafe(allocationsPoleEmploi.allocationMensuelleNetARE)
        + this.numberUtileService.getMontantSafe(allocationsPoleEmploi.allocationMensuelleNetASS);
    }
    return montant;
  }
}