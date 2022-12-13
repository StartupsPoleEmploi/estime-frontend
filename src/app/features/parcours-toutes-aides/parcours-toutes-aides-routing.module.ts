import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageTitleEnum } from '@app/commun/enumerations/page-title.enum';
import { RoutesEnum } from '@enumerations/routes.enum';
import { ContratTravailComponent } from './1.contrat-travail/contrat-travail.component';
import { MaSituationComponent } from './2.ma-situation/ma-situation.component';
import { MesPersonnesAChargeComponent } from './3.mes-personnes-a-charge/mes-personnes-a-charge.component';
import { RessourcesActuellesComponent } from './4.ressources-actuelles/ressources-actuelles.component';
import { ResultatSimulationComponent } from './5.resultat-simulation/resultat-simulation.component';
import { AvantDeCommencerSimulationComponent } from './avant-de-commencer-simulation/avant-de-commencer-simulation.component';


const routes: Routes = [
  {
    path: RoutesEnum.AVANT_COMMENCER_SIMULATION,
    component: AvantDeCommencerSimulationComponent,
    title: `${PageTitleEnum.AVANT_COMMENCER_SIMULATION} ${PageTitleEnum.SUFFIX}`
  },
  {
    path: RoutesEnum.CONTRAT_TRAVAIL,
    component: ContratTravailComponent,
    title: `${PageTitleEnum.CONTRAT_TRAVAIL} ${PageTitleEnum.SUFFIX}`
  },
  {
    path: RoutesEnum.SITUATION,
    component: MaSituationComponent,
    title: `${PageTitleEnum.SITUATION} ${PageTitleEnum.SUFFIX}`
  },
  {
    path: RoutesEnum.PERSONNES_A_CHARGE,
    component: MesPersonnesAChargeComponent,
    title: `${PageTitleEnum.PERSONNES_A_CHARGE} ${PageTitleEnum.SUFFIX}`
  },
  {
    path: RoutesEnum.RESSOURCES_ACTUELLES,
    component: RessourcesActuellesComponent,
    title: `${PageTitleEnum.RESSOURCES_ACTUELLES} ${PageTitleEnum.SUFFIX}`
  },
  {
    path: RoutesEnum.RESULTAT_SIMULATION,
    component: ResultatSimulationComponent,
    title: `${PageTitleEnum.RESULTAT_SIMULATION} ${PageTitleEnum.SUFFIX}`
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ParcoursToutesAidesRoutingModule { }
