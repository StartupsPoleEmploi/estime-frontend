import { Injectable } from '@angular/core';
import { DateDecomposee } from "@models/date-decomposee";

@Injectable({providedIn: 'root'})
export class DateUtileService {

  isBissextile(annee: number): boolean {
    return (annee % 100 === 0) ? (annee % 400 === 0) : (annee % 4 === 0);
  }

  getNombreJoursMois(mois:number, annee:number): number {
    return new Date(annee, mois, 0).getDate();
  }

  isFormatDateValide(dateDecomposee: DateDecomposee): boolean {
    return this.checkFormat(dateDecomposee) === undefined;
  }

  checkFormat(dateDecomposee: DateDecomposee): string {
    let errorFormatMessage = undefined;
    const nbJourMois = this.getNombreJoursMois(parseInt(dateDecomposee.mois), parseInt(dateDecomposee.annee));
    if(dateDecomposee.jour) {
      if(parseInt(dateDecomposee.jour) > nbJourMois) {
        errorFormatMessage = "Le jour doit être inférieur ou égal à " + nbJourMois;
      }
      if(dateDecomposee.jour.length != 2) {
        errorFormatMessage = "Le jour doit être au format JJ";
      }
      if(dateDecomposee.jour === "00") {
        errorFormatMessage = "Le jour est incorrect";
      }
    }
    if(dateDecomposee.mois) {
      if(dateDecomposee.mois.length != 2) {
        errorFormatMessage = "Le mois doit être au format MM";
      }
      if(parseInt(dateDecomposee.mois) > 12 || dateDecomposee.mois === "00") {
        errorFormatMessage = "Le mois est incorrect";
      }
    }
    if(dateDecomposee.annee && dateDecomposee.annee.length != 4) {
      errorFormatMessage = "L'année doit être au format AAAA";
    }
    const annee = new Date().getFullYear();
    if(parseInt(dateDecomposee.annee) > annee) {
      errorFormatMessage = "L'année ne peut pas être supérieure à l'année en cours";
    }
    return errorFormatMessage;
  }

  isDateDecomposeeSaisieValide(dateDecomposee: DateDecomposee): boolean {
    let isDateDecomposeeSaisieValide = false;
    if(!dateDecomposee.messageErreurFormat
      && dateDecomposee.jour
      && dateDecomposee.mois
      && dateDecomposee.annee) {
        isDateDecomposeeSaisieValide = true;
    }
    return isDateDecomposeeSaisieValide;
  }

  getDateDecomposeeFromDate(dateADecompose: Date): DateDecomposee {
    const dateDecomposee = new DateDecomposee();
    if(dateADecompose) {
      let dateADecomposeDate = new Date(dateADecompose);
      const jour = dateADecomposeDate.getDate();
      const mois = dateADecomposeDate.getMonth() + 1;
      dateDecomposee.jour = this.addZeroToNumber(jour);
      dateDecomposee.mois = this.addZeroToNumber(mois);
      dateDecomposee.annee = dateADecomposeDate.getFullYear().toString();
    } else {
      dateDecomposee.mois = null;
    }
    return dateDecomposee;
  }

  getDateFromDateDecomposee(dateADecompose: DateDecomposee): Date {
    const dateFormat = new Date(
      parseInt(dateADecompose.annee),
      parseInt(dateADecompose.mois) - 1,
      parseInt(dateADecompose.jour));
    return dateFormat;
  }

  private addZeroToNumber(numberToAddZero: number): string {
    if(numberToAddZero < 10) {
      return '0' + numberToAddZero.toString();
    }
    return numberToAddZero.toString();
  }

  private isJourOuMoisValide(valueJourOuMois: string): boolean {
    return valueJourOuMois.length === 2 && valueJourOuMois !== "00"
  }
}