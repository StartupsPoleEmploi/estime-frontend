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

  public travailleurIndependant(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.informationsPersonnelles.travailleurIndependant === true
  }

  public microEntrepreneur(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.informationsPersonnelles.microEntrepreneur === true
  }

  public isDesDom(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    const codeDepartement = this.codeDepartementUtileService.getCodeDepartement(demandeurEmploiConnecte.informationsPersonnelles.codePostal);
    return codeDepartement.length == 3;
  }
}