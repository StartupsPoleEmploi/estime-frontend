import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { IsLoggedInGuard } from "@app/commun/guards/is-logged-in.guard";
import { AvantDeCommencerSimulationComponent } from "@app/protected/avant-de-commencer-simulation/avant-de-commencer-simulation.component";
import { MesInformationsPersonnellesComponent } from '@app/protected/mes-informations-personnelles/mes-informations-personnelles.component';
import { RessourcesFinancieresComponent } from "@app/protected/ressources-financieres/ressources-financieres.component";
import { RoutesEnum } from '@enumerations/routes.enum';
import { MesPersonnesAChargeComponent } from './mes-personnes-a-charge/mes-personnes-a-charge.component';
import { MonFuturTravailComponent } from './mon-futur-travail/mon-futur-travail.component';
import { ResultatMaSimulationComponent } from './resultat-ma-simulation/resultat-ma-simulation.component';


const routes: Routes = [
  {path: RoutesEnum.AVANT_COMMENCER_SIMULATION, component: AvantDeCommencerSimulationComponent, canActivate: [IsLoggedInGuard]},
  {path: RoutesEnum.MES_INFORMATIONS_PERSONNELLES, component: MesInformationsPersonnellesComponent, canActivate: [IsLoggedInGuard] },
  {path: RoutesEnum.MES_PERSONNES_A_CHARGE, component: MesPersonnesAChargeComponent, canActivate: [IsLoggedInGuard]},
  {path: RoutesEnum.MON_FUTUR_DE_TRAVAIL, component: MonFuturTravailComponent, canActivate: [IsLoggedInGuard]},
  {path: RoutesEnum.RESSOURCES_FINANCIERES, component: RessourcesFinancieresComponent, canActivate: [IsLoggedInGuard]},
  {path: RoutesEnum.RESULAT_MA_SIMULATION, component: ResultatMaSimulationComponent, canActivate: [IsLoggedInGuard]},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
