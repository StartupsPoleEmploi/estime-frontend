import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesEnum } from '@enumerations/routes.enum';
import { ContratTravailComponent } from './1.contrat-travail/contrat-travail.component';
import { MaSituationComponent } from './2.ma-situation/ma-situation.component';
import { MesPersonnesAChargeComponent } from './3.mes-personnes-a-charge/mes-personnes-a-charge.component';
import { RessourcesActuellesComponent } from './4.ressources-actuelles/ressources-actuelles.component';
import { ResultatSimulationComponent } from './5.resultat-simulation/resultat-simulation.component';


const routes: Routes = [
  {
    path: RoutesEnum.CONTRAT_TRAVAIL,
    component: ContratTravailComponent
  },
  {
    path: RoutesEnum.MA_SITUATION,
    component: MaSituationComponent
  },
  {
    path: RoutesEnum.MES_PERSONNES_A_CHARGE,
    component: MesPersonnesAChargeComponent
  },
  {
    path: RoutesEnum.RESSOURCES_ACTUELLES,
    component: RessourcesActuellesComponent
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
export class EtapesSimulationRoutingModule { }
