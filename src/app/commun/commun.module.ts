import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninRedirectCallbackComponent } from '@app/commun/components/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from '@app/commun/components/signout-redirect-callback.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PageLoadingComponent } from "./components/page-loading/page-loading.component";
import { CallbackPipe } from "@app/commun/pipes/callback.pipe";
import { AutofocusDirective } from "@app/commun/directives/autofocus.directive";

@NgModule({
  declarations: [
    AutofocusDirective,
    CallbackPipe,
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
    AutofocusDirective,
    CallbackPipe,
    CommonModule,
    PageLoadingComponent
  ]
})
export class CommunModule { }
