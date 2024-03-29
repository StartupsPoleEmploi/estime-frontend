import { DateDecomposee } from "../models/date-decomposee";
import * as moment from 'moment';

export class DateUtileTests {


  public getDateRepriseCreationEntrepriseDepuisXMois(nombreDeMoisDepuisRepriseCreationEntreprise: number): DateDecomposee {
    const dateDecomposee = new DateDecomposee();
    const m = moment(new Date());
    const dateCreationEntreprise = m.subtract(nombreDeMoisDepuisRepriseCreationEntreprise, 'M').toDate();

    dateDecomposee.jour = this.getJourOuMoisFormate(dateCreationEntreprise.getDay().toString());
    dateDecomposee.mois = this.getJourOuMoisFormate(dateCreationEntreprise.getMonth().toString());
    dateDecomposee.annee = dateCreationEntreprise.getFullYear().toString();

    return dateDecomposee;
  }

  public getDateNaissanceFromAge(age: number): DateDecomposee {
    const dateDecomposee = new DateDecomposee();

    const m = moment(new Date());
    const dateNaissance = m.subtract(age, 'year').toDate();

    dateDecomposee.jour = this.getJourOuMoisFormate(dateNaissance.getDay().toString());
    dateDecomposee.mois = this.getJourOuMoisFormate(dateNaissance.getMonth().toString());
    dateDecomposee.annee = dateNaissance.getFullYear().toString();

    return dateDecomposee;
  }

  private getJourOuMoisFormate(jourOuMois: string): string {
    let jourOuMoisFormate = jourOuMois;
    if (jourOuMois.length === 1) {
      if (jourOuMois === '0') {
        jourOuMois = '1';
      }
      jourOuMoisFormate = `0${jourOuMois}`;
    }
    return jourOuMoisFormate;
  }

}