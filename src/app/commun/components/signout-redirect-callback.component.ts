import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core/services/utile/authentication.service';

@Component({
  selector: 'app-signout-callback',
  template: `<div></div>`
})

export class SignoutRedirectCallbackComponent implements OnInit {
  constructor(
    private authenticationService: AuthenticationService
  ) {

  }

  ngOnInit() {
    this.authenticationService.completeLogout();
  }
}
