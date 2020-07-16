import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PublicModule } from '../public/public.module';



@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
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
