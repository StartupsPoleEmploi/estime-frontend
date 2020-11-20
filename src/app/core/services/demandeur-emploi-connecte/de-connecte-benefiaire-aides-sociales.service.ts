import { Injectable } from '@angular/core';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';

@Injectable({ providedIn: 'root' })
export class DeConnecteBenefiaireAidesSocialesService {

  constructor(
    private deConnecteService: DeConnecteService
  ) {

  }

  public isBeneficiaireAAH(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.beneficiaireAidesSociales.beneficiaireAAH;
  }

}