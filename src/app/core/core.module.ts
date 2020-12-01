import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PublicModule } from '@app/public/public.module';
import { ProtectedModule } from '@app/protected/protected.module';
import {NgxWebstorageModule} from 'ngx-webstorage';


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    ProtectedModule,
    PublicModule
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded.');
    }
  }
}
