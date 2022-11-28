import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnableParcoursComplementAREGuard } from '@app/commun/guard/enable-parcours-complement-are.guard';
import { RoutesEnum } from '@enumerations/routes.enum';
import { MaSituationComponent } from './1.ma-situation/ma-situation.component';
import { ActiviteRepriseComponent } from './2.activite-reprise/activite-reprise.component';
import { ResultatSimulationComponent } from './3.resultat-simulation/resultat-simulation.component';


const routes: Routes = [
  {
    path: RoutesEnum.MA_SITUATION,
    component: MaSituationComponent,
    canActivate: [EnableParcoursComplementAREGuard]
  },
  {
    path: RoutesEnum.ACTIVITE_REPRISE,
    component: ActiviteRepriseComponent,
    canActivate: [EnableParcoursComplementAREGuard]
  },
  {
    path: RoutesEnum.RESULTAT_SIMULATION,
    component: ResultatSimulationComponent,
    canActivate: [EnableParcoursComplementAREGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ParcoursComplementAreRoutingModule { }
