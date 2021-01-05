import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SigninRedirectCallbackComponent } from '@app/commun/components/signin-redirect-callback/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from '@app/commun/components/signout-redirect-callback.component';
import { AutofocusDirective } from "@app/commun/directives/autofocus.directive";
import { CallbackPipe } from "@app/commun/pipes/callback.pipe";
import { AlertModule } from 'ngx-bootstrap/alert';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PageLoadingComponent } from "./components/page-loading/page-loading.component";
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalSessionExpiredComponent } from './components/modal-session-expired/modal-session-expired.component';
import { FilArianeComponent } from './components/fil-ariane/fil-ariane.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';


@NgModule({
  declarations: [
    AutofocusDirective,
    CallbackPipe,
    FilArianeComponent,
    FooterComponent,
    HeaderComponent,
    ModalSessionExpiredComponent,
    NotFoundComponent,
    PageLoadingComponent,
    SigninRedirectCallbackComponent,
    SignoutRedirectCallbackComponent
  ],
  imports: [
    AlertModule.forRoot(),
    BrowserModule,
    CommonModule,
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
  ],
  exports: [
    AutofocusDirective,
    CallbackPipe,
    CommonModule,
    FilArianeComponent,
    FooterComponent,
    HeaderComponent,
    PageLoadingComponent
  ]
})
export class CommunModule { }
