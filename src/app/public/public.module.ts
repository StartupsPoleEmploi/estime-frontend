import { NgModule } from '@angular/core';
import { CommunModule } from '../commun/commun.module';

import { PublicRoutingModule } from './public-routing.module';
import { HomepageComponent } from './homepage/homepage.component';



@NgModule({
  declarations: [
    HomepageComponent
  ],
  imports: [
    CommunModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
