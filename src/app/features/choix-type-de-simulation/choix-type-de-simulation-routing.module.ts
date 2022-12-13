import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChoixTypeDeSimulationComponent } from './choix-type-de-simulation.component';


const routes: Routes = [
  {
    path: '',
    component: ChoixTypeDeSimulationComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ChoixTypeDeSimulationRoutingModule { }
