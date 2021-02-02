import { Injectable } from '@angular/core';
import { DateDecomposee } from "@models/date-decomposee";
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class DateUtileService {

  mois = [
    { label: "Janvier", labelCourt: "Janv.", value: 1 },
    { label: "Février", labelCourt: "Fév.", value: 2 },
    { label: "Mars", labelCourt: "Mars", value: 3 },
    { label: "Avril", labelCourt: "Avril", value: 4 },
    { label: "Mai", labelCourt: "Mai", value: 5 },
    { label: "Juin", labelCourt: "Juin", value: 6 },
    { label: "Juillet", labelCourt: "Juil", value: 7 },
    { label: "Août", labelCourt: "Août", value: 8 },
    { label: "Septembre", labelCourt: "Sept", value: 9 },
    { label: "Octobre", labelCourt: "Oct", value: 10 },
    { label: "Novembre", labelCourt: "Nov", value: 11 },
    { label: "Décembre", labelCourt: "Déc", value: 12 },
  ];

  public isBissextile(annee: number): boolean {
    return (annee % 100 === 0) ? (annee % 400 === 0) : (annee % 4 === 0);
  }

  public getNombreJoursMois(mois: number, annee: number): number {
    return new Date(annee, mois, 0).getDate();
  }

  public getNombreJoursMoisPrecedent(): number {
    const dateJour = new Date();
    const month = dateJour.getMonth();
    const year = dateJour.getFullYear();
    return this.getNombreJoursMois(month, year);
  }

  public isFormatDateValide(dateDecomposee: DateDecomposee): boolean {
    return this.checkFormat(dateDecomposee) === undefined;
  }



  /**
   * Retourne un string au format "mois en lettre + année (ex : janvier 2020)"
   * @param dateToFormat
   */
  public getLibelleDateFromDate(dateToFormat: Date): string {
    const month = dateToFormat.getMonth() + 1;
    const year = dateToFormat.getFullYear();
    const moisLabel = this.getLibelleMoisByMoisNumber(month);
    return `${moisLabel} ${year}`;
  }

  /**
   * Retourne un string au format "mois en lettre + année (ex : janvier 2020)"
   * @param dateSimulation
   */
  public getLibelleDateStringFormat(dateSimulation: string): string {
    const dateSimulationSplit = dateSimulation.split('-');
    const moisLabel = this.getLibelleMoisByMoisNumber(parseInt(dateSimulationSplit[1]));
    return `${moisLabel} ${dateSimulationSplit[0]}`;
  }

  /**
   * Retourne un string au format "mois en lettre courte + année (ex : jan. 2020)"
   * @param dateSimulation
   */
  public getLibelleDateStringFormatCourt(dateSimulation: string): string {
    const dateSimulationSplit = dateSimulation.split('-');
    const moisLabel = this.getLibelleCourtMoisByMoisNumber(parseInt(dateSimulationSplit[1]));
    return `${moisLabel} ${dateSimulationSplit[0]}`;
  }

  /**
   * transforme YYYY-MM-DD en JJ/MM/YYYY
   * @param date
   */
  public getDateStringFormat(date: string): string {
    const dateSimulationSplit = date.split('-');
    return dateSimulationSplit[2] + '/' + dateSimulationSplit[1] + '/' + dateSimulationSplit[0];
  }

  public checkFormat(dateDecomposee: DateDecomposee): string {
    let errorFormatMessage = undefined;
    const nbJourMois = this.getNombreJoursMois(parseInt(dateDecomposee.mois), parseInt(dateDecomposee.annee));
    if (dateDecomposee.jour) {
      if (parseInt(dateDecomposee.jour) > nbJourMois) {
        errorFormatMessage = "Le jour doit être inférieur ou égal à " + nbJourMois;
      }
      if (dateDecomposee.jour.length != 2) {
        errorFormatMessage = "Le jour doit être au format JJ";
      }
      if (dateDecomposee.jour === "00") {
        errorFormatMessage = "Le jour est incorrect";
      }
    }
    if (dateDecomposee.mois) {
      if (dateDecomposee.mois.length != 2) {
        errorFormatMessage = "Le mois doit être au format MM";
      }
      if (parseInt(dateDecomposee.mois) > 12 || dateDecomposee.mois === "00") {
        errorFormatMessage = "Le mois est incorrect";
      }
    }
    if (dateDecomposee.annee && dateDecomposee.annee.length != 4) {
      errorFormatMessage = "L'année doit être au format AAAA";
    }
    const annee = new Date().getFullYear();
    if (parseInt(dateDecomposee.annee) > annee) {
      errorFormatMessage = "L'année ne peut pas être supérieure à l'année en cours";
    }
    return errorFormatMessage;
  }

  public isDateDecomposeeSaisieValide(dateDecomposee: DateDecomposee): boolean {
    let isDateDecomposeeSaisieValide = false;
    if (!dateDecomposee.messageErreurFormat
      && dateDecomposee.jour
      && dateDecomposee.mois
      && dateDecomposee.annee) {
      isDateDecomposeeSaisieValide = true;
    }
    return isDateDecomposeeSaisieValide;
  }

  public getDateDecomposeeFromDate(dateADecompose: Date): DateDecomposee {
    const dateDecomposee = new DateDecomposee();
    if (dateADecompose) {
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

  public getDateDecomposeeFromStringDate(dateADecompose: string): DateDecomposee {
    const dateDecomposee = new DateDecomposee();
    if (dateADecompose) {
      const dateADecomposeTab = dateADecompose.split("-");
      dateDecomposee.jour = dateADecomposeTab[2];
      dateDecomposee.mois = dateADecomposeTab[1];
      dateDecomposee.annee = dateADecomposeTab[0];
    } else {
      dateDecomposee.mois = null;
    }
    return dateDecomposee;
  }

  public getStringDateFromDateDecomposee(dateADecompose: DateDecomposee): string {
    return `${dateADecompose.annee}-${dateADecompose.mois}-${dateADecompose.jour}`;
  }

  public getDateFromDateDecomposee(dateADecompose: DateDecomposee): Date {
    const dateFormat = new Date(
      parseInt(dateADecompose.annee),
      parseInt(dateADecompose.mois) - 1,
      parseInt(dateADecompose.jour));
    return dateFormat;
  }

  public enleverMoisToDate(dateOrigine: Date, nbrMois: number): Date {
    const m = moment(dateOrigine);
    return m.subtract(nbrMois, 'M').toDate();
  }

  private addZeroToNumber(numberToAddZero: number): string {
    if (numberToAddZero < 10) {
      return '0' + numberToAddZero.toString();
    }
    return numberToAddZero.toString();
  }

  private isJourOuMoisValide(valueJourOuMois: string): boolean {
    return valueJourOuMois.length === 2 && valueJourOuMois !== "00"
  }

  private getLibelleCourtMoisByMoisNumber(moisNumber: number): string {
    let moisLabel = '';
    this.mois.forEach(mois => {
      if (moisNumber === mois.value) {
        moisLabel = mois.labelCourt;
      }
    });
    return moisLabel;
  }

  private getLibelleMoisByMoisNumber(moisNumber: number): string {
    let moisLabel = '';
    this.mois.forEach(mois => {
      if (moisNumber === mois.value) {
        moisLabel = mois.label;
      }
    });
    return moisLabel;
  }

  private getStringDateFromDate(date: Date) {
    return date.toString();
  }

  private getDateMoisPrecedent(moisVoulu : number) {
    const date : Date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth()- moisVoulu)
    return this.getStringDateFromDateDecomposee(this.getDateDecomposeeFromDate(date));

  }

  // Fonction qui permet de retourner le libellé d'un mois précédent en particulier : getLibelleMoisPrecedent(1) pour le mois n-1, getLibelleMoisPrecedent(2) pour n moins 2... etc
  public getLibelleMoisPrecedent(moisVoulu : number = 0) {
    return this.getLibelleDateStringFormat(this.getDateMoisPrecedent(moisVoulu));
  }
}