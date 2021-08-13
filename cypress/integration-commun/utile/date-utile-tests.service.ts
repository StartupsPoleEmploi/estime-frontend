import { DateDecomposee } from "../models/date-decomposee";

export class DateUtileTests {

  public getDateNaissanceFromAge(age: number): DateDecomposee {
    const dateDecomposee = new DateDecomposee();

    const dateJour = new Date();
    const month = dateJour.getMonth() - 1;
    const year = dateJour.getFullYear() - age;
    const dateNaissance = new Date(year, month, 0);

    dateDecomposee.jour = this.getJourOuMoisFormate(dateNaissance.getDay().toString());
    dateDecomposee.mois = this.getJourOuMoisFormate(dateNaissance.getMonth().toString());
    dateDecomposee.annee = dateNaissance.getFullYear().toString();

    return dateDecomposee;
  }

  private getJourOuMoisFormate(jourOuMois: string): string {
    let jourOuMoisFormate = jourOuMois;
    if(jourOuMois.length === 1) {
      jourOuMoisFormate =  `0${jourOuMois}`;
    }
    return jourOuMoisFormate;
  }

}