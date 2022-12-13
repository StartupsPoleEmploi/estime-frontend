import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaSituationComponent } from './1.ma-situation/ma-situation.component';
import { ActiviteRepriseComponent } from './2.activite-reprise/activite-reprise.component';
import { ResultatSimulationComponent } from './3.resultat-simulation/resultat-simulation.component';
import { ParcoursComplementAreRoutingModule } from './parcours-complement-are-routing.module';
import { CommunModule } from '@app/commun/commun.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModificationCriteresComponent } from './3.resultat-simulation/modification-criteres/modification-criteres.component';
import { ActionsSuiteComponent } from './3.resultat-simulation/actions-suite/actions-suite.component';
import { ActionSuiteComponent } from './3.resultat-simulation/actions-suite/action-suite/action-suite.component';



@NgModule({
  declarations: [
    MaSituationComponent,
    ActiviteRepriseComponent,
    ResultatSimulationComponent,
    ActionSuiteComponent,
    ActionsSuiteComponent,
    ModificationCriteresComponent,
  ],
  imports: [
    CommonModule,
    CommunModule,
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    CommunModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ParcoursComplementAreRoutingModule,
  ]
})
export class ParcoursComplementAreModule { }
