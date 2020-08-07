import { NgModule } from '@angular/core';
import { CommunModule } from '@app/commun/commun.module';

import { PublicRoutingModule } from '@app/public/public-routing.module';
import { HomepageComponent } from '@app/public/homepage/homepage.component';
import { RecapitulatifInfoDeComponent } from './recapitulatif-info-de/recapitulatif-info-de.component';


@NgModule({
  declarations: [
    HomepageComponent,
    RecapitulatifInfoDeComponent
  ],
  imports: [
    CommunModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
