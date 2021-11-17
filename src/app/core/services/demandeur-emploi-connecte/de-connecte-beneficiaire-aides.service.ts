import { Injectable } from '@angular/core';
import { Personne } from '@app/commun/models/personne';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { DeConnecteSituationFamilialeService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-situation-familiale.service';

@Injectable({ providedIn: 'root' })
export class DeConnecteBeneficiaireAidesService {

  constructor(
    private deConnecteService: DeConnecteService,
    private deConnecteSituationFamilialeService: DeConnecteSituationFamilialeService
  ) {

  }

  public isBeneficiaireASS(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.beneficiaireAides.beneficiaireASS;
  }

  public isBeneficiaireAAH(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.beneficiaireAides.beneficiaireAAH;
  }

  public isBeneficiaireARE(): boolean {
    const demanderEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demanderEmploiConnecte.beneficiaireAides.beneficiaireARE;
  }

  public isBeneficiairePensionInvalidite(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.beneficiaireAides.beneficiairePensionInvalidite;
  }

  public isBeneficiaireRSA(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.beneficiaireAides.beneficiaireRSA;
  }

  public isDemandeurBeneficiaireRSA(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.beneficiaireAides != null && demandeurEmploiConnecte.beneficiaireAides.beneficiaireRSA;
  }

  public isConjointBeneficiaireRSA(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.situationFamiliale != null && demandeurEmploiConnecte.situationFamiliale.isEnCouple) {
      return demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAides != null && demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAides.beneficiaireRSA;
    }
    return false;
  }

  public isPersonneAChargeBeneficiaireRSA(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte()
    if (demandeurEmploiConnecte.situationFamiliale != null && demandeurEmploiConnecte.situationFamiliale.personnesACharge != null) {
      return demandeurEmploiConnecte.situationFamiliale.personnesACharge.some(
        personne => personne.beneficiaireAides != null && personne.beneficiaireAides.beneficiaireRSA
      );
    }
    return false;
  }

  public isAutrePersonneAChargeBeneficiaireRSA(personneACharge: Personne): boolean {
    let personnesACharge = this.deConnecteService.getDemandeurEmploiConnecte().situationFamiliale.personnesACharge;
    if (personnesACharge != null) {
      for (let index = 0; index < personnesACharge.length; index++) {
        if (personnesACharge[index] == personneACharge) personnesACharge.splice(index, 1);
      }
      return personnesACharge.some(
        personne => personne.beneficiaireAides != null && personne.beneficiaireAides.beneficiaireRSA
      );
    }
    return false;
  }

  public hasFoyerAutreBeneficiaireRSA(situation: string, personneACharge?: Personne): boolean {
    if (situation == "demandeur") {
      return this.isPersonneAChargeBeneficiaireRSA() || this.isConjointBeneficiaireRSA();
    } else if (situation == "conjoint") {
      return this.isDemandeurBeneficiaireRSA() || this.isPersonneAChargeBeneficiaireRSA();
    } else if (situation == "personnesACharge") {
      return this.isDemandeurBeneficiaireRSA() || this.isConjointBeneficiaireRSA() || this.isPersonneAChargeBeneficiaireRSA();
    }
  }

  public hasFoyerRSA(): boolean {
    return !this.deConnecteSituationFamilialeService.isCelibataireSansEnfant()
      && (
        this.isDemandeurBeneficiaireRSA() || this.isConjointBeneficiaireRSA() || this.isPersonneAChargeBeneficiaireRSA()
      );
  }

  public isBeneficiaireAideLogement(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.beneficiaireAides.beneficiaireAPL
      || demandeurEmploiConnecte.beneficiaireAides.beneficiaireALF
      || demandeurEmploiConnecte.beneficiaireAides.beneficiaireALS;
  }

  public isBeneficiaireAPL(): boolean {
    return this.deConnecteService.getDemandeurEmploiConnecte().beneficiaireAides.beneficiaireAPL;
  }

  public isBeneficiaireALF(): boolean {
    return this.deConnecteService.getDemandeurEmploiConnecte().beneficiaireAides.beneficiaireALF;
  }

  public isBeneficiaireALS(): boolean {
    return this.deConnecteService.getDemandeurEmploiConnecte().beneficiaireAides.beneficiaireALS;
  }

}