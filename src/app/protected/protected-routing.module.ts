import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvantDeCommencerSimulationComponent } from "@app/protected/avant-de-commencer-simulation/avant-de-commencer-simulation.component";
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { MonContratTravailComponent } from '@app/protected/mon-contrat-travail/mon-contrat-travail.component';



const routes: Routes = [
  {path: RoutesEnum.AVANT_COMMENCER_SIMULATION, component: AvantDeCommencerSimulationComponent },
  {path: RoutesEnum.MON_CONTRAT_DE_TRAVAIL, component: MonContratTravailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
