import { Injectable } from '@angular/core';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';

@Injectable({ providedIn: 'root' })
export class DeConnecteInfosPersonnellesService {

  constructor(
    private deConnecteService: DeConnecteService
  ) {

  }

  public hasRevenusImmobilier(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.informationsPersonnelles.hasRevenusImmobilier === true
  }

  public createurEntreprise(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.informationsPersonnelles.createurEntreprise === true
  }
}