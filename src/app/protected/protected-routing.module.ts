import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvantDeCommencerSimulationComponent } from "@app/protected/avant-de-commencer-simulation/avant-de-commencer-simulation.component";
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { MesInformationsPersonnellesComponent } from '@app/protected/mes-informations-personnelles/mes-informations-personnelles.component';
import { MonFuturTravailComponent } from './mon-futur-travail/mon-futur-travail.component';
import { MesRessourcesFinancieresComponent } from './mes-ressources-financieres/mes-ressources-financieres.component';
import { ResultatMaSimulationComponent } from './resultat-ma-simulation/resultat-ma-simulation.component';
import { RessourcesFinancieresConjointComponent } from './ressources-financieres-conjoint/ressources-financieres-conjoint.component';
import { MesPersonnesAChargeComponent } from './mes-personnes-a-charge/mes-personnes-a-charge.component';
import { IsLoggedInGuard } from "@app/commun/guards/is-logged-in.guard";


const routes: Routes = [
  {path: RoutesEnum.AVANT_COMMENCER_SIMULATION, component: AvantDeCommencerSimulationComponent, canActivate: [IsLoggedInGuard]},
  {path: RoutesEnum.MES_INFORMATIONS_PERSONNELLES, component: MesInformationsPersonnellesComponent, canActivate: [IsLoggedInGuard] },
  {path: RoutesEnum.MES_PERSONNES_A_CHARGE, component: MesPersonnesAChargeComponent, canActivate: [IsLoggedInGuard]},
  {path: RoutesEnum.MES_RESSOURCES_FINANCIERES, component: MesRessourcesFinancieresComponent, canActivate: [IsLoggedInGuard]},
  {path: RoutesEnum.MON_FUTUR_DE_TRAVAIL, component: MonFuturTravailComponent, canActivate: [IsLoggedInGuard]},
  {path: RoutesEnum.RESSOURCES_FINANCIERES_CONJOINT, component: RessourcesFinancieresConjointComponent, canActivate: [IsLoggedInGuard]},
  {path: RoutesEnum.RESULAT_MA_SIMULATION, component: ResultatMaSimulationComponent, canActivate: [IsLoggedInGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
