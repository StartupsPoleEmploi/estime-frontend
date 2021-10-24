import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultatSimulationRoutingModule } from './resultat-simulation-routing.module';
import { ResultatSimulationComponent } from './resultat-simulation.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ActionsSuiteComponent } from './actions-suite/actions-suite.component';
import { ConsultationOffresComponent } from './actions-suite/consultation-offres/consultation-offres.component';
import { InscriptionAtelierComponent } from './actions-suite/inscription-atelier/inscription-atelier.component';
import { MettreAJourProfilComponent } from './actions-suite/mettre-a-jour-profil/mettre-a-jour-profil.component';
import { RessourcesFinancieresDiagrammeComponent } from './ressources-financieres-diagramme/ressources-financieres-diagramme.component';
import { DiagrammeCanvasComponent } from './ressources-financieres-diagramme/diagramme-canvas/diagramme-canvas.component';
import { DetailAideComponent } from './detail-aide/detail-aide.component';
import { ItemRessourceActuelleComponent } from './ressources-financieres-mensuelles/item-ressource-actuelle/item-ressource-actuelle.component';
import { RessourcesFinancieresMensuellesComponent } from './ressources-financieres-mensuelles/ressources-financieres-mensuelles.component';
import { ChartModule } from 'angular2-chartjs';

@NgModule({
  imports: [
    ChartModule,
    CommonModule,
    PopoverModule,
    ResultatSimulationRoutingModule
  ],
  declarations: [
    ActionsSuiteComponent,
    ConsultationOffresComponent,
    InscriptionAtelierComponent,
    MettreAJourProfilComponent,
    RessourcesFinancieresDiagrammeComponent,
    DiagrammeCanvasComponent,
    DetailAideComponent,
    ItemRessourceActuelleComponent,
    RessourcesFinancieresMensuellesComponent,
    ResultatSimulationComponent
  ]
})
export class ResultatSimulationModule { }