import { Injectable } from '@angular/core';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { CodeDepartementUtileService } from '../utile/code-departement-utile.service';

@Injectable({ providedIn: 'root' })
export class DeConnecteInfosPersonnellesService {

  constructor(
    private codeDepartementUtileService: CodeDepartementUtileService,
    private deConnecteService: DeConnecteService
  ) {

  }

  public hasRevenusImmobilier(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.informationsPersonnelles.hasRevenusImmobilier === true
  }

  public isTravailleurIndependant(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.informationsPersonnelles.travailleurIndependant === true
  }

  public isMicroEntrepreneur(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.informationsPersonnelles.microEntrepreneur === true
  }
}