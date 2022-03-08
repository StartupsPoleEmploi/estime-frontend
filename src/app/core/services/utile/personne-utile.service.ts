
import { Injectable } from '@angular/core';
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';
import { DateDecomposee } from '@models/date-decomposee';
import { AidesCAF } from "@models/aides-caf";
import { AidesPoleEmploi } from "@models/aides-pole-emploi";
import { AidesCPAM } from "@models/aides-cpam";
import { InformationsPersonnelles } from "@models/informations-personnelles";
import { Personne } from "@models/personne";
import { RessourcesFinancieresAvantSimulation } from "@app/commun/models/ressources-financieres-avant-simulation";
import { DateUtileService } from './date-util.service';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class PersonneUtileService {

  AGE_LEGAL_POUR_TRAVAILLE = 16;

  constructor(
    private dateUtileService: DateUtileService
  ) {

  }

  public creerPersonne(isAvecRessourcesFinancieres: boolean): Personne {
    const personne = new Personne();
    personne.beneficiaireAides = this.initBeneficiaireAides();
    personne.informationsPersonnelles = new InformationsPersonnelles();
    personne.informationsPersonnelles.salarie = false;
    personne.informationsPersonnelles.sansRessource = false;
    if (isAvecRessourcesFinancieres) {
      personne.ressourcesFinancieresAvantSimulation = new RessourcesFinancieresAvantSimulation();
      personne.ressourcesFinancieresAvantSimulation.aidesCAF = new AidesCAF();
      personne.ressourcesFinancieresAvantSimulation.aidesPoleEmploi = new AidesPoleEmploi();
      personne.ressourcesFinancieresAvantSimulation.aidesCPAM = new AidesCPAM();
      personne.ressourcesFinancieresAvantSimulation.aidesCPAM.allocationSupplementaireInvalidite = 0;
    }
    return personne;
  }

  public hasRessourcesFinancieresAvantSimulation(personne: Personne): boolean {
    let hasRessourcesFinancieres = false;
    if (personne.informationsPersonnelles) {
      if (this.isSansRessourceEtHasTravailleAuCoursDernierMoisNonComplete(personne)) {
        hasRessourcesFinancieres = true;
      }
      if (!personne.informationsPersonnelles.sansRessource
        && (personne.informationsPersonnelles.salarie
          || this.hasRessourcesAides(personne)
          || this.hasRevenus(personne)
        )
      ) {
        hasRessourcesFinancieres = true;
      }
    }
    return hasRessourcesFinancieres;
  }

  private isSansRessourceEtHasTravailleAuCoursDernierMoisNonComplete(personne: Personne) {
    let isSansRessourceEtHasTravailleAuCoursDernierMoisNonComplete = false;
    if (personne.informationsPersonnelles) {
      if (personne.informationsPersonnelles.sansRessource && personne.ressourcesFinancieresAvantSimulation.hasTravailleAuCoursDerniersMois == null) {
        isSansRessourceEtHasTravailleAuCoursDernierMoisNonComplete = true;
      }
    }
    return isSansRessourceEtHasTravailleAuCoursDernierMoisNonComplete;
  }

  public isAgeLegalPourTravaillerFromPersonne(personne: Personne): boolean {
    const dateNaissanceString = personne.informationsPersonnelles.dateNaissance;
    const dateNaissance = this.dateUtileService.getDateFromStringDate(dateNaissanceString);
    return this.isDateNaissanceSuperieurAAgeLegal(dateNaissance);
  }

  public isAgeLegalPourTravaillerFromDateDecomposee(dateNaissance: DateDecomposee): boolean {
    const dateNaissanceFormatDate = this.dateUtileService.getDateFromDateDecomposee(dateNaissance);
    return this.isDateNaissanceSuperieurAAgeLegal(dateNaissanceFormatDate);
  }

  private isDateNaissanceSuperieurAAgeLegal(dateNaissance: Date): boolean {
    const diffEnMilliseconds = Date.now() - dateNaissance.getTime();
    const dateAge = new Date(diffEnMilliseconds);
    const ageEnAnnee = Math.abs(dateAge.getUTCFullYear() - 1970);
    return ageEnAnnee >= this.AGE_LEGAL_POUR_TRAVAILLE ? true : false;
  }

  public isAgeInferieurA3Ans(dateNaissanceString: string): boolean {
    let dateNaissance = moment(dateNaissanceString, 'YYYY-MM-DD').toDate();
    return this.dateUtileService.isDatePlusDe3AnsEt1Mois(dateNaissance);
  }

  public isAgeEntre3Et21Ans(dateNaissanceString: string): boolean {
    let dateNaissance = moment(dateNaissanceString, 'YYYY-MM-DD').toDate();
    return this.dateUtileService.isDateEntre3Et21Ans(dateNaissance);
  }

  public isAgeEligibleRetraite(dateNaissanceDecomposee: DateDecomposee): boolean {
    let dateNaissance = this.dateUtileService.getDateFromDateDecomposee(dateNaissanceDecomposee);
    return this.dateUtileService.isDateEligibleRetraite(dateNaissance);
  }

  public isRessourcesFinancieresAvantSimulationValides(personne: Personne): boolean {
    return this.isAidesValides(personne) && this.isRevenusValides(personne);
  }

  private isAidesValides(personne: Personne): boolean {
    let isValide = true;
    if (isValide && personne.beneficiaireAides.beneficiaireARE) {
      isValide = personne.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationMensuelleNet > 0;
    }
    if (isValide && personne.beneficiaireAides.beneficiaireASS) {
      isValide = personne.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.allocationMensuelleNet > 0;
    }
    if (isValide && personne.beneficiaireAides.beneficiaireAAH) {
      isValide = personne.ressourcesFinancieresAvantSimulation.aidesCAF.allocationAAH > 0;
    }
    if (isValide && personne.beneficiaireAides.beneficiairePensionInvalidite) {
      isValide = personne.ressourcesFinancieresAvantSimulation.aidesCPAM.pensionInvalidite > 0;
    }
    return isValide;
  }

  private isRevenusValides(personne: Personne): boolean {
    let isValide = true;
    if (personne.informationsPersonnelles && personne.informationsPersonnelles.sansRessource) {
      isValide = personne.ressourcesFinancieresAvantSimulation.hasTravailleAuCoursDerniersMois != null;
    }
    if (personne.informationsPersonnelles && personne.informationsPersonnelles.salarie) {
      isValide = personne.ressourcesFinancieresAvantSimulation.salaire.montantNet > 0;
    }
    if (isValide && personne.informationsPersonnelles.microEntrepreneur) {
      isValide = personne.ressourcesFinancieresAvantSimulation.beneficesMicroEntrepriseDernierExercice > 0;
    }
    if (isValide && personne.informationsPersonnelles.travailleurIndependant) {
      isValide = personne.ressourcesFinancieresAvantSimulation.chiffreAffairesIndependantDernierExercice > 0;
    }
    if (isValide && personne.informationsPersonnelles.hasRevenusImmobilier) {
      isValide = personne.ressourcesFinancieresAvantSimulation.revenusImmobilier3DerniersMois > 0;
    }
    return isValide;
  }

  public isBeneficiaireSeulementRSA(personne: Personne): boolean {
    let isBeneficiare = false
    if (personne !== null) {
      isBeneficiare = !personne.beneficiaireAides.beneficiaireARE
        && !personne.beneficiaireAides.beneficiaireAAH
        && !personne.beneficiaireAides.beneficiaireASS
        && !personne.beneficiaireAides.beneficiairePensionInvalidite
        && personne.beneficiaireAides.beneficiaireRSA;
    }
    return isBeneficiare;
  }

  private hasRessourcesAides(personne: Personne): boolean {
    return personne.beneficiaireAides
      && (
        personne.beneficiaireAides.beneficiaireAAH
        || personne.beneficiaireAides.beneficiaireARE
        || personne.beneficiaireAides.beneficiaireASS
        || personne.beneficiaireAides.beneficiaireRSA
        || personne.beneficiaireAides.beneficiairePensionInvalidite
      );
  }

  private hasRevenus(personne: Personne): boolean {
    return personne.informationsPersonnelles
      && (
        personne.informationsPersonnelles.hasRevenusImmobilier
        || personne.informationsPersonnelles.microEntrepreneur
        || personne.informationsPersonnelles.travailleurIndependant
      );
  }

  private initBeneficiaireAides(): BeneficiaireAides {
    const beneficiaireAides = new BeneficiaireAides();
    beneficiaireAides.beneficiaireAAH = false;
    beneficiaireAides.beneficiaireARE = false;
    beneficiaireAides.beneficiaireASS = false;
    beneficiaireAides.beneficiairePensionInvalidite = false;
    beneficiaireAides.beneficiaireRSA = false;
    beneficiaireAides.beneficiaireAPL = false;
    beneficiaireAides.beneficiaireALF = false;
    beneficiaireAides.beneficiaireALS = false;
    return beneficiaireAides
  }

  public unsetSalairesAvantPeriodeSimulation(personne: Personne): void {
    if (personne.ressourcesFinancieresAvantSimulation &&
      personne.ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation) {
      personne.ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation = null
    }
  }
}

