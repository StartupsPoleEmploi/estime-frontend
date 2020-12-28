import { NgModule } from '@angular/core';
import { CommunModule } from '@app/commun/commun.module';

import { PublicRoutingModule } from '@app/public/public-routing.module';
import { HomepageComponent } from '@app/public/homepage/homepage.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CguComponent } from './cgu/cgu.component';

@NgModule({
  declarations: [
    HomepageComponent,
    CguComponent
  ],
  imports: [
    AlertModule.forRoot(),
    CommunModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
