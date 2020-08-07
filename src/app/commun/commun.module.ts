import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninRedirectCallbackComponent } from '@app/commun/components/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from '@app/commun/components/signout-redirect-callback.component';



@NgModule({
  declarations: [
    SigninRedirectCallbackComponent,
    SignoutRedirectCallbackComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule
  ]
})
export class CommunModule { }
