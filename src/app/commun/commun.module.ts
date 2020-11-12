import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SigninRedirectCallbackComponent } from '@app/commun/components/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from '@app/commun/components/signout-redirect-callback.component';
import { AutofocusDirective } from "@app/commun/directives/autofocus.directive";
import { CallbackPipe } from "@app/commun/pipes/callback.pipe";
import { AlertModule } from 'ngx-bootstrap/alert';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PageLoadingComponent } from "./components/page-loading/page-loading.component";

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
    BrowserModule,
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
