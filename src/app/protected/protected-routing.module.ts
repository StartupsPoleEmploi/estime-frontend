import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsLoggedInGuard } from "@app/commun/guards/is-logged-in.guard";
import { AvantDeCommencerSimulationComponent } from "@app/protected/avant-de-commencer-simulation/avant-de-commencer-simulation.component";
import { RoutesEnum } from '@enumerations/routes.enum';
import { ContratTravailComponent } from './etapes-simulation/1.contrat-travail/contrat-travail.component';
import { MaSituationComponent } from './etapes-simulation/2.ma-situation/ma-situation.component';
import { MesPersonnesAChargeComponent } from './etapes-simulation/3.mes-personnes-a-charge/mes-personnes-a-charge.component';
import { RessourcesActuellesComponent } from './etapes-simulation/4.ressources-actuelles/ressources-actuelles.component';
import { EtapesSimulationComponent } from './etapes-simulation/etapes-simulation.component';

const routes: Routes = [
  {path: RoutesEnum.AVANT_COMMENCER_SIMULATION, component: AvantDeCommencerSimulationComponent, canActivate: [IsLoggedInGuard]},
  {
    path: RoutesEnum.ETAPES_SIMULATION,
    component: EtapesSimulationComponent,
    canActivate: [IsLoggedInGuard],
    children: [
      {
        path: RoutesEnum.CONTRAT_TRAVAIL,
        component: ContratTravailComponent,
        canActivate: [IsLoggedInGuard]
      },
      {
        path: RoutesEnum.MA_SITUATION,
        component: MaSituationComponent,
        canActivate: [IsLoggedInGuard]
      },
      {
        path: RoutesEnum.MES_PERSONNES_A_CHARGE,
        component: MesPersonnesAChargeComponent,
        canActivate: [IsLoggedInGuard]
      },
      {
        path: RoutesEnum.RESSOURCES_ACTUELLES,
        component: RessourcesActuellesComponent,
        canActivate: [IsLoggedInGuard]
      },
      {
        path: RoutesEnum.RESULTAT_SIMULATION,
        loadChildren: () => 
          import('./etapes-simulation/5.resultat-simulation/resultat-simulation.module')
            .then(m => m.ResultatSimulationModule),
        canActivate: [IsLoggedInGuard]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
