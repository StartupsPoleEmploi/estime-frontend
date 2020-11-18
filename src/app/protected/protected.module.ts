import { NgModule } from '@angular/core';
import { CommunModule } from '@app/commun/commun.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ProtectedRoutingModule } from '@app/protected/protected-routing.module';
import { AvantDeCommencerSimulationComponent } from '@app/protected/avant-de-commencer-simulation/avant-de-commencer-simulation.component';
import { MonFuturTravailComponent } from '@app/protected/mon-futur-travail/mon-futur-travail.component';
import { MesInformationsPersonnellesComponent } from '@app/protected/mes-informations-personnelles/mes-informations-personnelles.component';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { VosRessourcesFinancieresComponent } from '@app/protected/ressources-financieres/vos-ressources-financieres/vos-ressources-financieres.component';
import { ResultatMaSimulationComponent } from '@app/protected/resultat-ma-simulation/resultat-ma-simulation.component';
import { RessourcesFinancieresConjointComponent } from '@app/protected/ressources-financieres-conjoint/ressources-financieres-conjoint.component';
import { MesPersonnesAChargeComponent } from '@app/protected/mes-personnes-a-charge/mes-personnes-a-charge.component';
import { RessourcesFinancieresMensuellesComponent } from './resultat-ma-simulation/ressources-financieres-mensuelles/ressources-financieres-mensuelles.component';
import { DetailAideSocialeComponent } from './resultat-ma-simulation/detail-aide-sociale/detail-aide-sociale.component';
import { ItemRessourceActuelleComponent } from './resultat-ma-simulation/ressources-financieres-mensuelles/item-ressource-actuelle/item-ressource-actuelle.component';
import { FormPersonneAChargeComponent } from './mes-personnes-a-charge/form-personne-a-charge/form-personne-a-charge.component';
import { FormPersonneAChargeSituationComponent } from './mes-personnes-a-charge/form-personne-a-charge/form-personne-a-charge-situation/form-personne-a-charge-situation.component';
import { RessourcesFinancieresComponent } from './ressources-financieres/ressources-financieres.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RessourcesFinancieresFoyerComponent } from './ressources-financieres/ressources-financieres-foyer/ressources-financieres-foyer.component';

@NgModule({
  declarations: [
    AvantDeCommencerSimulationComponent,
    DetailAideSocialeComponent,
    FormPersonneAChargeComponent,
    FormPersonneAChargeSituationComponent,
    ItemRessourceActuelleComponent,
    MesInformationsPersonnellesComponent,
    MesPersonnesAChargeComponent,
    MonFuturTravailComponent,
    RessourcesFinancieresComponent,
    RessourcesFinancieresConjointComponent,
    RessourcesFinancieresFoyerComponent,
    RessourcesFinancieresMensuellesComponent,
    ResultatMaSimulationComponent,
    VosRessourcesFinancieresComponent
  ],
  imports: [
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    BrowserAnimationsModule,
    ButtonsModule.forRoot(),
    CommunModule,
    FormsModule,
    ReactiveFormsModule,
    PopoverModule.forRoot(),
    ProtectedRoutingModule
  ]
})
export class ProtectedModule { }
