import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class DateUtileService {

  isBissextile(annee: number): boolean {
    return (annee % 100 === 0) ? (annee % 400 === 0) : (annee % 4 === 0);
  }

  getNombreJours(month:number, year:number) {
    return new Date(year, month, 0).getDate();
  }
}