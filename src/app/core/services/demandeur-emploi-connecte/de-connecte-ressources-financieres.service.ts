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
    if (ressourcesFinancieres.periodeTravailleeAvantSimulation) {
      if (ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins1.salaire.montantNet) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins1.salaire.montantNet);
      }
      if (ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins2.salaire.montantNet) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins2.salaire.montantNet);
      }
      if (ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins3.salaire.montantNet) {
        montant += this.numberUtileService.getMontantSafe(ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins3.salaire.montantNet);
      }
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
      if (demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF) {
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.allocationAAH);
        if (!this.deConnecteBeneficiaireAidesService.hasFoyerRSA()) {
          montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.allocationRSA);
        }
      }
      if (demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM) {
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.pensionInvalidite);
        montant += this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite);
      }
      if (demandeurEmploiConnecte.ressourcesFinancieres.aidesPoleEmploi) {
        if (demandeurEmploiConnecte.ressourcesFinancieres.aidesPoleEmploi.allocationASS) {
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
    let isValide = true;

    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireASS()) {
      isValide = this.isDonneesASSSaisiesValide(ressourcesFinancieres);
    }
    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireRSA() && !this.deConnecteBeneficiaireAidesService.hasFoyerRSA() && isValide) {
      isValide = this.isDonneesRSASaisiesValide(ressourcesFinancieres);
    }
    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireAAH() && isValide) {
      isValide = this.isDonneesAAHSaisiesValides(ressourcesFinancieres);
    }
    if (isValide && this.deConnecteBeneficiaireAidesService.isBeneficiairePensionInvalidite() && isValide) {
      isValide = ressourcesFinancieres.aidesCPAM.pensionInvalidite > 0;
    }
    if (isValide && this.deConnecteInfosPersonnellesService.isTravailleurIndependant() && isValide) {
      isValide = ressourcesFinancieres.chiffreAffairesIndependantDernierExercice > 0;
    }
    if (isValide && this.deConnecteInfosPersonnellesService.isMicroEntrepreneur() && isValide) {
      isValide = ressourcesFinancieres.beneficesMicroEntrepriseDernierExercice > 0;
    }
    return isValide;
  }

  public isDonneesRessourcesFinancieresFoyerValides(ressourcesFinancieres: RessourcesFinancieres, informationsPersonnelles: InformationsPersonnelles): boolean {
    let isValide = true;
    if (this.deConnecteBeneficiaireAidesService.hasFoyerRSA()) {
      isValide = this.isDonneesRSASaisiesValide(ressourcesFinancieres);
    }
    if (this.deConnecteInfosPersonnellesService.hasRevenusImmobilier() && isValide) {
      isValide = ressourcesFinancieres.revenusImmobilier3DerniersMois > 0;
    }
    if (isValide) {
      isValide = this.isDonneesLogementValides(informationsPersonnelles);
    }
    isValide = this.isDonneesAPLValides(ressourcesFinancieres) && this.isDonneesALFValides(ressourcesFinancieres) && this.isDonneesALSValides(ressourcesFinancieres);
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
        if (informationsPersonnelles.logement.montantCharges && informationsPersonnelles.logement.montantLoyer && informationsPersonnelles.logement.montantLoyer > 0) {
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