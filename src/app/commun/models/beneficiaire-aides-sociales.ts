export class BeneficiaireAidesSociales {
  beneficiaireAAH: boolean;
  beneficiaireARE: boolean;
  beneficiaireASS: boolean;
  beneficiaireRSA: boolean;

  constructor(
    beneficiaireAAH: boolean,
    beneficiaireARE: boolean,
    beneficiaireASS: boolean,
    beneficiaireRSA: boolean,
  ) {
    this.beneficiaireAAH = beneficiaireAAH;
    this.beneficiaireARE = beneficiaireARE;
    this.beneficiaireASS = beneficiaireASS;
    this.beneficiaireRSA = beneficiaireRSA;
  }
}