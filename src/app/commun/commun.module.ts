import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninRedirectCallbackComponent } from '@app/commun/components/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from '@app/commun/components/signout-redirect-callback.component';
import { ReplaceCommaByDotPipe } from "@app/commun/pipe/replace-comma-by-dot.pipe";

@NgModule({
  declarations: [
    ReplaceCommaByDotPipe,
    SigninRedirectCallbackComponent,
    SignoutRedirectCallbackComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    ReplaceCommaByDotPipe
  ]
})
export class CommunModule { }
