import { Injectable } from '@angular/core';
import { InformationsPersonnelles } from '@app/commun/models/informations-personnelles';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { DateUtileService } from '../utile/date-util.service';

@Injectable({ providedIn: 'root' })
export class DeConnecteInfosPersonnellesService {

  constructor(
    private deConnecteService: DeConnecteService,
    private dateUtileService: DateUtileService
  ) { }

  public isSalarie(): boolean {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    return demandeurEmploiConnecte.informationsPersonnelles.isSalarie === true;
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

  public isDateCreationRepriseEntrepriseN(informationsPersonnelles: InformationsPersonnelles): boolean {
    if (this.hasMicroEntreprise()) {
      return this.dateUtileService.isStringDateAnneeN(informationsPersonnelles.microEntreprise.dateRepriseCreationEntreprise);
    }
  }

  public isDateCreationRepriseEntrepriseAvantNMoins1(informationsPersonnelles: InformationsPersonnelles): boolean {
    if (this.hasMicroEntreprise()) {
      return this.dateUtileService.isStringDateAnneeAvantNMoins1(informationsPersonnelles.microEntreprise.dateRepriseCreationEntreprise);
    }
  }

  public isDateCreationRepriseEntrepriseAvantNMoins2(informationsPersonnelles: InformationsPersonnelles): boolean {
    if (this.hasMicroEntreprise()) {
      return this.dateUtileService.isStringDateAnneeAvantNMoins2(informationsPersonnelles.microEntreprise.dateRepriseCreationEntreprise);
    }
  }
}