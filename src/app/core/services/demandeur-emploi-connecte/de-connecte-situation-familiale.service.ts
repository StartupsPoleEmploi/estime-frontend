import { Injectable } from '@angular/core';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { DateUtileService } from "@app/core/services/utile/date-util.service";
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { DateDecomposee } from "@models/date-decomposee";

@Injectable({ providedIn: 'root' })
export class DeConnecteSituationFamilialeService {

  constructor(
    private deConnecteService: DeConnecteService,
    private personneUtileService: PersonneUtileService,
    public dateUtileService: DateUtileService
  ) {

  }

  public hasConjointSituationAvecRessource(): boolean {
    let hasConjointSituationAvecRessource = false;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale.isEnCouple) {
      if (demandeurEmploiConnecte.situationFamiliale.conjoint
        && this.personneUtileService.hasRessourcesFinancieres(demandeurEmploiConnecte.situationFamiliale.conjoint)) {
        hasConjointSituationAvecRessource = true;
      }
    }
    return hasConjointSituationAvecRessource;
  }

  public hasPersonneAChargeSuperieur(nombrePersonne: number): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.situationFamiliale.personnesACharge
      && demandeurEmploiConnecte.situationFamiliale.personnesACharge.length > nombrePersonne;
  }

  public hasTroisPersonneAChargePlusTroisAns() : boolean{
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    let result = false;
    let hasTroisPersonneAChargePlusTroisAnsCount = 0;
    if(demandeurEmploiConnecte.situationFamiliale.personnesACharge.length>=3){
      demandeurEmploiConnecte.situationFamiliale.personnesACharge.forEach(personneACharge => { 
        let dateDecomposeNaissancePersonneACharge = this.dateUtileService.getDateDecomposeeFromStringDate(personneACharge.informationsPersonnelles.dateNaissance, "date de naissance de la personne à charge", "DateNaissancePersonneACharge");
        let dateNaissancePersonneACharge = this.dateUtileService.getDateFromDateDecomposee(dateDecomposeNaissancePersonneACharge);
        let timeDiff = Math.abs(Date.now() - dateNaissancePersonneACharge.getTime());
        let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
        if(age >= 3 && age <= 21){
          ++hasTroisPersonneAChargePlusTroisAnsCount;
        }
      });
    }
    return hasTroisPersonneAChargePlusTroisAnsCount >=3;
  }

  public hasPersonneAChargeAvecRessourcesFinancieres(): boolean {
    let hasPersonneAChargeAvecRessourcesFinancieres = false;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale.personnesACharge) {
      demandeurEmploiConnecte.situationFamiliale.personnesACharge.forEach(personne => {
        if (this.personneUtileService.hasRessourcesFinancieres(personne)) {
          hasPersonneAChargeAvecRessourcesFinancieres = true;
        }
      });
    }
    return hasPersonneAChargeAvecRessourcesFinancieres;
  }


  public hasPersonneAChargeSeulementRSA(): boolean {
    let hasPersonneAChargeAvecSeulementRSA = false;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (this.hasPersonneAChargeAvecRessourcesFinancieres()) {
      hasPersonneAChargeAvecSeulementRSA = demandeurEmploiConnecte.situationFamiliale.personnesACharge.some(
        personne => this.personneUtileService.isBeneficiaireSeulementRSA(personne));
    }
    return hasPersonneAChargeAvecSeulementRSA;
  }


  public hasConjointSeulementRSA(): boolean {
    let hasConjointAvecSeulementRSA = false;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale.isEnCouple) {
      if (demandeurEmploiConnecte.situationFamiliale.conjoint !== null) {
        if (this.personneUtileService.isBeneficiaireSeulementRSA(demandeurEmploiConnecte.situationFamiliale.conjoint)) {
          hasConjointAvecSeulementRSA = true;
        }
      }
    }
    return hasConjointAvecSeulementRSA;
  }

  public hasPersonneAChargeMoinsDe3Ans(): boolean {
    let hasPersonneAChargeMoinsDe3Ans = false;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale
      && demandeurEmploiConnecte.situationFamiliale.personnesACharge) {
      demandeurEmploiConnecte.situationFamiliale.personnesACharge.forEach(personneACharge => {
        if (!hasPersonneAChargeMoinsDe3Ans) {
          hasPersonneAChargeMoinsDe3Ans = this.personneUtileService.isAgeInferieurA3Ans(personneACharge.informationsPersonnelles.dateNaissance)
        }
      });
    }
    return hasPersonneAChargeMoinsDe3Ans;
  }

  public hasPersonneACharge(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.situationFamiliale != null
      && demandeurEmploiConnecte.situationFamiliale.personnesACharge != null
      && demandeurEmploiConnecte.situationFamiliale.personnesACharge.length > 0;
  }

  public isEnCouple(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.situationFamiliale?.isEnCouple;
  }

  public isCelibataireSansEnfant(): boolean {
    return !this.isEnCouple() && !this.hasPersonneACharge();
  }

  public isRessourcesFinancieresConjointValides(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return this.personneUtileService.isRessourcesFinancieresValides(demandeurEmploiConnecte.situationFamiliale.conjoint);
  }

  public isRessourcesFinancieresPersonnesAChargeValides(): boolean {
    let isRessourcesFinancieresPersonnesAChargeValides = true;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    demandeurEmploiConnecte.situationFamiliale.personnesACharge.forEach(personne => {
      if (this.personneUtileService.hasRessourcesFinancieres(personne)) {
        const isRessourcesFinancieresPersonneValides = this.personneUtileService.isRessourcesFinancieresValides(personne);
        if (!isRessourcesFinancieresPersonneValides) {
          isRessourcesFinancieresPersonnesAChargeValides = false;
        }
      }
    });
    return isRessourcesFinancieresPersonnesAChargeValides;
  }

}

