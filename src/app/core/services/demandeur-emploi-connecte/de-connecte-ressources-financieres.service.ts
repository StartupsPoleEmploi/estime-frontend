import { Injectable } from '@angular/core';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { NumberUtileService } from "@app/core/services/utile/number-util.service";
import { RessourcesFinancieresAvantSimulation } from '@app/commun/models/ressources-financieres-avant-simulation';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { DateUtileService } from '../utile/date-util.service';
import { RessourcesFinancieresAvantSimulationUtileService } from '../utile/ressources-financieres-avant-simulation-utile.service';
import { DeConnecteBeneficiaireAidesService } from './de-connecte-beneficiaire-aides.service';
import { DeConnecteInfosPersonnellesService } from './de-connecte-infos-personnelles.service';
import { Personne } from '@app/commun/models/personne';
import { InformationsPersonnelles } from '@app/commun/models/informations-personnelles';
import { AidesCAF } from '@app/commun/models/aides-caf';
import { AidesCPAM } from '@app/commun/models/aides-cpam';
import { AidesPoleEmploi } from '@app/commun/models/aides-pole-emploi';

@Injectable({ providedIn: 'root' })
export class DeConnecteRessourcesFinancieresAvantSimulationService {

  constructor(
    private dateUtileService: DateUtileService,
    private deConnecteService: DeConnecteService,
    private deConnecteBeneficiaireAidesService: DeConnecteBeneficiaireAidesService,
    private deConnecteInfosPersonnellesService: DeConnecteInfosPersonnellesService,
    private numberUtileService: NumberUtileService,
    private personneUtileService: PersonneUtileService,
    private ressourcesFinancieresAvantSimulationUtileService: RessourcesFinancieresAvantSimulationUtileService
  ) {

  }

