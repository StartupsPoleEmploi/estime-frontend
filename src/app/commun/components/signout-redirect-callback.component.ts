import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '@app/core/services/access-control/authorization.service';

@Component({
  selector: 'app-signout-callback',
  template: `<div></div>`
})

export class SignoutRedirectCallbackComponent implements OnInit {
  constructor(
    private authorizationService: AuthorizationService
  ) {

  }

  ngOnInit() {
    this.authorizationService.completeLogout();
  }
}
