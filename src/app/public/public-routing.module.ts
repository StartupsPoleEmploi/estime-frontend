import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';

import { SigninRedirectCallbackComponent } from '@app/commun/components/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from '@app/commun/components/signout-redirect-callback.component';
import { NotFoundComponent } from "@app/commun/components/not-found/not-found.component";



const routes: Routes = [
  {path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: 'signin-callback', component: SigninRedirectCallbackComponent },
  { path: 'signout-callback', component: SignoutRedirectCallbackComponent },
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
