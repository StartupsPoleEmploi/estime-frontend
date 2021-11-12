import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { CommunModule } from '@app/commun/commun.module';
import { AvantDeCommencerSimulationComponent } from '@app/protected/avant-de-commencer-simulation/avant-de-commencer-simulation.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ChartModule } from 'angular2-chartjs';
import { AvantDeCommencerSimulationRoutingModule } from './avant-de-commencer-simulation-routing.module';
@NgModule({
  declarations: [
    AvantDeCommencerSimulationComponent
  ],
  imports: [
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    CommunModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressbarModule.forRoot(),
    AvantDeCommencerSimulationRoutingModule,
    RouterModule,
    ChartModule
  ],
  providers: [BnNgIdleService]
})
export class AvantDeCommencerSimulationModule { }
