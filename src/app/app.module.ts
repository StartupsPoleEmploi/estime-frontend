import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Environment } from "@app/commun/models/environment";
import { environment } from '@environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';


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
