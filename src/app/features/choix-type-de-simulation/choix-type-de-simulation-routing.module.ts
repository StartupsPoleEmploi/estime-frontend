import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageTitleEnum } from '@app/commun/enumerations/page-title.enum';
import { ChoixTypeDeSimulationComponent } from './choix-type-de-simulation.component';


const routes: Routes = [
  {
    path: '',
    component: ChoixTypeDeSimulationComponent,
    title: `${PageTitleEnum.CHOIX_SIMULATION} ${PageTitleEnum.SUFFIX}`

  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ChoixTypeDeSimulationRoutingModule { }
