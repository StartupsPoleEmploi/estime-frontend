import { Injectable } from '@angular/core';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { CodeDepartementUtile } from '@app/core/services/utile/code-departement-utile.service';
@Injectable({ providedIn: 'root' })
export class DeConnecteInfosPersonnellesService {

  constructor(
    private deConnecteService: DeConnecteService,
    private codeDepartementUtile: CodeDepartementUtile
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

  public isDesDom(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    const codeDepartement = this.codeDepartementUtile.getCodeDepartement(demandeurEmploiConnecte.informationsPersonnelles.codePostal);
    console.log(codeDepartement);
    return codeDepartement.length == 3;
  }
}