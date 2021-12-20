import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '@app/core/services/connexion/authorization.service';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { SessionPeConnectExpiredService } from "@app/core/services/connexion/session-pe-connect-expired.service";

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
    private sessionPeConnectExpiredService: SessionPeConnectExpiredService
  ) {

  }

  ngOnInit() {
    this.isPageLoadingDisplay = true;
    this.authorizationService.completeLogin().then(
      (individu) => {
        this.isPageLoadingDisplay = false;
        if(individu.populationAutorisee) {
          if(this.sessionPeConnectExpiredService.isIndividuBackAfterSessionExpired()) {
            this.sessionPeConnectExpiredService.navigateToRouteActivated();
          } else {
            this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
          }
        }
      }, (erreur) => {
        this.isPageLoadingDisplay = false;
        this.router.navigate([RoutesEnum.HOMEPAGE]);
      }
    );
  }


}
