import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class NumberUtileService {


  constructor(
  ) {

  }

  replaceCommaByDot(numberToTransform: number): number {
    if (numberToTransform !== undefined && numberToTransform !== null) {
      const numberToTransformString = numberToTransform.toString();
      return parseFloat(numberToTransformString.replace(/,/g, "."));
    }
    return numberToTransform;
  }
}