import { NgModule } from '@angular/core';
import { CommunModule } from '@app/commun/commun.module';

import { PublicRoutingModule } from '@app/public/public-routing.module';
import { HomepageComponent } from '@app/public/homepage/homepage.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CguComponent } from './cgu/cgu.component';
import { SectionEtapesSimulationComponent } from './homepage/section-etapes-simulation/section-etapes-simulation.component';
import { SectionQuestionsComponent } from './homepage/section-questions/section-questions.component';
import { SectionTemoignagesComponent } from './homepage/section-temoignages/section-temoignages.component';
import { TemoignagesDesktopComponent } from './homepage/section-temoignages/temoignages-desktop/temoignages-desktop.component';
import { TemoignagesMobileComponent } from './homepage/section-temoignages/temoignages-mobile/temoignages-mobile.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  declarations: [
    HomepageComponent,
    CguComponent,
    SectionEtapesSimulationComponent,
    SectionQuestionsComponent,
    SectionTemoignagesComponent,
    TemoignagesDesktopComponent,
    TemoignagesMobileComponent,
    ContactComponent
  ],
  imports: [
    AlertModule.forRoot(),
    CarouselModule.forRoot(),
    CommunModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
