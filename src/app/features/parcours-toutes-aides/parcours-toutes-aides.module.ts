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
import { ContratTravailComponent } from '@app/features/parcours-toutes-aides/1.contrat-travail/contrat-travail.component';
import { MaSituationComponent } from '@app/features/parcours-toutes-aides/2.ma-situation/ma-situation.component';
import { MesPersonnesAChargeComponent } from '@app/features/parcours-toutes-aides/3.mes-personnes-a-charge/mes-personnes-a-charge.component';
import { FormPersonneAChargeSituationComponent } from './3.mes-personnes-a-charge/form-personne-a-charge/form-personne-a-charge-situation/form-personne-a-charge-situation.component';
import { FormPersonneAChargeComponent } from './3.mes-personnes-a-charge/form-personne-a-charge/form-personne-a-charge.component';
import { RessourcesActuellesComponent } from '@app/features/parcours-toutes-aides/4.ressources-actuelles/ressources-actuelles.component';
import { RessourcesFinancieresConjointComponent } from '@app/features/parcours-toutes-aides/4.ressources-actuelles/ressources-financieres-conjoint/ressources-financieres-conjoint.component';
import { RessourcesFinancieresFoyerComponent } from '@app/features/parcours-toutes-aides/4.ressources-actuelles/ressources-financieres-foyer/ressources-financieres-foyer.component';
import { RessourcesFinancieresPersonnesAChargeComponent } from '@app/features/parcours-toutes-aides/4.ressources-actuelles/ressources-financieres-personnes-a-charge/ressources-financieres-personnes-a-charge.component';
import { VosRessourcesFinancieresComponent } from '@app/features/parcours-toutes-aides/4.ressources-actuelles/vos-ressources-financieres/vos-ressources-financieres.component';
import { ResultatSimulationComponent } from '@app/features/parcours-toutes-aides/5.resultat-simulation/resultat-simulation.component';
import { RessourcesFinancieresDiagrammeComponent } from './5.resultat-simulation/ressources-financieres-diagramme/ressources-financieres-diagramme.component';
import { ActionsSuiteComponent } from './5.resultat-simulation/actions-suite/actions-suite.component';
import { ParcoursToutesAidesRoutingModule } from './parcours-toutes-aides-routing.module';
import { MoisApresSimulationComponent } from './5.resultat-simulation/mois-apres-simulation/mois-apres-simulation.component';
import { DetailMoisApresSimulationComponent } from './5.resultat-simulation/detail-mois-apres-simulation/detail-mois-apres-simulation.component';
import { ActionSuiteComponent } from './5.resultat-simulation/actions-suite/action-suite/action-suite.component';
import { ModificationCriteresComponent } from './5.resultat-simulation/modification-criteres/modification-criteres.component';
import { AvantDeCommencerSimulationComponent } from './avant-de-commencer-simulation/avant-de-commencer-simulation.component';

@NgModule({
  declarations: [
    AvantDeCommencerSimulationComponent,
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
    ParcoursToutesAidesRoutingModule,
    RouterModule,
    ChartModule
  ],
  providers: [BnNgIdleService]
})
export class ParcoursToutesAidesModule { }
