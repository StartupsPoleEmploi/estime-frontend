import { NgModule } from '@angular/core';
import { CommunModule } from '@app/commun/commun.module';
import { FormsModule } from "@angular/forms";
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProtectedRoutingModule } from '@app/protected/protected-routing.module';
import { AvantDeCommencerSimulationComponent } from './avant-de-commencer-simulation/avant-de-commencer-simulation.component';
import { MonFuturTravailComponent } from './mon-futur-travail/mon-futur-travail.component';
import { MesInformationsIdentiteComponent } from './mes-informations-identite/mes-informations-identite.component';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MaSituationFamilialeComponent } from './ma-situation-familiale/ma-situation-familiale.component';
import { MesRessourcesFinancieresComponent } from './mes-ressources-financieres/mes-ressources-financieres.component';
import { ResultatMaSimulationComponent } from './resultat-ma-simulation/resultat-ma-simulation.component';

@NgModule({
  declarations: [
    AvantDeCommencerSimulationComponent,
    MonFuturTravailComponent,
    MesInformationsIdentiteComponent,
    MaSituationFamilialeComponent,
    MesRessourcesFinancieresComponent,
    ResultatMaSimulationComponent
  ],
  imports: [
    ButtonsModule.forRoot(),
    CommunModule,
    FormsModule,
    ProtectedRoutingModule,
    PopoverModule.forRoot()
  ]
})
export class ProtectedModule { }
