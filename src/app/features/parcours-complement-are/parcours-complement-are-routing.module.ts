import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageTitleEnum } from '@app/commun/enumerations/page-title.enum';
import { EnableParcoursComplementAREGuard } from '@app/commun/guard/enable-parcours-complement-are.guard';
import { RoutesEnum } from '@enumerations/routes.enum';
import { MaSituationComponent } from './1.ma-situation/ma-situation.component';
import { ActiviteRepriseComponent } from './2.activite-reprise/activite-reprise.component';
import { ResultatSimulationComponent } from './3.resultat-simulation/resultat-simulation.component';


const routes: Routes = [
  {
    path: "",
    component: MaSituationComponent,
    canActivate: [EnableParcoursComplementAREGuard],
    title: `${PageTitleEnum.SITUATION} ${PageTitleEnum.SUFFIX}`
  },
  {
    path: RoutesEnum.SITUATION,
    component: MaSituationComponent,
    canActivate: [EnableParcoursComplementAREGuard],
    title: `${PageTitleEnum.SITUATION_PARCOURS_COMPLEMENT_ARE} ${PageTitleEnum.SUFFIX}`
  },
  {
    path: RoutesEnum.ACTIVITE_REPRISE,
    component: ActiviteRepriseComponent,
    canActivate: [EnableParcoursComplementAREGuard],
    title: `${PageTitleEnum.ACTIVITE_REPRISE_PARCOURS_COMPLEMENT_ARE} ${PageTitleEnum.SUFFIX}`
  },
  {
    path: RoutesEnum.RESULTAT_SIMULATION,
    component: ResultatSimulationComponent,
    canActivate: [EnableParcoursComplementAREGuard],
    title: `${PageTitleEnum.RESULTAT_SIMULATION_PARCOURS_COMPLEMENT_ARE} ${PageTitleEnum.SUFFIX}`
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ParcoursComplementAreRoutingModule { }
