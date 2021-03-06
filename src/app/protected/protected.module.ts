import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CommunModule } from '@app/commun/commun.module';
import { AvantDeCommencerSimulationComponent } from '@app/protected/avant-de-commencer-simulation/avant-de-commencer-simulation.component';
import { ContratTravailComponent } from '@app/protected/etapes-simulation/1.contrat-travail/contrat-travail.component';
import { MaSituationComponent } from '@app/protected/etapes-simulation/2.ma-situation/ma-situation.component';
import { MesPersonnesAChargeComponent } from '@app/protected/etapes-simulation/3.mes-personnes-a-charge/mes-personnes-a-charge.component';
import { RessourcesActuellesComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-actuelles.component';
import { RessourcesFinancieresConjointComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-financieres-conjoint/ressources-financieres-conjoint.component';
import { RessourcesFinancieresFoyerComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-financieres-foyer/ressources-financieres-foyer.component';
import { RessourcesFinancieresPersonnesAChargeComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-financieres-personnes-a-charge/ressources-financieres-personnes-a-charge.component';
import { VosRessourcesFinancieresComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/vos-ressources-financieres/vos-ressources-financieres.component';
import { ResultatSimulationComponent } from '@app/protected/etapes-simulation/5.resultat-simulation/resultat-simulation.component';
import { ProtectedRoutingModule } from '@app/protected/protected-routing.module';
import { BnNgIdleService } from 'bn-ng-idle';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { FormPersonneAChargeSituationComponent } from './etapes-simulation/3.mes-personnes-a-charge/form-personne-a-charge/form-personne-a-charge-situation/form-personne-a-charge-situation.component';
import { FormPersonneAChargeComponent } from './etapes-simulation/3.mes-personnes-a-charge/form-personne-a-charge/form-personne-a-charge.component';
import { DetailAideSocialeComponent } from './etapes-simulation/5.resultat-simulation/detail-aide-sociale/detail-aide-sociale.component';
import { ItemRessourceActuelleComponent } from './etapes-simulation/5.resultat-simulation/ressources-financieres-mensuelles/item-ressource-actuelle/item-ressource-actuelle.component';
import { RessourcesFinancieresMensuellesComponent } from './etapes-simulation/5.resultat-simulation/ressources-financieres-mensuelles/ressources-financieres-mensuelles.component';
import { EtapesSimulationComponent } from './etapes-simulation/etapes-simulation.component';
import { FilEtapesDesktopComponent } from './etapes-simulation/fil-etapes/fil-etapes-desktop/fil-etapes-desktop.component';
import { FilEtapesMobileComponent } from './etapes-simulation/fil-etapes/fil-etapes-mobile/fil-etapes-mobile.component';
import { RessourcesFinancieresDiagrammeComponent } from './etapes-simulation/5.resultat-simulation/ressources-financieres-diagramme/ressources-financieres-diagramme.component';
import { DiagrammeCanvasComponent } from './etapes-simulation/5.resultat-simulation/ressources-financieres-diagramme/diagramme-canvas/diagramme-canvas.component';
import { ChartModule } from 'angular2-chartjs';
@NgModule({
  declarations: [
    AvantDeCommencerSimulationComponent,
    ContratTravailComponent,
    DetailAideSocialeComponent,
    EtapesSimulationComponent,
    FormPersonneAChargeComponent,
    FormPersonneAChargeSituationComponent,
    ItemRessourceActuelleComponent,
    MaSituationComponent,
    MesPersonnesAChargeComponent,
    RessourcesActuellesComponent,
    RessourcesFinancieresConjointComponent,
    RessourcesFinancieresFoyerComponent,
    RessourcesFinancieresMensuellesComponent,
    RessourcesFinancieresPersonnesAChargeComponent,
    ResultatSimulationComponent,
    VosRessourcesFinancieresComponent,
    FilEtapesDesktopComponent,
    FilEtapesMobileComponent,
    RessourcesFinancieresDiagrammeComponent,
    DiagrammeCanvasComponent
  ],
  imports: [
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    BrowserAnimationsModule,
    BrowserModule,
    ButtonsModule.forRoot(),
    CommunModule,
    FormsModule,
    ReactiveFormsModule,
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    ProtectedRoutingModule,
    RouterModule,
    ChartModule
  ],
  providers: [BnNgIdleService]
})
export class ProtectedModule { }
