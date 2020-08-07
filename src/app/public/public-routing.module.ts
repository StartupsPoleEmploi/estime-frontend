import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';

import { SigninRedirectCallbackComponent } from '@app/commun/components/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from '@app/commun/components/signout-redirect-callback.component';
import { RecapitulatifInfoDeComponent } from '@app/public/recapitulatif-info-de/recapitulatif-info-de.component';




const routes: Routes = [
  {path: '', component: HomepageComponent, pathMatch: 'full' },
  {path: 'recapitulatif-infos-de', component: RecapitulatifInfoDeComponent },
  { path: 'signin-callback', component: SigninRedirectCallbackComponent },
  { path: 'signout-callback', component: SignoutRedirectCallbackComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
