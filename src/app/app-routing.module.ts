import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { RoutesEnum } from './commun/enumerations/routes.enum';
import { AvantDeCommencerSimulationModule } from './protected/avant-de-commencer-simulation/avant-de-commencer-simulation.module';
import { EtapesSimulationModule } from './protected/etapes-simulation/etapes-simulation.module';


const routes: Routes = [
  {
    path: RoutesEnum.AVANT_COMMENCER_SIMULATION,
    loadChildren: () => AvantDeCommencerSimulationModule
  },
  {
    path: RoutesEnum.ETAPES_SIMULATION,
    loadChildren: () => EtapesSimulationModule
  }
];

//permet de gérer le scroll auto => ici scrollPositionRestoration: 'enabled' positionne le scroll à top
const routerOptions: ExtraOptions = {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 0],
    relativeLinkResolution: 'legacy'
};



@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
