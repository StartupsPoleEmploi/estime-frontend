import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from "@app/commun/components/not-found/not-found.component";
import { SigninRedirectCallbackComponent } from '@app/commun/components/signin-redirect-callback/signin-redirect-callback.component';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { AidesDescriptionComponent } from './aides/aides-description/aides-description.component';
import { AccessibiliteComponent } from './accessibilite/accessibilite.component';
import { AidesComponent } from './aides/aides.component';
import { CguComponent } from './cgu/cgu.component';
import { ContactComponent } from './contact/contact.component';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path: RoutesEnum.ACCESSIBILITE, component: AccessibiliteComponent },
  { path: RoutesEnum.AIDES, component: AidesComponent },
  { path: RoutesEnum.AIDES_DESCRIPTION, component: AidesDescriptionComponent },
  { path: RoutesEnum.CGU, component: CguComponent },
  { path: RoutesEnum.CONTACT, component: ContactComponent },
  { path: RoutesEnum.SIGNIN_CALLBACK, component: SigninRedirectCallbackComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }

];



@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
