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
    return demandeurEmploiConnecte.informationsPersonnelles.hasRevenusImmobilier === true;
  }

  public isMicroEntrepreneur(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.informationsPersonnelles.isMicroEntrepreneur === true;
  }

  public hasMicroEntreprise(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return this.isMicroEntrepreneur() && demandeurEmploiConnecte.informationsPersonnelles.microEntreprise != null;
  }

  public isBeneficiaireACRE(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.informationsPersonnelles.isBeneficiaireACRE === true && demandeurEmploiConnecte.informationsPersonnelles.microEntreprise.dateRepriseCreationEntreprise != null;
  }
}