import { NgModule } from '@angular/core';
import { CommunModule } from '@app/commun/commun.module';

import { ProtectedRoutingModule } from '@app/protected/protected-routing.module';
import { AvantDeCommencerSimulationComponent } from './avant-de-commencer-simulation/avant-de-commencer-simulation.component';


@NgModule({
  declarations: [
    AvantDeCommencerSimulationComponent
  ],
  imports: [
    CommunModule,
    ProtectedRoutingModule
  ]
})
export class ProtectedModule { }
