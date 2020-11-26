import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '@app/core/services/access-control/authorization.service';
import { SessionExpiredService } from '@app/core/services/access-control/session-expired.service';

@Component({
  selector: 'app-signout-callback',
  template: `<div></div>`
})

export class SignoutRedirectCallbackComponent implements OnInit {
  constructor(
    private authorizationService: AuthorizationService,
    private sessionExpiredService: SessionExpiredService
  ) {

  }

  ngOnInit() {

    if(this.sessionExpiredService.isBackAfterSessionExpired()) {
      this.authorizationService.login();
    } else {
      this.authorizationService.completeLogout();
    }
  }
}
