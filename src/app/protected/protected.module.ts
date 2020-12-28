import { NgModule } from '@angular/core';
import { CommunModule } from '@app/commun/commun.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ProtectedRoutingModule } from '@app/protected/protected-routing.module';
import { AvantDeCommencerSimulationComponent } from '@app/protected/avant-de-commencer-simulation/avant-de-commencer-simulation.component';
import { ContratTravailComponent } from '@app/protected/etapes-simulation/1.contrat-travail/contrat-travail.component';
import { MaSituationComponent } from '@app/protected/etapes-simulation/2.ma-situation/ma-situation.component';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { VosRessourcesFinancieresComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/vos-ressources-financieres/vos-ressources-financieres.component';
import { ResultatSimulationComponent } from '@app/protected/etapes-simulation/5.resultat-simulation/resultat-simulation.component';
import { RessourcesFinancieresConjointComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-financieres-conjoint/ressources-financieres-conjoint.component';
import { MesPersonnesAChargeComponent } from '@app/protected/etapes-simulation/3.mes-personnes-a-charge/mes-personnes-a-charge.component';
import { RessourcesFinancieresMensuellesComponent } from './etapes-simulation/5.resultat-simulation/ressources-financieres-mensuelles/ressources-financieres-mensuelles.component';
import { DetailAideSocialeComponent } from './etapes-simulation/5.resultat-simulation/detail-aide-sociale/detail-aide-sociale.component';
import { ItemRessourceActuelleComponent } from './etapes-simulation/5.resultat-simulation/ressources-financieres-mensuelles/item-ressource-actuelle/item-ressource-actuelle.component';
import { FormPersonneAChargeComponent } from './etapes-simulation/3.mes-personnes-a-charge/form-personne-a-charge/form-personne-a-charge.component';
import { FormPersonneAChargeSituationComponent } from './etapes-simulation/3.mes-personnes-a-charge/form-personne-a-charge/form-personne-a-charge-situation/form-personne-a-charge-situation.component';
import { RessourcesActuellesComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-actuelles.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RessourcesFinancieresFoyerComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-financieres-foyer/ressources-financieres-foyer.component';
import { RessourcesFinancieresPersonnesAChargeComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-financieres-personnes-a-charge/ressources-financieres-personnes-a-charge.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { EtapesSimulationComponent } from './etapes-simulation/etapes-simulation.component';
import { FilEtapesDesktopComponent } from "./etapes-simulation/fils-etapes/fil-etapes-desktop/fil-etapes-desktop.component";
import { FilEtapesMobileComponent } from './etapes-simulation/fils-etapes/fil-etapes-mobile/fil-etapes-mobile.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

@NgModule({
  declarations: [
    AvantDeCommencerSimulationComponent,
    ContratTravailComponent,
    DetailAideSocialeComponent,
    EtapesSimulationComponent,
    FilEtapesDesktopComponent,
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
    FilEtapesMobileComponent
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
    RouterModule
  ],
  providers: [BnNgIdleService]
})
export class ProtectedModule { }
