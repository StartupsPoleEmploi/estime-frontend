import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResultatSimulationComponent } from './resultat-simulation.component';

const routes: Routes = [
  {
    path: '',
    component: ResultatSimulationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultatSimulationRoutingModule { }