export class BeneficiaireAidesSociales {
  beneficiaireAAH: boolean;
  beneficiaireARE: boolean;
  beneficiaireASS: boolean;
  beneficiaireRSA: boolean;
  beneficiairePensionInvalidite : boolean;

  constructor(
    beneficiaireAAH: boolean,
    beneficiaireARE: boolean,
    beneficiaireASS: boolean,
    beneficiaireRSA: boolean,
    beneficiairePensionInvalidite : boolean
  ) {
    this.beneficiaireAAH = beneficiaireAAH;
    this.beneficiaireARE = beneficiaireARE;
    this.beneficiaireASS = beneficiaireASS;
    this.beneficiaireRSA = beneficiaireRSA;
    this.beneficiairePensionInvalidite = beneficiairePensionInvalidite;
  }
}