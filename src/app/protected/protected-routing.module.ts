import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvantDeCommencerSimulationComponent } from "@app/protected/avant-de-commencer-simulation/avant-de-commencer-simulation.component";
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { MesInformationsIdentiteComponent } from '@app/protected/mes-informations-identite/mes-informations-identite.component';
import { MonFuturTravailComponent } from './mon-futur-travail/mon-futur-travail.component';
import { MaSituationFamilialeComponent } from './ma-situation-familiale/ma-situation-familiale.component';
import { MesRessourcesFinancieresComponent } from './mes-ressources-financieres/mes-ressources-financieres.component';
import { ResultatMaSimulationComponent } from './resultat-ma-simulation/resultat-ma-simulation.component';
import { RessourcesFinancieresConjointComponent } from './ressources-financieres-conjoint/ressources-financieres-conjoint.component';



const routes: Routes = [
  {path: RoutesEnum.AVANT_COMMENCER_SIMULATION, component: AvantDeCommencerSimulationComponent },
  {path: RoutesEnum.MA_SITUATION_FAMILIALE, component: MaSituationFamilialeComponent },
  {path: RoutesEnum.MES_INFORMATIONS_IDENTITE, component: MesInformationsIdentiteComponent },
  {path: RoutesEnum.MES_RESSOURCES_FINANCIERES, component: MesRessourcesFinancieresComponent },
  {path: RoutesEnum.MON_FUTUR_DE_TRAVAIL, component: MonFuturTravailComponent },
  {path: RoutesEnum.RESSOURCES_FINANCIERES_CONJOINT, component: RessourcesFinancieresConjointComponent },
  {path: RoutesEnum.RESULAT_MA_SIMULATION, component: ResultatMaSimulationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
