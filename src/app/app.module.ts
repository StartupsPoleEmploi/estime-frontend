import { NgModule } from '@angular/core';
import { Environment } from "@models/environment";
import { environment } from '@environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommunModule } from './commun/commun.module';
import { CoreModule } from './core/core.module';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { EnableParcoursComplementAREGuard } from './commun/guard/enable-parcours-complement-are.guard';

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
    HttpClientModule,
    RouterModule
  ],
  providers: [
    { provide: Environment, useValue: environment },
    CookieService,
    EnableParcoursComplementAREGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
