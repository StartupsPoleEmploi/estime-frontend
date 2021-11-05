import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsLoggedInGuard } from "@app/commun/guards/is-logged-in.guard";
import { AvantDeCommencerSimulationComponent } from "@app/protected/avant-de-commencer-simulation/avant-de-commencer-simulation.component";


const routes: Routes = [
  {
    path: '',
    component: AvantDeCommencerSimulationComponent,
    canActivate: [IsLoggedInGuard]},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AvantDeCommencerSimulationRoutingModule { }
