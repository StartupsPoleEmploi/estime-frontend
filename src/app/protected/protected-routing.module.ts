import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvantDeCommencerSimulationComponent } from "./avant-de-commencer-simulation/avant-de-commencer-simulation.component";
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';



const routes: Routes = [
  {path: RoutesEnum.AVANT_COMMENCER_SIMULATION, component: AvantDeCommencerSimulationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
