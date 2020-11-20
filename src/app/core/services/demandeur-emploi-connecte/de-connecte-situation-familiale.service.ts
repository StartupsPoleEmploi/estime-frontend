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
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.situationFamiliale.isEnCouple
    && this.personneUtileService.hasRessourcesFinancieres(demandeurEmploiConnecte.situationFamiliale.conjoint);
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

  public isEnCouple(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.situationFamiliale?.isEnCouple;
  }
}

