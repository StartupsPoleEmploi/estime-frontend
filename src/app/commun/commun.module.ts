import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninRedirectCallbackComponent } from '@app/commun/components/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from '@app/commun/components/signout-redirect-callback.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PageLoadingComponent } from "./components/page-loading/page-loading.component";

@NgModule({
  declarations: [
    SigninRedirectCallbackComponent,
    SignoutRedirectCallbackComponent,
    NotFoundComponent,
    PageLoadingComponent
  ],
  imports: [
    AlertModule.forRoot(),
    CommonModule
  ],
  exports: [
    CommonModule,
    PageLoadingComponent
  ]
})
export class CommunModule { }
