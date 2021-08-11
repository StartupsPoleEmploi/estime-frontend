import { Injectable } from '@angular/core';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';

@Injectable({ providedIn: 'root' })
export class DeConnecteBenefiaireAidesService {

  constructor(
    private deConnecteService: DeConnecteService
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

  public isBeneficiairePensionInvalidite(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.beneficiaireAides.beneficiairePensionInvalidite;
  }

  public isBeneficiaireRSA(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.beneficiaireAides.beneficiaireRSA;
  }

}