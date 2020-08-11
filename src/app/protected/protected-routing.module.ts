import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecapitulatifInfoDeComponent } from './recapitulatif-info-de/recapitulatif-info-de.component';




const routes: Routes = [
  {path: 'recapitulatif-infos-de', component: RecapitulatifInfoDeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