  public getRessourcesFinancieresAvantSimulation(): RessourcesFinancieresAvantSimulation {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation;
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
    if (demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation) {
      const ressourcesFinancieresAvantSimulation = demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation;
      if (ressourcesFinancieresAvantSimulation.beneficesMicroEntrepriseDernierExercice) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresAvantSimulation.beneficesMicroEntrepriseDernierExercice);
      }
      if (ressourcesFinancieresAvantSimulation.chiffreAffairesIndependantDernierExercice) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieresAvantSimulation.chiffreAffairesIndependantDernierExercice);
      }
      montant += this.getMontantPeriodesTravailleesAvantSimulation(ressourcesFinancieresAvantSimulation);
    }
    return montant;
  }

  private getMontantPeriodesTravailleesAvantSimulation(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): number {
    let montant = 0;
    if (ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation != null && ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation.mois != null) {
      Object.values(ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation.mois).forEach(mois => {
        montant += this.numberUtileService.getMontantSafe(mois.salaire.montantNet);
      });
    }
    return montant;
  }

  public getMontantRevenusRessourcesConjoint(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale && demandeurEmploiConnecte.situationFamiliale.conjoint) {
      const ressourcesFinancieresConjoint = demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation;
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
    if (this.personneUtileService.hasRessourcesFinancieresAvantSimulation(personne)) {
      const ressourcesFinancieresPersonne = personne.ressourcesFinancieresAvantSimulation;
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
    if (demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation) {
      montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.revenusImmobilier3DerniersMois);
      if (this.deConnecteBeneficiaireAidesService.hasFoyerRSA()) {
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA);
      }
    }
    return montant;
  }

  public getMontantAidesVosRessources(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation) {
      montant += this.getMontantAidesCAF(demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF);
      montant += this.getMontantAidesPoleEmploi(demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi);
      montant += this.getMontantAidesCPAM(demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCPAM);
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
        montant += Math.round(nbrJourMoisPrecedent * this.numberUtileService.getMontantSafe(aidesPoleEmploi.allocationARE.montantJournalierBrut));
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
    if (demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation && demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCPAM && demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCPAM.pensionInvalidite > 0) {
      montant += demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCPAM.pensionInvalidite;
    }
    return montant;
  }

  public getAllocationSupplementaireInvalidite(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation && demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCPAM && demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCPAM.allocationSupplementaireInvalidite > 0) {
      montant += demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCPAM.allocationSupplementaireInvalidite;
    }
    return montant;
  }

  public getRevenusImmobilierSur1Mois(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation && demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.revenusImmobilier3DerniersMois) {
      montant += Math.round(demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.revenusImmobilier3DerniersMois / 3);
    }
    return montant;
  }

  public getBeneficesMicroEntrepriseSur1Mois(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation && demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.beneficesMicroEntrepriseDernierExercice) {
      montant += Math.round(demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.beneficesMicroEntrepriseDernierExercice / 12);
    }
    return montant;
  }

  public getChiffreAffairesIndependantDernierExercice(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation && demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.chiffreAffairesIndependantDernierExercice) {
      montant += demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.chiffreAffairesIndependantDernierExercice;
    }
    return montant;
  }

  public getChiffreAffairesIndependantSur1Mois(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation && demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.chiffreAffairesIndependantDernierExercice) {
      montant += Math.round(demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.chiffreAffairesIndependantDernierExercice / 12);
    }
    return montant;
  }

  public getMontantAidesRessourcesConjoint(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale && demandeurEmploiConnecte.situationFamiliale.conjoint) {
      const ressourcesFinancieresConjoint = demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation;
      montant += this.getMontantAidesRessources(ressourcesFinancieresConjoint);
    }
    return montant;
  }

  public getMontantAidesRessourcesPersonnesCharge(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale && demandeurEmploiConnecte.situationFamiliale.personnesACharge) {
      demandeurEmploiConnecte.situationFamiliale.personnesACharge.forEach((personne) => {
        if (this.personneUtileService.hasRessourcesFinancieresAvantSimulation(personne)) {
          const ressourcesFinancieresPersonne = personne.ressourcesFinancieresAvantSimulation;
          montant += this.getMontantAidesRessources(ressourcesFinancieresPersonne);
        }
      });
    }
    return montant;
  }

  public getMontantAidesRessourcesFoyer(): number {
    let montant = 0;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    const ressourcesFinancieresFoyer = demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation;
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

  public isDonneesRessourcesFinancieresAvantSimulationValides(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): boolean {
    ressourcesFinancieresAvantSimulation = this.ressourcesFinancieresAvantSimulationUtileService.replaceCommaByDotMontantsRessourcesFinancieresAvantSimulation(ressourcesFinancieresAvantSimulation);
    return this.isAidesValides(ressourcesFinancieresAvantSimulation) && this.isRevenusValides(ressourcesFinancieresAvantSimulation);
  }

  private isAidesValides(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): boolean {
    let isValide = true;
    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireASS()) {
      isValide = this.isDonneesASSSaisiesValide(ressourcesFinancieresAvantSimulation);
    }
    if (isValide && this.deConnecteBeneficiaireAidesService.isBeneficiaireRSA() && !this.deConnecteBeneficiaireAidesService.hasFoyerRSA()) {
      isValide = this.isDonneesRSASaisiesValide(ressourcesFinancieresAvantSimulation);
    }
    if (isValide && this.deConnecteBeneficiaireAidesService.isBeneficiaireAAH() && isValide) {
      isValide = this.isDonneesAAHSaisiesValides(ressourcesFinancieresAvantSimulation);
    }
    if (isValide && this.deConnecteBeneficiaireAidesService.isBeneficiaireARE()) {
      isValide = this.isDonneesARESaisiesValides(ressourcesFinancieresAvantSimulation);
    }
    if (isValide && this.deConnecteBeneficiaireAidesService.isBeneficiairePensionInvalidite()) {
      isValide = this.numberUtileService.replaceCommaByDot(ressourcesFinancieresAvantSimulation.aidesCPAM.pensionInvalidite) > 0;
    }
    return isValide;
  }

  private isRevenusValides(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): boolean {
    let isValide = true;
    if (isValide && this.deConnecteInfosPersonnellesService.isTravailleurIndependant()) {
      isValide = ressourcesFinancieresAvantSimulation.chiffreAffairesIndependantDernierExercice > 0;
    }
    if (isValide && this.deConnecteInfosPersonnellesService.isMicroEntrepreneur()) {
      isValide = ressourcesFinancieresAvantSimulation.beneficesMicroEntrepriseDernierExercice > 0;
    }
    if (isValide && this.deConnecteInfosPersonnellesService.hasRevenusImmobilier()) {
      isValide = ressourcesFinancieresAvantSimulation.revenusImmobilier3DerniersMois > 0;
    }
    return isValide;
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

  public isDonneesRessourcesFinancieresAvantSimulationFoyerValides(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation, informationsPersonnelles: InformationsPersonnelles): boolean {
    let isValide = true;
    if (this.deConnecteBeneficiaireAidesService.hasFoyerRSA()) {
      isValide = this.isDonneesRSASaisiesValide(ressourcesFinancieresAvantSimulation);
    }
    if (isValide) {
      isValide = this.isDonneesLogementValides(informationsPersonnelles);
    }
    if (isValide) {
      isValide = this.isDonneesAPLValides(ressourcesFinancieresAvantSimulation) && this.isDonneesALFValides(ressourcesFinancieresAvantSimulation) && this.isDonneesALSValides(ressourcesFinancieresAvantSimulation);
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
      if (!informationsPersonnelles.logement.statutOccupationLogement.isProprietaire && !informationsPersonnelles.logement.statutOccupationLogement.isProprietaireAvecEmprunt && !informationsPersonnelles.logement.statutOccupationLogement.isLogeGratuitement) {
        if (informationsPersonnelles.logement.montantLoyer && informationsPersonnelles.logement.montantLoyer > 0) {
          isValide = true;
        }
      } else {
        isValide = true;
      }
    }
    return isValide;
  }

  private isDonneesAPLValides(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): boolean {
    let isValide = true;
    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireAPL()) {
      isValide = ressourcesFinancieresAvantSimulation.aidesCAF != null &&
        ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement != null &&
        ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement != null &&
        (ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins1 > 0
          || ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins2 > 0
          || ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins3 > 0);
    }
    return isValide;
  }

  private isDonneesALFValides(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): boolean {
    let isValide = true;
    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireALF()) {
      isValide = ressourcesFinancieresAvantSimulation.aidesCAF != null &&
        ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement != null &&
        ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale != null &&
        (ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins1 > 0
          || ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins2 > 0
          || ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins3 > 0);
    }
    return isValide;
  }

  private isDonneesALSValides(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): boolean {
    let isValide = true;
    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireALS()) {
      isValide = ressourcesFinancieresAvantSimulation.aidesCAF != null &&
        ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement != null &&
        ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale != null &&
        (ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins1 > 0
          || ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins2 > 0
          || ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins3 > 0);
    }
    return isValide;
  }


  private isDonneesASSSaisiesValide(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): boolean {
    return ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.dateDerniereOuvertureDroit
      && !this.dateUtileService.isDateAfterDateJour(ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.dateDerniereOuvertureDroit)
      && !this.ressourcesFinancieresAvantSimulationUtileService.isMontantJournalierAssInvalide(ressourcesFinancieresAvantSimulation);
  }

  private isDonneesRSASaisiesValide(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): boolean {
    return ressourcesFinancieresAvantSimulation.aidesCAF.prochaineDeclarationTrimestrielle
      && !this.ressourcesFinancieresAvantSimulationUtileService.isMontantJournalierRSAInvalide(ressourcesFinancieresAvantSimulation);
  }

  private isDonneesAAHSaisiesValides(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): boolean {
    return ressourcesFinancieresAvantSimulation.aidesCAF.allocationAAH > 0;
  }

  //is donnees ARE SAISIE VALIDE comprend tout les champs
  private isDonneesARESaisiesValides(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): boolean {
    return ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.montantJournalierBrut > 0 &&
      ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.salaireJournalierReferenceBrut > 0 &&
      ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.nombreJoursRestants > 0;
  }

  private getMontantAidesRessources(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): number {
    let montant = 0;
    if (ressourcesFinancieresAvantSimulation) {
      montant += this.getMontantAidesRessourcesCAF(ressourcesFinancieresAvantSimulation);
      montant += this.getMontantAidesRessourcesPoleEmploi(ressourcesFinancieresAvantSimulation);
      montant += this.getMontantAidesRessourcesCPAM(ressourcesFinancieresAvantSimulation);
    }
    return montant;
  }

  private getMontantAidesRessourcesCAF(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): number {
    let montant = 0;
    if (ressourcesFinancieresAvantSimulation.aidesCAF) {
      const aidesCAF = ressourcesFinancieresAvantSimulation.aidesCAF;
      montant += this.numberUtileService.getMontantSafe(aidesCAF.allocationAAH)
        + this.numberUtileService.getMontantSafe(aidesCAF.allocationRSA);
    }
    return montant;
  }

  private getMontantAidesRessourcesPoleEmploi(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): number {
    let montant = 0;
    if (ressourcesFinancieresAvantSimulation.aidesPoleEmploi) {
      const aidesPoleEmploi = ressourcesFinancieresAvantSimulation.aidesPoleEmploi;
      if (aidesPoleEmploi.allocationASS) {
        montant += this.numberUtileService.getMontantSafe(aidesPoleEmploi.allocationASS.allocationMensuelleNet);
      }
      if (aidesPoleEmploi.allocationARE) {
        montant += this.numberUtileService.getMontantSafe(aidesPoleEmploi.allocationARE.allocationMensuelleNet);
      }
    }
    return montant;
  }

  private getMontantAidesRessourcesCPAM(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation): number {
    let montant = 0;
    if (ressourcesFinancieresAvantSimulation.aidesCPAM) {
      const aidesCPAM = ressourcesFinancieresAvantSimulation.aidesCPAM;
      montant += this.numberUtileService.getMontantSafe(aidesCPAM.pensionInvalidite)
        + this.numberUtileService.getMontantSafe(aidesCPAM.allocationSupplementaireInvalidite);
    }
    return montant;
  }
}