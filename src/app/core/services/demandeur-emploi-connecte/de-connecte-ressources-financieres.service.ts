import { Injectable } from '@angular/core';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { NumberUtileService } from "@app/core/services/utile/number-util.service";
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { DateUtileService } from '../utile/date-util.service';
import { RessourcesFinancieresUtileService } from '../utile/ressources-financieres-utiles.service';
import { DeConnecteBeneficiaireAidesService } from './de-connecte-beneficiaire-aides.service';
import { DeConnecteInfosPersonnellesService } from './de-connecte-infos-personnelles.service';
import { Personne } from '@app/commun/models/personne';
import { InformationsPersonnelles } from '@app/commun/models/informations-personnelles';
import { AidesCAF } from '@app/commun/models/aides-caf';
import { AidesCPAM } from '@app/commun/models/aides-cpam';
import { AidesPoleEmploi } from '@app/commun/models/aides-pole-emploi';

@Injectable({ providedIn: 'root' })
export class DeConnecteRessourcesFinancieresService {

  constructor(
    private dateUtileService: DateUtileService,
    private deConnecteService: DeConnecteService,
    private deConnecteBeneficiaireAidesService: DeConnecteBeneficiaireAidesService,
    private deConnecteInfosPersonnellesService: DeConnecteInfosPersonnellesService,
    private numberUtileService: NumberUtileService,
    private personneUtileService: PersonneUtileService,
    private ressourcesFinancieresUtileService: RessourcesFinancieresUtileService
  ) {

  }

