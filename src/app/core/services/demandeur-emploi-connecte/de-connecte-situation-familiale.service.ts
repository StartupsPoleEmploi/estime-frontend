import { Injectable } from '@angular/core';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';

@Injectable({ providedIn: 'root' })
export class DeConnecteSituationFamilialeService {

  constructor(
    private deConnecteService: DeConnecteService,
    private personneUtileService: PersonneUtileService
  ) {

  }

  public hasConjointSituationAvecRessource(): boolean {
    let hasConjointSituationAvecRessource = false;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if(demandeurEmploiConnecte.situationFamiliale.isEnCouple) {
      if(demandeurEmploiConnecte.situationFamiliale.conjoint
        && this.personneUtileService.hasRessourcesFinancieres(demandeurEmploiConnecte.situationFamiliale.conjoint)) {
          hasConjointSituationAvecRessource = true;
      }
    }
    return hasConjointSituationAvecRessource;
  }

  public hasPersonneACharge(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.situationFamiliale.personnesACharge
    && demandeurEmploiConnecte.situationFamiliale.personnesACharge.length > 0;
  }

  public hasPersonneAChargeAvecRessourcesFinancieres(): boolean {
    let hasPersonneAChargeAvecRessourcesFinancieres = false;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if(demandeurEmploiConnecte.situationFamiliale.personnesACharge) {
      demandeurEmploiConnecte.situationFamiliale.personnesACharge.forEach(personne => {
        if(this.personneUtileService.hasRessourcesFinancieres(personne)) {
          hasPersonneAChargeAvecRessourcesFinancieres = true;
        }
      });
    }
    return hasPersonneAChargeAvecRessourcesFinancieres;
  }

  public isRessourcesFinancieresConjointValides(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return this.personneUtileService.isRessourcesFinancieresValides(demandeurEmploiConnecte.situationFamiliale.conjoint);
  }

  public isRessourcesFinancieresPersonnesAChargeValides(): boolean {
    let isRessourcesFinancieresPersonnesAChargeValides = true;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    demandeurEmploiConnecte.situationFamiliale.personnesACharge.forEach(personne => {
      if(this.personneUtileService.hasRessourcesFinancieres(personne)) {
        const isRessourcesFinancieresPersonneValides = this.personneUtileService.isRessourcesFinancieresValides(personne);
        if(!isRessourcesFinancieresPersonneValides) {
          isRessourcesFinancieresPersonnesAChargeValides = false;
        }
      }
    });
    return isRessourcesFinancieresPersonnesAChargeValides;
  }

  public isEnCouple(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.situationFamiliale?.isEnCouple;
  }

  public has2PersonnesACharges(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.situationFamiliale?.personnesACharge.length >=2;
  }

  public hasPersonneAChargeMoinsDe3Ans(): boolean {
    let hasPersonneAChargeMoinsDe3Ans = false;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    demandeurEmploiConnecte.situationFamiliale.personnesACharge.forEach(personneACharge => {
      if(!hasPersonneAChargeMoinsDe3Ans) hasPersonneAChargeMoinsDe3Ans = this.personneUtileService.isAgeInferieurA3Ans(personneACharge.informationsPersonnelles.dateNaissance)

    });
    return hasPersonneAChargeMoinsDe3Ans;
  }
}

