import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class NumberUtileService {

  authoriserNumericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
}