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

  MOIS_MAXIMUM_ENFANT_POUR_BENEFECIER_PAJE = 37; // 3 ans et 1 mois

  public checkDateDecomposeAfterDateJour(dateDecomposee: DateDecomposee): void {
    dateDecomposee.isDateSuperieurDateJour = false;
    if(this.isDateValide(dateDecomposee)) {
      if(this.isDateDecomposeAfterDateJour(dateDecomposee)) {
        dateDecomposee.isDateSuperieurDateJour = true;
      }
    }

  }

  public checkFormatDateAvecInferieurDateJour(dateDecomposee: DateDecomposee): void {
    this.checkFormatDate(dateDecomposee);
    this.checkDateDecomposeAfterDateJour(dateDecomposee);
  }

  public checkFormatDate(dateDecomposee: DateDecomposee): void {
    this.checkFormatJour(dateDecomposee);
    this.checkFormatMois(dateDecomposee);
    this.checkFormatAnnee(dateDecomposee);
  }

  public  checkFormatJour(dateDecomposee: DateDecomposee): void {
    dateDecomposee.isJourInvalide = false;
    dateDecomposee.messageErreurFormatJour = undefined;
    if (dateDecomposee && dateDecomposee.jour) {
      const nbJourMois = this.getNombreJoursMois(parseInt(dateDecomposee.mois), parseInt(dateDecomposee.annee));
      if (parseInt(dateDecomposee.jour) > nbJourMois) {
        dateDecomposee.messageErreurFormatJour = "Le jour doit être inférieur ou égal à " + nbJourMois;
        dateDecomposee.isJourInvalide = true;
      }
      if (dateDecomposee.jour.length != 2) {
        dateDecomposee.messageErreurFormatJour =  "Le jour doit être au format JJ";
        dateDecomposee.isJourInvalide = true;
      }
      if (dateDecomposee.jour === "00" || parseInt(dateDecomposee.jour) > 31) {
        dateDecomposee.messageErreurFormatJour =  "Le jour est incorrect";
        dateDecomposee.isJourInvalide = true;
      }
    }
  }

  public checkFormatMois(dateDecomposee: DateDecomposee): void {
    dateDecomposee.isMoisInvalide = false;
    dateDecomposee.messageErreurFormatMois = undefined;
    if (dateDecomposee && dateDecomposee.mois) {
      if (dateDecomposee.mois.length != 2) {
        dateDecomposee.messageErreurFormatMois = "Le mois doit être au format MM";
        dateDecomposee.isMoisInvalide = true;
      }
      if (parseInt(dateDecomposee.mois) > 12 || dateDecomposee.mois === "00") {
        dateDecomposee.messageErreurFormatMois = "Le mois est incorrect";
        dateDecomposee.isMoisInvalide = true;
      }
    }
  }

  public checkFormatAnnee(dateDecomposee: DateDecomposee): void {
    dateDecomposee.isAnneeInvalide = false;
    dateDecomposee.messageErreurFormatAnnee = undefined;
    if (dateDecomposee && dateDecomposee.annee && dateDecomposee.annee.length != 4) {
      dateDecomposee.messageErreurFormatAnnee = "L'année doit être au format AAAA";
      dateDecomposee.isAnneeInvalide = true;
    }
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

  public getLibelleMoisApresDateJour(nMoisApresDateJour): string {
    const dateJour = new Date();
    const dateAvantSimulation = this.ajouterMoisToDate(dateJour, nMoisApresDateJour);
    const mois = dateAvantSimulation.getMonth() + 1;
    return this.getLibelleMoisByMoisNumber(mois);
  }

   /**
   * Permet de récupérer une date au format "mois en lettre + année (ex : janvier 2020)" avant la date du jour
   * exemple :
   * date du jour = 01/03/2021, si nMoisAvantDateJour = 2 alors dateFormatee = "janvier 2021"
   *
   * @param nMoisAvantSimulation
   */
  public getDateFormateeAvantDateJour(nMoisAvantDateJour: number): string {
    const dateJour = new Date();
    if (nMoisAvantDateJour == 0) {
        return this.getLibelleDateFromDate(dateJour).toLowerCase();
    } else {
        const dateAvantSimulation = this.enleverMoisToDate(dateJour, nMoisAvantDateJour);
        return this.getLibelleDateFromDate(dateAvantSimulation).toLowerCase();
    }
  }

  public ajouterMoisToDate(dateOrigine: Date, nbrMois: number): Date {
    const m = moment(dateOrigine);
    return m.add(nbrMois, 'M').toDate();
  }

  public enleverMoisToDate(dateOrigine: Date, nbrMois: number): Date {
    const m = moment(dateOrigine);
    return m.subtract(nbrMois, 'M').toDate();
  }

  public isBissextile(annee: number): boolean {
    return (annee % 100 === 0) ? (annee % 400 === 0) : (annee % 4 === 0);
  }

  public isDateAfterDateJour(dateToCheck: string): boolean {
    const dateDecomposeeDateJour = this.getDateDecomposeeFromDate(new Date());
    const dateDecomposeeDateJourFormat = this.getStringDateFromDateDecomposee(dateDecomposeeDateJour);
    return moment(dateToCheck).isAfter(dateDecomposeeDateJourFormat);
  }

  public isDateDecomposeAfterDateJour(dateDecomposee: DateDecomposee): boolean {
    const dateToCompareFormat = this.getStringDateFromDateDecomposee(dateDecomposee);
    const dateDecomposeeDateJour = this.getDateDecomposeeFromDate(new Date());
    const dateDecomposeeDateJourFormat = this.getStringDateFromDateDecomposee(dateDecomposeeDateJour);
    return moment(dateToCompareFormat).isAfter(dateDecomposeeDateJourFormat);
  }

  public isDateDecomposeeSaisieAvecInferieurDateJourValide(dateDecomposee: DateDecomposee): boolean {
    let isValid = true;
    if(this.isDateValide(dateDecomposee)) {
      if(this.isDateDecomposeAfterDateJour(dateDecomposee)) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    return isValid;
  }

  public isDateValide(dateDecomposee: DateDecomposee): boolean {
    return this.isJourValide(dateDecomposee)
    && this.isMoisValide(dateDecomposee)
    && this.isAnneeValide(dateDecomposee)
  }

  public isJourValide(dateDecomposee: DateDecomposee): boolean {
    let isValid = true;
    const nbJourMois = this.getNombreJoursMois(parseInt(dateDecomposee.mois), parseInt(dateDecomposee.annee));
    if (dateDecomposee.jour) {
      if (parseInt(dateDecomposee.jour) > nbJourMois || dateDecomposee.jour.length != 2 || dateDecomposee.jour === "00") {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    return isValid;
  }

  public isMoisValide(dateDecomposee: DateDecomposee): boolean {
    let isValid = true;
    if (dateDecomposee.mois) {
      if (dateDecomposee.mois.length != 2 || parseInt(dateDecomposee.mois) > 12 || dateDecomposee.mois === "00") {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    return isValid;
  }

  public isAnneeValide(dateDecomposee: DateDecomposee): boolean {
    let isValid = true;
    if (!dateDecomposee.annee || (dateDecomposee.annee && dateDecomposee.annee.length != 4)) {
      isValid = false;
    }
    return isValid;
  }

  public isDatePlusDe3AnsEt1Mois(date: Date): boolean {
    let isDatePlusDe3AnsEt1Mois = false;
    let datePlus3AnsEt1Mois = this.ajouterMoisToDate(date, this.MOIS_MAXIMUM_ENFANT_POUR_BENEFECIER_PAJE);
    return moment(datePlus3AnsEt1Mois).isSameOrAfter(Date.now());
  }

  /************ private methods ***********************/

  private addZeroToNumber(numberToAddZero: number): string {
    if (numberToAddZero < 10) {
      return '0' + numberToAddZero.toString();
    }
    return numberToAddZero.toString();
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
}