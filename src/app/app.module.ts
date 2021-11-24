import { NgModule } from '@angular/core';
import { Environment } from "@models/environment";
import { environment } from '@environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommunModule } from './commun/commun.module';
import { CoreModule } from './core/core.module';
import { RouterModule } from '@angular/router';
import { PublicModule } from './public/public.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    CommunModule,
    CoreModule,
    PublicModule,
    RouterModule
  ],
  providers: [
    { provide: Environment, useValue: environment },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
