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

  public getMontantSafe(montant: number) {
    if(montant !== undefined && montant !== null) {
      return montant;
    }
    return 0;
  }
}