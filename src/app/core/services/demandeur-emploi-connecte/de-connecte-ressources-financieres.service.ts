import { Injectable } from '@angular/core';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { NumberUtileService } from "@app/core/services/utile/number-util.service";
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { DateUtileService } from '../utile/date-util.service';
import { RessourcesFinancieresUtileService } from '../utile/ressources-financieres-utiles.service';
import { DeConnecteBenefiaireAidesService } from './de-connecte-benefiaire-aides.service';
import { DeConnecteInfosPersonnellesService } from './de-connecte-infos-personnelles.service';
import { DeConnecteSituationFamilialeService } from './de-connecte-situation-familiale.service';

@Injectable({ providedIn: 'root' })
export class DeConnecteRessourcesFinancieresService {

  constructor(
    private dateUtileService: DateUtileService,
    private deConnecteService: DeConnecteService,
    private deConnecteBenefiaireAidesService: DeConnecteBenefiaireAidesService,
    private deConnecteInfosPersonnellesService: DeConnecteInfosPersonnellesService,
    private numberUtileService: NumberUtileService,
    private personneUtileService: PersonneUtileService,
    private ressourcesFinancieresUtileService: RessourcesFinancieresUtileService
  ) {

  }

  public getMontantVosRessources(): number {
    let montant = 0;
    montant = this.getMontantAidesVosRessources() + this.getMontantRevenusVosRessources();
    return montant;
  }

  public getMontantRessourcesConjoint(): number {
    let montant = 0;
    montant = this.getMontantAidesRessourcesConjoint() + this.getMontantRevenusRessourcesConjoint();
    return montant;
  }

  public getMontantRessourcesPersonnesCharge(): number {
    let montant = 0;
    montant = this.getMontantAidesRessourcesPersonnesCharge() + this.getMontantRevenusRessourcesPersonnesCharge();
    return montant;
  }

  public getMontantRessourcesFoyer(): number {
    let montant = 0;
    montant = this.getMontantAidesRessourcesFoyer() + this.getMontantRevenusRessourcesFoyer();
    return montant;
  }

