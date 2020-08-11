import { NgModule } from '@angular/core';
import { CommunModule } from '@app/commun/commun.module';

import { ProtectedRoutingModule } from '@app/protected/protected-routing.module';
import { RecapitulatifInfoDeComponent } from '@app/protected/recapitulatif-info-de/recapitulatif-info-de.component';


@NgModule({
  declarations: [
    RecapitulatifInfoDeComponent
  ],
  imports: [
    CommunModule,
    ProtectedRoutingModule
  ]
})
export class ProtectedModule { }
