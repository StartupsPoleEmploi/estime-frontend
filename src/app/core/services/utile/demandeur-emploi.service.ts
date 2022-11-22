

import { Injectable } from '@angular/core';
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { InformationsPersonnelles } from '@app/commun/models/informations-personnelles';
import { RessourcesFinancieresAvantSimulation } from '@app/commun/models/ressources-financieres-avant-simulation';
import { SituationFamiliale } from '@app/commun/models/situation-familiale';
import { InformationsPersonnellesService } from './informations-personnelles.service';
import { SituationFamilialeUtileService } from './situation-familiale.service';

@Injectable({ providedIn: 'root' })
export class DemandeurEmploiService {

  constructor(
    private informationsPersonnellesService: InformationsPersonnellesService,
    private situationFamilialeUtileService: SituationFamilialeUtileService
  ) { }

  public loadDataBeneficiaireAides(demandeurEmploi: DemandeurEmploi): BeneficiaireAides {
    if (demandeurEmploi.beneficiaireAides) {
      return demandeurEmploi.beneficiaireAides;
    }
    return new BeneficiaireAides();
  }

  public loadDataInformationsPersonnelles(demandeurEmploi: DemandeurEmploi): InformationsPersonnelles {
    if (demandeurEmploi.informationsPersonnelles) {
      return demandeurEmploi.informationsPersonnelles;
    }
    return this.informationsPersonnellesService.creerInformationsPersonnelles();
  }

  public loadDataSituationFamiliale(demandeurEmploi: DemandeurEmploi): SituationFamiliale {
    if (demandeurEmploi.situationFamiliale) {
      return demandeurEmploi.situationFamiliale;
    }
    return this.situationFamilialeUtileService.creerSituationFamiliale();
  }

  public loadDataRessourcesFinancieresAvantSimulation(demandeurEmploi: DemandeurEmploi): RessourcesFinancieresAvantSimulation {
    if (demandeurEmploi.ressourcesFinancieresAvantSimulation) {
      return demandeurEmploi.ressourcesFinancieresAvantSimulation;
    }
  }

}