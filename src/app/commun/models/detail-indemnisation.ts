export class DetailIndemnisation {

  beneficiairePrestationSolidarite: boolean;
  beneficiaireAssuranceChomage: boolean;
  indemnisationJournaliereNet: number;
  dureeReliquat: number;
  dateReliquat: Date;
  codeIndemnisation: string;
  beneficiaireRSA: boolean;
  beneficiaireAAH: boolean;

  constructor(
    beneficiairePrestationSolidarite: boolean,
    beneficiaireAssuranceChomage: boolean,
    indemnisationJournaliereNet: number,
    dureeReliquat: number,
    dateReliquat: Date,
    codeIndemnisation: string,
    beneficiaireRSA: boolean,
    beneficiaireAAH: boolean
  ) {
    this.beneficiairePrestationSolidarite = beneficiairePrestationSolidarite;
    this.beneficiaireAssuranceChomage = beneficiaireAssuranceChomage;
    this.indemnisationJournaliereNet = indemnisationJournaliereNet;
    this.dureeReliquat = dureeReliquat;
    this.dateReliquat = dateReliquat;
    this.codeIndemnisation = codeIndemnisation;
    this.beneficiaireRSA = beneficiaireRSA;
    this.beneficiaireAAH = beneficiaireAAH;
  }
}