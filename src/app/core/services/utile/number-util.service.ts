import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class NumberUtileService {

  constructor() {

  }

  public replaceCommaByDot(numberToTransform: number): number {
    if (numberToTransform !== undefined && numberToTransform !== null) {
      const numberToTransformString = numberToTransform.toString();
      return parseFloat(numberToTransformString.replace(/,/g, "."));
    }
    return numberToTransform;
  }

  public getMontantSafe(montant: any) {
    if(montant !== undefined && montant !== null) {
      return parseFloat(montant);
    }
    return 0;
  }

  public roundTwoDecimals(montant: number) {
    return Math.floor(montant * 100) / 100;
  }

  public isNumeric(valeur: any): boolean {
    return !isNaN(valeur);
  }
}