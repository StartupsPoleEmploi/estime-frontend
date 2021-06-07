
import { Injectable } from '@angular/core';
import { SituationFamiliale } from "@models/situation-familiale";
import { PersonneUtileService } from "@app/core/services/utile/personne-utile.service";

@Injectable({ providedIn: 'root' })
export class SituationFamilialeUtileService {

  constructor(
    private personneUtileService: PersonneUtileService
  ) {

  }

  public creerSituationFamiliale(): SituationFamiliale {
    const situationFamiliale = new SituationFamiliale();
    situationFamiliale.conjoint = this.personneUtileService.creerPersonne(true);
    return situationFamiliale;
  }
}