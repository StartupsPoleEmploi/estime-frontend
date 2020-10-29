import { NgModule } from '@angular/core';
import { CommunModule } from '@app/commun/commun.module';
import { FormsModule } from "@angular/forms";
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProtectedRoutingModule } from '@app/protected/protected-routing.module';
import { AvantDeCommencerSimulationComponent } from './avant-de-commencer-simulation/avant-de-commencer-simulation.component';
import { MonContratTravailComponent } from './mon-contrat-travail/mon-contrat-travail.component';

@NgModule({
  declarations: [
    AvantDeCommencerSimulationComponent,
    MonContratTravailComponent
  ],
  imports: [
    CommunModule,
    FormsModule,
    ProtectedRoutingModule,
    PopoverModule.forRoot()
  ]
})
export class ProtectedModule { }
