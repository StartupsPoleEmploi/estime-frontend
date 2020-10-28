export class BeneficiaireAidesSociales {

  beneficiairePrestationSolidarite: boolean;
  beneficiaireAssuranceChomage: boolean;
  beneficiaireRSA: boolean;
  beneficiaireAAH: boolean;

  constructor(
    beneficiairePrestationSolidarite: boolean,
    beneficiaireAssuranceChomage: boolean,
    beneficiaireRSA: boolean,
    beneficiaireAAH: boolean
  ) {
    this.beneficiairePrestationSolidarite = beneficiairePrestationSolidarite;
    this.beneficiaireAssuranceChomage = beneficiaireAssuranceChomage;
    this.beneficiaireRSA = beneficiaireRSA;
    this.beneficiaireAAH = beneficiaireAAH;
  }
}