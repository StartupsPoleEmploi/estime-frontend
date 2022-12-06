import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from "@app/commun/components/not-found/not-found.component";
import { SigninRedirectCallbackComponent } from '@app/commun/components/signin-redirect-callback/signin-redirect-callback.component';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { AccessibiliteComponent } from './accessibilite/accessibilite.component';
import { CguComponent } from './cgu/cgu.component';
import { ContactComponent } from './contact/contact.component';
import { HomepageComponent } from './homepage/homepage.component';
import { StatsComponent } from './stats/stats.component';

const routes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: RoutesEnum.ACCESSIBILITE, component: AccessibiliteComponent },
  { path: RoutesEnum.CGU, component: CguComponent },
  { path: RoutesEnum.CONTACT, component: ContactComponent },
  { path: RoutesEnum.SIGNIN_CALLBACK, component: SigninRedirectCallbackComponent },
  { path: RoutesEnum.STATS, component: StatsComponent },
  { path: RoutesEnum.NOT_FOUND, component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];



@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
