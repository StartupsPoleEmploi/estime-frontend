import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { NotFoundComponent } from './commun/components/not-found/not-found.component';
import { SigninRedirectCallbackComponent } from './commun/components/signin-redirect-callback/signin-redirect-callback.component';
import { StatsComponent } from './commun/components/stats/stats.component';
import { RoutesEnum } from './commun/enumerations/routes.enum';
import { EnableParcoursComplementAREGuard } from './commun/guard/enable-parcours-complement-are.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/choix-type-de-simulation/choix-type-de-simulation.module').then(m => m.ChoixTypeDeSimulationModule)
  },
  {
    path: RoutesEnum.PARCOURS_TOUTES_AIDES,
    loadChildren: () => import('./features/parcours-toutes-aides/parcours-toutes-aides.module').then(m => m.ParcoursToutesAidesModule)
  },
  {
    path: RoutesEnum.PARCOURS_COMPLEMENT_ARE,
    loadChildren: () => import('./features/parcours-complement-are/parcours-complement-are.module').then(m => m.ParcoursComplementAreModule),
    canActivate: [EnableParcoursComplementAREGuard]
  },
  { path: RoutesEnum.SIGNIN_CALLBACK, component: SigninRedirectCallbackComponent },
  { path: RoutesEnum.STATS, component: StatsComponent },
  { path: RoutesEnum.NOT_FOUND, component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
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
