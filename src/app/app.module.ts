import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Environment } from "@models/environment";
import { environment } from '@environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommunModule } from './commun/commun.module';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommunModule,
    CoreModule
  ],
  providers: [
    {provide: Environment, useValue: environment},
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