  public getRessourcesFinancieres(): RessourcesFinancieres {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.ressourcesFinancieres;
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
      if (ressourcesFinancieres.beneficesMicroEntrepriseDernierExercice) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieres.beneficesMicroEntrepriseDernierExercice);
      }
      if (ressourcesFinancieres.chiffreAffairesIndependantDernierExercice) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieres.chiffreAffairesIndependantDernierExercice);
      }
      montant += this.getMontantPeriodesTravailleesAvantSimulation(ressourcesFinancieres);
    }
    return montant;
  }

  private getMontantPeriodesTravailleesAvantSimulation(ressourcesFinancieres: RessourcesFinancieres): number {
    let montant = 0;
    if (ressourcesFinancieres.periodeTravailleeAvantSimulation != null && ressourcesFinancieres.periodeTravailleeAvantSimulation.mois != null) {
      Object.values(ressourcesFinancieres.periodeTravailleeAvantSimulation.mois).forEach(mois => {
        montant += this.numberUtileService.getMontantSafe(mois.salaire.montantNet);
      });
    }
    return montant;
  }

  public getMontantRevenusRessourcesConjoint(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale && demandeurEmploiConnecte.situationFamiliale.conjoint) {
      const ressourcesFinancieresConjoint = demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres;
      if (ressourcesFinancieresConjoint.salaire && ressourcesFinancieresConjoint.salaire.montantNet) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresConjoint.salaire.montantNet);
      }
      if (ressourcesFinancieresConjoint.beneficesMicroEntrepriseDernierExercice) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresConjoint.beneficesMicroEntrepriseDernierExercice);
      }
      if (ressourcesFinancieresConjoint.chiffreAffairesIndependantDernierExercice) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresConjoint.chiffreAffairesIndependantDernierExercice);
      }
    }
    return montant;
  }

  public getMontantRevenusRessourcesPersonnesCharge(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale && demandeurEmploiConnecte.situationFamiliale.personnesACharge) {
      demandeurEmploiConnecte.situationFamiliale.personnesACharge.forEach((personne) => {
        montant += this.getMontantRevenusPersonneACharge(personne);
      });
    }
    return montant;
  }

  private getMontantRevenusPersonneACharge(personne: Personne): number {
    let montant = 0;
    if (this.personneUtileService.hasRessourcesFinancieres(personne)) {
      const ressourcesFinancieresPersonne = personne.ressourcesFinancieres;
      if (ressourcesFinancieresPersonne.salaire && ressourcesFinancieresPersonne.salaire.montantNet) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresPersonne.salaire.montantNet);
      }
      if (ressourcesFinancieresPersonne.beneficesMicroEntrepriseDernierExercice) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresPersonne.beneficesMicroEntrepriseDernierExercice);
      }
      if (ressourcesFinancieresPersonne.chiffreAffairesIndependantDernierExercice) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresPersonne.chiffreAffairesIndependantDernierExercice);
      }
    }
    return montant;
  }

  public getMontantRevenusRessourcesFoyer(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieres) {
      montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois);
      if (this.deConnecteBeneficiaireAidesService.hasFoyerRSA()) {
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.allocationRSA);
      }
    }
    return montant;
  }

  public getMontantAidesVosRessources(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieres) {
      montant += this.getMontantAidesCAF(demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF);
      montant += this.getMontantAidesPoleEmploi(demandeurEmploiConnecte.ressourcesFinancieres.aidesPoleEmploi);
      montant += this.getMontantAidesCPAM(demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM);
    }
    return montant;
  }

  private getMontantAidesCAF(aidesCAF: AidesCAF): number {
    let montant = 0;
    if (aidesCAF != null) {
      montant += this.numberUtileService.getMontantSafe(aidesCAF.allocationAAH);
      if (!this.deConnecteBeneficiaireAidesService.hasFoyerRSA()) {
        montant += this.numberUtileService.getMontantSafe(aidesCAF.allocationRSA);
      }
    }
    return montant;
  }

  private getMontantAidesPoleEmploi(aidesPoleEmploi: AidesPoleEmploi): number {
    let montant = 0;
    if (aidesPoleEmploi != null) {
      const nbrJourMoisPrecedent = this.dateUtileService.getNombreJoursMoisPrecedent()
      if (aidesPoleEmploi.allocationASS) {
        montant += Math.round(nbrJourMoisPrecedent * this.numberUtileService.getMontantSafe(aidesPoleEmploi.allocationASS.allocationJournaliereNet));
      }
      if (aidesPoleEmploi.allocationARE) {
        montant += Math.round(nbrJourMoisPrecedent * this.numberUtileService.getMontantSafe(aidesPoleEmploi.allocationARE.allocationJournaliereNet));
      }
    }
    return montant;
  }

  private getMontantAidesCPAM(aidesCPAM: AidesCPAM): number {
    let montant = 0;

    if (aidesCPAM != null) {
      montant += this.numberUtileService.getMontantSafe(aidesCPAM.pensionInvalidite);
      montant += this.numberUtileService.getMontantSafe(aidesCPAM.allocationSupplementaireInvalidite);
    }
    return montant;
  }

  public getFuturSalaireNet(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.futurTravail && demandeurEmploiConnecte.futurTravail.salaire && demandeurEmploiConnecte.futurTravail.salaire.montantNet > 0) {
      montant += demandeurEmploiConnecte.futurTravail.salaire.montantNet;
    }
    return montant;
  }

  public getPensionInvalidite(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieres && demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM && demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.pensionInvalidite > 0) {
      montant += demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.pensionInvalidite;
    }
    return montant;
  }

  public getAllocationSupplementaireInvalidite(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieres && demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM && demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite > 0) {
      montant += demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite;
    }
    return montant;
  }

  public getRevenusImmobilierSur1Mois(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieres && demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois) {
      montant += Math.round(demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois / 3);
    }
    return montant;
  }

  public getBeneficesMicroEntrepriseSur1Mois(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieres && demandeurEmploiConnecte.ressourcesFinancieres.beneficesMicroEntrepriseDernierExercice) {
      montant += Math.round(demandeurEmploiConnecte.ressourcesFinancieres.beneficesMicroEntrepriseDernierExercice / 12);
    }
    return montant;
  }

  public getChiffreAffairesIndependantDernierExercice(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieres && demandeurEmploiConnecte.ressourcesFinancieres.chiffreAffairesIndependantDernierExercice) {
      montant += demandeurEmploiConnecte.ressourcesFinancieres.chiffreAffairesIndependantDernierExercice;
    }
    return montant;
  }

  public getChiffreAffairesIndependantSur1Mois(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieres && demandeurEmploiConnecte.ressourcesFinancieres.chiffreAffairesIndependantDernierExercice) {
      montant += Math.round(demandeurEmploiConnecte.ressourcesFinancieres.chiffreAffairesIndependantDernierExercice / 12);
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
      if (ressourcesFinancieresFoyer.aidesCAF.aidesFamiliales) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.aidesCAF.aidesFamiliales.allocationsFamiliales);
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.aidesCAF.aidesFamiliales.allocationSoutienFamilial);
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.aidesCAF.aidesFamiliales.complementFamilial);
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.aidesCAF.aidesFamiliales.pensionsAlimentairesFoyer);
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.aidesCAF.aidesFamiliales.prestationAccueilJeuneEnfant);
      }
      if (ressourcesFinancieresFoyer.aidesCAF.aidesLogement) {
        if (ressourcesFinancieresFoyer.aidesCAF.aidesLogement.aidePersonnaliseeLogement) {
          montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins1);
        }
        if (ressourcesFinancieresFoyer.aidesCAF.aidesLogement.allocationLogementFamiliale) {
          montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins1);
        }
        if (ressourcesFinancieresFoyer.aidesCAF.aidesLogement.allocationLogementSociale) {
          montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresFoyer.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins1);
        }
      }
    }
    return montant;
  }

  public isDonneesRessourcesFinancieresValides(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return this.isAidesValides(ressourcesFinancieres) && this.isRevenusValides(ressourcesFinancieres);
  }

  private isAidesValides(ressourcesFinancieres: RessourcesFinancieres): boolean {
    let isValide = true;
    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireASS()) {
      isValide = this.isDonneesASSSaisiesValide(ressourcesFinancieres);
    }
    if (isValide && this.deConnecteBeneficiaireAidesService.isBeneficiaireRSA() && !this.deConnecteBeneficiaireAidesService.hasFoyerRSA()) {
      isValide = this.isDonneesRSASaisiesValide(ressourcesFinancieres);
    }
    if (isValide && this.deConnecteBeneficiaireAidesService.isBeneficiaireAAH() && isValide) {
      isValide = this.isDonneesAAHSaisiesValides(ressourcesFinancieres);
    }
    if (isValide && this.deConnecteBeneficiaireAidesService.isBeneficiaireARE()) {
      isValide = this.isDonneesARESaisiesValides(ressourcesFinancieres);
    }
    if (isValide && this.deConnecteBeneficiaireAidesService.isBeneficiairePensionInvalidite()) {
      isValide = ressourcesFinancieres.aidesCPAM.pensionInvalidite > 0;
    }
    return isValide;
  }

  private isRevenusValides(ressourcesFinancieres: RessourcesFinancieres): boolean {
    let isValide = true;
    if (isValide && this.deConnecteInfosPersonnellesService.isTravailleurIndependant()) {
      isValide = ressourcesFinancieres.chiffreAffairesIndependantDernierExercice > 0;
    }
    if (isValide && this.deConnecteInfosPersonnellesService.isMicroEntrepreneur()) {
      isValide = ressourcesFinancieres.beneficesMicroEntrepriseDernierExercice > 0;
    }
    if (isValide && this.deConnecteInfosPersonnellesService.hasRevenusImmobilier()) {
      isValide = ressourcesFinancieres.revenusImmobilier3DerniersMois > 0;
    }
    return isValide;
  }

  /**
   * Fonction qui permet de déterminer si la saisie des champs de cumul salaire est correct.
   * @param ressourcesFinancieres
   */
  public isChampsSalairesValides(ressourcesFinancieres: RessourcesFinancieres): boolean {
    let isChampsSalairesValides = true;
    if (ressourcesFinancieres.hasTravailleAuCoursDerniersMois) {
      if (ressourcesFinancieres.periodeTravailleeAvantSimulation != null && ressourcesFinancieres.periodeTravailleeAvantSimulation.mois != null) {
        let tousLesSalairesAZero = true;
        ressourcesFinancieres.periodeTravailleeAvantSimulation.mois.forEach((mois) => {
          if (mois.salaire != null && mois.salaire.montantNet != 0) {
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

  public isDonneesRessourcesFinancieresFoyerValides(ressourcesFinancieres: RessourcesFinancieres, informationsPersonnelles: InformationsPersonnelles): boolean {
    let isValide = true;
    if (this.deConnecteBeneficiaireAidesService.hasFoyerRSA()) {
      isValide = this.isDonneesRSASaisiesValide(ressourcesFinancieres);
    }
    if (isValide) {
      isValide = this.isDonneesLogementValides(informationsPersonnelles) && this.isDonneesAPLValides(ressourcesFinancieres) && this.isDonneesALFValides(ressourcesFinancieres) && this.isDonneesALSValides(ressourcesFinancieres);
    }
    return isValide;
  }

  private isDonneesLogementValides(informationsPersonnelles: InformationsPersonnelles): boolean {
    let isValide = false;
    if (informationsPersonnelles.logement && informationsPersonnelles.logement.statutOccupationLogement &&
      (informationsPersonnelles.logement.statutOccupationLogement.isLocataireHLM
        || informationsPersonnelles.logement.statutOccupationLogement.isLocataireMeuble
        || informationsPersonnelles.logement.statutOccupationLogement.isLocataireNonMeuble
        || informationsPersonnelles.logement.statutOccupationLogement.isLogeGratuitement
        || informationsPersonnelles.logement.statutOccupationLogement.isProprietaire
        || informationsPersonnelles.logement.statutOccupationLogement.isProprietaireAvecEmprunt)) {

      if (!informationsPersonnelles.logement.statutOccupationLogement.isProprietaire && !informationsPersonnelles.logement.statutOccupationLogement.isLogeGratuitement) {
        if (informationsPersonnelles.logement.montantLoyer && informationsPersonnelles.logement.montantLoyer > 0) {
          isValide = true;
        }
      } else {
        isValide = true;
      }
    }
    return isValide;
  }

  private isDonneesAPLValides(ressourcesFinancieres: RessourcesFinancieres): boolean {
    let isValide = true;
    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireAPL()) {
      isValide = ressourcesFinancieres.aidesCAF != null &&
        ressourcesFinancieres.aidesCAF.aidesLogement != null &&
        ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement != null &&
        (ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins1 > 0
          || ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins2 > 0
          || ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins3 > 0);
    }
    return isValide;
  }

  private isDonneesALFValides(ressourcesFinancieres: RessourcesFinancieres): boolean {
    let isValide = true;
    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireALF()) {
      isValide = ressourcesFinancieres.aidesCAF != null &&
        ressourcesFinancieres.aidesCAF.aidesLogement != null &&
        ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale != null &&
        (ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins1 > 0
          || ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins2 > 0
          || ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins3 > 0);
    }
    return isValide;
  }

  private isDonneesALSValides(ressourcesFinancieres: RessourcesFinancieres): boolean {
    let isValide = true;
    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireALS()) {
      isValide = ressourcesFinancieres.aidesCAF != null &&
        ressourcesFinancieres.aidesCAF.aidesLogement != null &&
        ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale != null &&
        (ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins1 > 0
          || ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins2 > 0
          || ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins3 > 0);
    }
    return isValide;
  }


  private isDonneesASSSaisiesValide(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return ressourcesFinancieres.aidesPoleEmploi.allocationASS.dateDerniereOuvertureDroit && !this.dateUtileService.isDateAfterDateJour(ressourcesFinancieres.aidesPoleEmploi.allocationASS.dateDerniereOuvertureDroit)

      && !this.ressourcesFinancieresUtileService.isMontantJournalierAssInvalide(ressourcesFinancieres);
  }

  private isDonneesRSASaisiesValide(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return ressourcesFinancieres.aidesCAF.prochaineDeclarationTrimestrielle
      && !this.ressourcesFinancieresUtileService.isMontantJournalierRSAInvalide(ressourcesFinancieres);
  }

  private isDonneesAAHSaisiesValides(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return ressourcesFinancieres.aidesCAF.allocationAAH > 0;
  }

  //is donnees ARE SAISIE VALIDE comprend tout les champs
  private isDonneesARESaisiesValides(ressourcesFinancieres: RessourcesFinancieres): boolean {
    return ressourcesFinancieres.aidesPoleEmploi.allocationARE.nombreJoursRestants > 0;
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
      if (aidesPoleEmploi.allocationASS) {
        montant += this.numberUtileService.getMontantSafe(aidesPoleEmploi.allocationASS.allocationMensuelleNet);
      }
      if (aidesPoleEmploi.allocationARE) {
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