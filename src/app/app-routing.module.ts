import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { RoutesEnum } from './commun/enumerations/routes.enum';
import { EnableParcoursComplementAREGuard } from './commun/guard/enable-parcours-complement-are.guard';

const routes: Routes = [
  {
    path: RoutesEnum.CHOIX_TYPE_SIMULATION,
    loadChildren: () => import('./protected/choix-type-de-simulation/choix-type-de-simulation.module').then(m => m.ChoixTypeDeSimulationModule)
  },
  {
    path: RoutesEnum.PARCOURS_TOUTES_AIDES,
    loadChildren: () => import('./protected/parcours-toutes-aides/parcours-toutes-aides.module').then(m => m.ParcoursToutesAidesModule)
  },
  {
    path: RoutesEnum.PARCOURS_COMPLEMENT_ARE,
    loadChildren: () => import('./protected/parcours-complement-are/parcours-complement-are.module').then(m => m.ParcoursComplementAreModule),
    canActivate: [EnableParcoursComplementAREGuard]
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
