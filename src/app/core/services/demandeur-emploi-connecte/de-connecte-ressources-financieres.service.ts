import { Injectable } from '@angular/core';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { NumberUtileService } from "@app/core/services/utile/number-util.service";
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { DateUtileService } from '../utile/date-util.service';
import { RessourcesFinancieresUtileService } from '../utile/ressources-financieres-utiles.service';
import { DeConnecteBenefiaireAidesSocialesService } from './de-connecte-benefiaire-aides-sociales.service';
import { DeConnecteInfosPersonnellesService } from './de-connecte-infos-personnelles.service';

@Injectable({ providedIn: 'root' })
export class DeConnecteRessourcesFinancieresService {

  constructor(
    private dateUtileService: DateUtileService,
    private deConnecteService: DeConnecteService,
    private deConnecteBenefiaireAidesSocialesService: DeConnecteBenefiaireAidesSocialesService,
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
      montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois);
      if(demandeurEmploiConnecte.ressourcesFinancieres.salairesAvantPeriodeSimulation) {
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisDemandeSimulation);
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisMoins1MoisDemandeSimulation);
      }
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
      if (demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF) {
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH);
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA);
      }
      if (demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM) {
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM.pensionInvalidite);
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM.allocationSupplementaireInvalidite);
      }
      if(demandeurEmploiConnecte.ressourcesFinancieres.allocationsPoleEmploi) {
        const nbrJourMoisPRecedent = this.dateUtileService.getNombreJoursMoisPrecedent()
        montant += Math.round(nbrJourMoisPRecedent * this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNet));
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

  public getRevenusTravailleurIndependantSur1Mois(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if(demandeurEmploiConnecte.ressourcesFinancieres && demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois) {
      montant +=  Math.round(demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois / 3);
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
      montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.allocationsCAF.allocationsLogementMensuellesNetFoyer.moisNMoins1);
      montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.allocationsCAF.allocationsLogementMensuellesNetFoyer.moisNMoins2);
      montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.allocationsCAF.allocationsLogementMensuellesNetFoyer.moisNMoins3);
      montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.allocationsCAF.pensionsAlimentairesFoyer);
    }
    return montant;
  }

  public isDonneesRessourcesFinancieresValides(ressourcesFinancieres: RessourcesFinancieres): boolean {
    let isValide = true;

    if(this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireASS()) {
      isValide = this.isDonneesASSSaisiesValide(ressourcesFinancieres);
    }
    if(isValide && this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireAAH()) {
      isValide = this.isDonneesAAHSaisiesValides(ressourcesFinancieres);
    }
    if(isValide && this.deConnecteBenefiaireAidesSocialesService.isBeneficiairePensionInvalidite()) {
      isValide = ressourcesFinancieres.allocationsCPAM.pensionInvalidite > 0;
    }
    if(isValide && this.deConnecteInfosPersonnellesService.createurEntreprise()) {
      isValide = ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois > 0;
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
    return ressourcesFinancieres.allocationsPoleEmploi.dateDerniereOuvertureDroitASS && !this.dateUtileService.isDateAfterDateJour(ressourcesFinancieres.allocationsPoleEmploi.dateDerniereOuvertureDroitASS)
    && this.ressourcesFinancieresUtileService.isNombreMoisTravailleAuCoursDerniersMoisSelectedValide(ressourcesFinancieres)
    && !this.ressourcesFinancieresUtileService.isMontantJournalierAssInvalide(ressourcesFinancieres);
  }

  private isDonneesAAHSaisiesValides(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH > 0
    && this.ressourcesFinancieresUtileService.isNombreMoisTravailleAuCoursDerniersMoisSelectedValide(ressourcesFinancieres);
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
      montant += this.numberUtileService.getMontantSafe(allocationsPoleEmploi.allocationMensuelleNet);
    }
    return montant;
  }

  private getMontantAidesRessourcesCPAM(ressourcesFinancieres: RessourcesFinancieres): number {
    let montant = 0;
    if (ressourcesFinancieres.allocationsCPAM) {
      const allocationsCPAM = ressourcesFinancieres.allocationsCPAM;
      montant += this.numberUtileService.getMontantSafe(allocationsCPAM.pensionInvalidite)
        + this.numberUtileService.getMontantSafe(allocationsCPAM.allocationSupplementaireInvalidite);
    }
    return montant;
  }
}