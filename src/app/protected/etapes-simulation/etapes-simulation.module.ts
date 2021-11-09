import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { CommunModule } from '@app/commun/commun.module';
import { ContratTravailComponent } from '@app/protected/etapes-simulation/1.contrat-travail/contrat-travail.component';
import { MaSituationComponent } from '@app/protected/etapes-simulation/2.ma-situation/ma-situation.component';
import { MesPersonnesAChargeComponent } from '@app/protected/etapes-simulation/3.mes-personnes-a-charge/mes-personnes-a-charge.component';
import { RessourcesActuellesComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-actuelles.component';
import { RessourcesFinancieresConjointComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-financieres-conjoint/ressources-financieres-conjoint.component';
import { RessourcesFinancieresFoyerComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-financieres-foyer/ressources-financieres-foyer.component';
import { RessourcesFinancieresPersonnesAChargeComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-financieres-personnes-a-charge/ressources-financieres-personnes-a-charge.component';
import { VosRessourcesFinancieresComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/vos-ressources-financieres/vos-ressources-financieres.component';
import { ResultatSimulationComponent } from '@app/protected/etapes-simulation/5.resultat-simulation/resultat-simulation.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { FormPersonneAChargeSituationComponent } from './3.mes-personnes-a-charge/form-personne-a-charge/form-personne-a-charge-situation/form-personne-a-charge-situation.component';
import { FormPersonneAChargeComponent } from './3.mes-personnes-a-charge/form-personne-a-charge/form-personne-a-charge.component';
import { DetailAideComponent } from './5.resultat-simulation/detail-aide/detail-aide.component';
import { ItemRessourceActuelleComponent } from './5.resultat-simulation/ressources-financieres-mensuelles/item-ressource-actuelle/item-ressource-actuelle.component';
import { RessourcesFinancieresMensuellesComponent } from './5.resultat-simulation/ressources-financieres-mensuelles/ressources-financieres-mensuelles.component';
import { FilEtapesDesktopComponent } from './fil-etapes/fil-etapes-desktop/fil-etapes-desktop.component';
import { FilEtapesMobileComponent } from './fil-etapes/fil-etapes-mobile/fil-etapes-mobile.component';
import { RessourcesFinancieresDiagrammeComponent } from './5.resultat-simulation/ressources-financieres-diagramme/ressources-financieres-diagramme.component';
import { DiagrammeCanvasComponent } from './5.resultat-simulation/ressources-financieres-diagramme/diagramme-canvas/diagramme-canvas.component';
import { ChartModule } from 'angular2-chartjs';
import { ConsultationOffresComponent } from './5.resultat-simulation/actions-suite/consultation-offres/consultation-offres.component';
import { InscriptionAtelierComponent } from './5.resultat-simulation/actions-suite/inscription-atelier/inscription-atelier.component';
import { MettreAJourProfilComponent } from './5.resultat-simulation/actions-suite/mettre-a-jour-profil/mettre-a-jour-profil.component';
import { ActionsSuiteComponent } from './5.resultat-simulation/actions-suite/actions-suite.component';
import { EtapesSimulationRoutingModule } from './etapes-simulation-routing.module';

@NgModule({
  declarations: [
    ContratTravailComponent,
    DetailAideComponent,
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
    DiagrammeCanvasComponent,
    ConsultationOffresComponent,
    InscriptionAtelierComponent,
    MettreAJourProfilComponent,
    ActionsSuiteComponent
  ],
  imports: [
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    CommunModule,
    FormsModule,
    ReactiveFormsModule,
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    EtapesSimulationRoutingModule,
    RouterModule,
    ChartModule
  ],
  providers: [BnNgIdleService]
})
export class EtapesSimulationModule { }