  public getMontantRevenusVosRessources(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieres) {
      const ressourcesFinancieres = demandeurEmploiConnecte.ressourcesFinancieres;
      if(ressourcesFinancieres.revenusMicroEntreprise3DerniersMois) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieres.revenusMicroEntreprise3DerniersMois);
      }
      if(ressourcesFinancieres.beneficesTravailleurIndependantDernierExercice) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieres.beneficesTravailleurIndependantDernierExercice);
      }
      if(ressourcesFinancieres.periodeTravailleeAvantSimulation) {
        if(ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins1.salaire.montantNet) {
          montant += this.numberUtileService.getMontantSafe(ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins1.salaire.montantNet);
        }
        if(ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins2.salaire.montantNet) {
          montant += this.numberUtileService.getMontantSafe(ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins2.salaire.montantNet);
        }
        if(ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins3.salaire.montantNet) {
          montant += this.numberUtileService.getMontantSafe(ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins3.salaire.montantNet);
        }
      }
    }
    return montant;
  }

  public getMontantRevenusRessourcesConjoint(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale && demandeurEmploiConnecte.situationFamiliale.conjoint) {
      const ressourcesFinancieresConjoint = demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres;
      if(ressourcesFinancieresConjoint.salaire && ressourcesFinancieresConjoint.salaire.montantNet) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresConjoint.salaire.montantNet);
      }
      if(ressourcesFinancieresConjoint.revenusMicroEntreprise3DerniersMois) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresConjoint.revenusMicroEntreprise3DerniersMois);
      }
      if(ressourcesFinancieresConjoint.beneficesTravailleurIndependantDernierExercice) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresConjoint.beneficesTravailleurIndependantDernierExercice);
      }
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
          if(ressourcesFinancieresPersonne.salaire && ressourcesFinancieresPersonne.salaire.montantNet) {
            montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresPersonne.salaire.montantNet);
          }
          if(ressourcesFinancieresPersonne.revenusMicroEntreprise3DerniersMois) {
            montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresPersonne.revenusMicroEntreprise3DerniersMois);
          }
          if(ressourcesFinancieresPersonne.beneficesTravailleurIndependantDernierExercice) {
            montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresPersonne.beneficesTravailleurIndependantDernierExercice);
          }
        }
      });
    }
    return montant;
  }

  public getMontantRevenusRessourcesFoyer(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieres) {
      montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois);
    }
    return montant;
  }

  public getMontantAidesVosRessources(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if(demandeurEmploiConnecte.ressourcesFinancieres) {
      if (demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF) {
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.allocationAAH);
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.allocationRSA);
      }
      if (demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM) {
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.pensionInvalidite);
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite);
      }
      if(demandeurEmploiConnecte.ressourcesFinancieres.aidesPoleEmploi) {
        if(demandeurEmploiConnecte.ressourcesFinancieres.aidesPoleEmploi.allocationASS) {
          const nbrJourMoisPRecedent = this.dateUtileService.getNombreJoursMoisPrecedent()
          montant += Math.round(nbrJourMoisPRecedent * this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.aidesPoleEmploi.allocationASS.allocationJournaliereNet));
        }
      }
    }
    return montant;
  }

  public getRevenusImmobilierSur1Mois(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if(demandeurEmploiConnecte.ressourcesFinancieres && demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois) {
      montant +=  Math.round(demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois / 3);
    }
    return montant;
  }

  public getRevenusMicroEntrepriseSur1Mois(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if(demandeurEmploiConnecte.ressourcesFinancieres && demandeurEmploiConnecte.ressourcesFinancieres.revenusMicroEntreprise3DerniersMois) {
      montant +=  Math.round(demandeurEmploiConnecte.ressourcesFinancieres.revenusMicroEntreprise3DerniersMois / 3);
    }
    return montant;
  }

  public getBeneficesTravailleurIndependantDernierExercice(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if(demandeurEmploiConnecte.ressourcesFinancieres && demandeurEmploiConnecte.ressourcesFinancieres.beneficesTravailleurIndependantDernierExercice) {
      montant += demandeurEmploiConnecte.ressourcesFinancieres.beneficesTravailleurIndependantDernierExercice;
    }
    return montant;
  }

  public getBeneficesTravailleurIndependantSur1Mois(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if(demandeurEmploiConnecte.ressourcesFinancieres && demandeurEmploiConnecte.ressourcesFinancieres.beneficesTravailleurIndependantDernierExercice) {
      montant += Math.round(demandeurEmploiConnecte.ressourcesFinancieres.beneficesTravailleurIndependantDernierExercice / 12);
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
    if (ressourcesFinancieresFoyer && ressourcesFinancieresFoyer.aidesCAF) {
      if(ressourcesFinancieresFoyer.aidesCAF.aidesFamiliales) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.aidesCAF.aidesFamiliales.allocationsFamiliales);
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.aidesCAF.aidesFamiliales.allocationSoutienFamilial);
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.aidesCAF.aidesFamiliales.complementFamilial);
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.aidesCAF.aidesFamiliales.pensionsAlimentairesFoyer);
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.aidesCAF.aidesFamiliales.prestationAccueilJeuneEnfant);
      }
      if(ressourcesFinancieresFoyer.aidesCAF.allocationsLogement) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.aidesCAF.allocationsLogement.moisNMoins1);
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.aidesCAF.allocationsLogement.moisNMoins2);
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.aidesCAF.allocationsLogement.moisNMoins3);
      }
    }
    return montant;
  }

  public isDonneesRessourcesFinancieresValides(ressourcesFinancieres: RessourcesFinancieres): boolean {
    let isValide = true;

    if(this.deConnecteBenefiaireAidesService.isBeneficiaireASS()) {
      isValide = this.isDonneesASSSaisiesValide(ressourcesFinancieres);
    }
    if(this.deConnecteBenefiaireAidesService.isBeneficiaireRSA() && isValide) {
      isValide = this.isDonneesRSASaisiesValide(ressourcesFinancieres);
    }
    if(this.deConnecteBenefiaireAidesService.isBeneficiaireAAH() && isValide) {
      isValide = this.isDonneesAAHSaisiesValides(ressourcesFinancieres);
    }
    if(isValide && this.deConnecteBenefiaireAidesService.isBeneficiairePensionInvalidite() && isValide) {
      isValide = ressourcesFinancieres.aidesCPAM.pensionInvalidite > 0;
    }
    if(isValide && this.deConnecteInfosPersonnellesService.isTravailleurIndependant() && isValide) {
      isValide = ressourcesFinancieres.beneficesTravailleurIndependantDernierExercice > 0;
    }
    if(isValide && this.deConnecteInfosPersonnellesService.isMicroEntrepreneur() && isValide) {
      isValide = ressourcesFinancieres.revenusMicroEntreprise3DerniersMois > 0;
    }
    return isValide;
  }

  public isDonneesRessourcesFinancieresFoyerValides(ressourcesFinancieres: RessourcesFinancieres): boolean {
    let isValide = true;
    if(isValide && this.deConnecteInfosPersonnellesService.hasRevenusImmobilier()) {
      isValide = ressourcesFinancieres.revenusImmobilier3DerniersMois > 0;
    }
    return isValide;
  }


  private isDonneesASSSaisiesValide(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return ressourcesFinancieres.aidesPoleEmploi.allocationASS.dateDerniereOuvertureDroit && !this.dateUtileService.isDateAfterDateJour(ressourcesFinancieres.aidesPoleEmploi.allocationASS.dateDerniereOuvertureDroit)
    && this.ressourcesFinancieresUtileService.isChampsSalairesValides(ressourcesFinancieres, false, true)
    && !this.ressourcesFinancieresUtileService.isMontantJournalierAssInvalide(ressourcesFinancieres);
  }

  private isDonneesRSASaisiesValide(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return ressourcesFinancieres.aidesCAF.prochaineDeclarationRSA
    && this.ressourcesFinancieresUtileService.isChampsSalairesValides(ressourcesFinancieres, false, true)
    && !this.ressourcesFinancieresUtileService.isMontantJournalierRSAInvalide(ressourcesFinancieres);
  }

  private isDonneesAAHSaisiesValides(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return ressourcesFinancieres.aidesCAF.allocationAAH > 0
    && this.ressourcesFinancieresUtileService.isChampsSalairesValides(ressourcesFinancieres, true, false);
  }

  private getMontantAidesRessources(ressourcesFinancieres: RessourcesFinancieres): number {
    let montant = 0;
    if (ressourcesFinancieres) {
      montant += this.getMontantAidesRessourcesCAF(ressourcesFinancieres);
      montant += this.getMontantAidesRessourcesPoleEmploi(ressourcesFinancieres);
      montant += this.getMontantAidesRessourcesCPAM(ressourcesFinancieres);
    }
    return montant;
  }

  private getMontantAidesRessourcesCAF(ressourcesFinancieres: RessourcesFinancieres): number {
    let montant = 0;
    if (ressourcesFinancieres.aidesCAF) {
      const aidesCAF = ressourcesFinancieres.aidesCAF;
      montant += this.numberUtileService.getMontantSafe(aidesCAF.allocationAAH)
        + this.numberUtileService.getMontantSafe(aidesCAF.allocationRSA);
    }
    return montant;
  }

  private getMontantAidesRessourcesPoleEmploi(ressourcesFinancieres: RessourcesFinancieres): number {
    let montant = 0;
    if (ressourcesFinancieres.aidesPoleEmploi) {
      const aidesPoleEmploi = ressourcesFinancieres.aidesPoleEmploi;
      if(aidesPoleEmploi.allocationASS) {
        montant += this.numberUtileService.getMontantSafe(aidesPoleEmploi.allocationASS.allocationMensuelleNet);
      }
      if(aidesPoleEmploi.allocationARE) {
        montant += this.numberUtileService.getMontantSafe(aidesPoleEmploi.allocationARE.allocationMensuelleNet);
      }
    }
    return montant;
  }

  private getMontantAidesRessourcesCPAM(ressourcesFinancieres: RessourcesFinancieres): number {
    let montant = 0;
    if (ressourcesFinancieres.aidesCPAM) {
      const aidesCPAM = ressourcesFinancieres.aidesCPAM;
      montant += this.numberUtileService.getMontantSafe(aidesCPAM.pensionInvalidite)
        + this.numberUtileService.getMontantSafe(aidesCPAM.allocationSupplementaireInvalidite);
    }
    return montant;
  }
}