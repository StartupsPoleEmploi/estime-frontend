import { Injectable } from '@angular/core';
import { DateUtileService } from './date-util.service';
import { DateDecomposee } from '@app/commun/models/date-decomposee';

@Injectable({providedIn: 'root'})
export class PersonneUtileService {

  private readonly AGE_LEGAL_POUR_TRAVAILLE = 16;

  constructor(
    private dateUtileService: DateUtileService
  ) {

  }

  isAgeLegalPourTravailler(dateNaissance: DateDecomposee): boolean {
    const dateNaissanceFormatDate = this.dateUtileService.getDateFromDateDecomposee(dateNaissance);
    const diffEnMilliseconds = Date.now() - dateNaissanceFormatDate.getTime();
    const dateAge = new Date(diffEnMilliseconds);
    const ageEnAnnee = Math.abs(dateAge.getUTCFullYear() - 1970);
    return ageEnAnnee >= this.AGE_LEGAL_POUR_TRAVAILLE ? true : false;
  }
}