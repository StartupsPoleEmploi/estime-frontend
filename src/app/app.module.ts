import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { environment } from '@environments/environment';
import { Environment } from "@app/commun/models/environment";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CoreModule
  ],
  providers: [
    {provide: Environment, useValue: environment}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
