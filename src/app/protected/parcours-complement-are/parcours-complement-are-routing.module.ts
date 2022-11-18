import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesEnum } from '@enumerations/routes.enum';
import { MaSituationComponent } from './1.ma-situation/ma-situation.component';
import { ActiviteRepriseComponent } from './2.activite-reprise/activite-reprise.component';
import { ResultatSimulationComponent } from './3.resultat-simulation/resultat-simulation.component';


const routes: Routes = [
  {
    path: RoutesEnum.MA_SITUATION,
    component: MaSituationComponent
  },
  {
    path: RoutesEnum.ACTIVITE_REPRISE,
    component: ActiviteRepriseComponent
  },
  {
    path: RoutesEnum.RESULTAT_SIMULATION,
    component: ResultatSimulationComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ParcoursComplementAreRoutingModule { }
