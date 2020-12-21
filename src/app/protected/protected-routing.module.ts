import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsLoggedInGuard } from "@app/commun/guards/is-logged-in.guard";
import { AvantDeCommencerSimulationComponent } from "@app/protected/avant-de-commencer-simulation/avant-de-commencer-simulation.component";
import { RoutesEnum } from '@enumerations/routes.enum';
import { EtapesSimulationComponent } from './etapes-simulation/etapes-simulation.component';


const routes: Routes = [
  {path: RoutesEnum.AVANT_COMMENCER_SIMULATION, component: AvantDeCommencerSimulationComponent, canActivate: [IsLoggedInGuard]},
  {path: RoutesEnum.ETAPES_SIMULATION, component: EtapesSimulationComponent, canActivate: [IsLoggedInGuard]}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
