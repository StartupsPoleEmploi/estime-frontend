import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvantDeCommencerSimulationComponent } from "@app/protected/avant-de-commencer-simulation/avant-de-commencer-simulation.component";


const routes: Routes = [
  {
    path: '',
    component: AvantDeCommencerSimulationComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AvantDeCommencerSimulationRoutingModule { }
