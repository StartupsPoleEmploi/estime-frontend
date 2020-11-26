import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '@app/core/services/access-control/authorization.service';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { SessionExpiredService } from '@app/core/services/access-control/session-expired.service';

@Component({
  selector: 'app-signin-redirect-callback',
  templateUrl: './signin-redirect-callback.component.html',
  styleUrls: ['./signin-redirect-callback.component.scss']
})
export class SigninRedirectCallbackComponent implements OnInit {

  isPageLoadingDisplay = false;

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router,
    private sessionExpiredService: SessionExpiredService
  ) {

  }

  ngOnInit() {
    this.isPageLoadingDisplay = true;
    this.authorizationService.completeLogin().then(
      (demandeur) => {
        this.isPageLoadingDisplay = false;
        if(this.sessionExpiredService.isBackAfterSessionExpired()) {
          this.sessionExpiredService.navigateToRouteActivated();
        } else {
          this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION], { replaceUrl: true });
        }
      }, (erreur) => {
        this.isPageLoadingDisplay = false;
        this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
      });
  }


}
