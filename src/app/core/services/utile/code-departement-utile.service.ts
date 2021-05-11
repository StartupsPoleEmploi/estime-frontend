import { Injectable } from '@angular/core';
import { NumberUtileService } from './number-util.service';
import * as moment from 'moment';

@Injectable({providedIn: 'root'})
export class CodeDepartementUtileService {

  public static CODE_DEPARTEMENT_VAL_OISE = 95;

  constructor(
    private numberUtileService: NumberUtileService
  ) {

  }


  public getCodeDepartement(codePostal: string): string {
    const deuxPremiersCaracteresCodePostal = codePostal.substring(0, 2);
    if(this.numberUtileService.isNumeric(deuxPremiersCaracteresCodePostal)) {
      const deuxPremiersNumber = parseInt(deuxPremiersCaracteresCodePostal);
      if(deuxPremiersNumber > CodeDepartementUtileService.CODE_DEPARTEMENT_VAL_OISE) {
        return codePostal.substring(0, 3);
      }
    }
    return deuxPremiersCaracteresCodePostal;
  }
}