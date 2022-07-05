import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { CommunModule } from '@app/commun/commun.module';
import { BnNgIdleService } from 'bn-ng-idle';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ChartModule } from 'angular2-chartjs';
import { FilEtapesDesktopComponent } from './fil-etapes/fil-etapes-desktop/fil-etapes-desktop.component';
import { FilEtapesMobileComponent } from './fil-etapes/fil-etapes-mobile/fil-etapes-mobile.component';
import { ContratTravailComponent } from '@app/protected/etapes-simulation/1.contrat-travail/contrat-travail.component';
import { MaSituationComponent } from '@app/protected/etapes-simulation/2.ma-situation/ma-situation.component';
import { MesPersonnesAChargeComponent } from '@app/protected/etapes-simulation/3.mes-personnes-a-charge/mes-personnes-a-charge.component';
import { FormPersonneAChargeSituationComponent } from './3.mes-personnes-a-charge/form-personne-a-charge/form-personne-a-charge-situation/form-personne-a-charge-situation.component';
import { FormPersonneAChargeComponent } from './3.mes-personnes-a-charge/form-personne-a-charge/form-personne-a-charge.component';
import { RessourcesActuellesComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-actuelles.component';
import { RessourcesFinancieresConjointComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-financieres-conjoint/ressources-financieres-conjoint.component';
import { RessourcesFinancieresFoyerComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-financieres-foyer/ressources-financieres-foyer.component';
import { RessourcesFinancieresPersonnesAChargeComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-financieres-personnes-a-charge/ressources-financieres-personnes-a-charge.component';
import { VosRessourcesFinancieresComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/vos-ressources-financieres/vos-ressources-financieres.component';
import { ResultatSimulationComponent } from '@app/protected/etapes-simulation/5.resultat-simulation/resultat-simulation.component';
import { RessourcesFinancieresDiagrammeComponent } from './5.resultat-simulation/ressources-financieres-diagramme/ressources-financieres-diagramme.component';
import { ActionsSuiteComponent } from './5.resultat-simulation/actions-suite/actions-suite.component';
import { EtapesSimulationRoutingModule } from './etapes-simulation-routing.module';
import { MoisApresSimulationComponent } from './5.resultat-simulation/mois-apres-simulation/mois-apres-simulation.component';
import { DetailMoisApresSimulationComponent } from './5.resultat-simulation/detail-mois-apres-simulation/detail-mois-apres-simulation.component';
import { DetailAideApresSimulationComponent } from './5.resultat-simulation/detail-aide-apres-simulation/detail-aide-apres-simulation.component';
import { ActionSuiteComponent } from './5.resultat-simulation/actions-suite/action-suite/action-suite.component';
import { ModificationCriteresComponent } from './5.resultat-simulation/modification-criteres/modification-criteres.component';

@NgModule({
  declarations: [
    ContratTravailComponent,
    FormPersonneAChargeComponent,
    FormPersonneAChargeSituationComponent,
    MaSituationComponent,
    MesPersonnesAChargeComponent,
    RessourcesActuellesComponent,
    RessourcesFinancieresConjointComponent,
    RessourcesFinancieresFoyerComponent,
    RessourcesFinancieresPersonnesAChargeComponent,
    ResultatSimulationComponent,
    VosRessourcesFinancieresComponent,
    FilEtapesDesktopComponent,
    FilEtapesMobileComponent,
    RessourcesFinancieresDiagrammeComponent,
    ActionsSuiteComponent,
    MoisApresSimulationComponent,
    DetailMoisApresSimulationComponent,
    DetailAideApresSimulationComponent,
    ActionSuiteComponent,
    ModificationCriteresComponent
  ],
  imports: [
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    CommunModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressbarModule.forRoot(),
    EtapesSimulationRoutingModule,
    RouterModule,
    ChartModule
  ],
  providers: [BnNgIdleService]
})
export class EtapesSimulationModule { }
