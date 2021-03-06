import { Injectable } from '@angular/core';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';

@Injectable({ providedIn: 'root' })
export class DeConnecteBenefiaireAidesSocialesService {

  constructor(
    private deConnecteService: DeConnecteService
  ) {

  }

  public isBeneficiaireASS(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.beneficiaireAidesSociales.beneficiaireASS;
  }

  public isBeneficiaireAAH(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.beneficiaireAidesSociales.beneficiaireAAH;
  }

  public isBeneficiairePensionInvalidite(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.beneficiaireAidesSociales.beneficiairePensionInvalidite;
  }

  public isBeneficiaireRSA(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.beneficiaireAidesSociales.beneficiaireRSA;
  }

}