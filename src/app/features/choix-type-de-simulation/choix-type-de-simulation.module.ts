import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { CommunModule } from '@app/commun/commun.module';
import { BnNgIdleService } from 'bn-ng-idle';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ChartModule } from 'angular2-chartjs';
import { ChoixTypeDeSimulationRoutingModule } from './choix-type-de-simulation-routing.module';
import { ChoixTypeDeSimulationComponent } from './choix-type-de-simulation.component';
import { ModalChoixConnexionComponent } from './modal-choix-connexion/modal-choix-connexion.component';

@NgModule({
  declarations: [
    ChoixTypeDeSimulationComponent,
    ModalChoixConnexionComponent
  ],
  imports: [
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    CommunModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressbarModule.forRoot(),
    ChoixTypeDeSimulationRoutingModule,
    RouterModule,
    ChartModule,
  ],
  providers: [BnNgIdleService]
})
export class ChoixTypeDeSimulationModule { }
