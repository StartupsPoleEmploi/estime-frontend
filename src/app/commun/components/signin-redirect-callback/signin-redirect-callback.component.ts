import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '@app/core/services/connexion/authorization.service';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { SessionPeConnectExpiredService } from "@app/core/services/connexion/session-pe-connect-expired.service";
import { SessionStorageEstimeService } from '@app/core/services/storage/session-storage-estime.service';
import { PeConnectService } from '@app/core/services/connexion/pe-connect.service';
import { IndividuConnectedService } from '@app/core/services/connexion/individu-connected.service';
import { Individu } from '@app/commun/models/individu';

@Component({
  selector: 'app-signin-redirect-callback',
  templateUrl: './signin-redirect-callback.component.html',
  styleUrls: ['./signin-redirect-callback.component.scss']
})
export class SigninRedirectCallbackComponent implements OnInit {

  isPageLoadingDisplay = false;

  constructor(
    private authorizationService: AuthorizationService,
    private individuConnectedService: IndividuConnectedService,
    private peConnectService: PeConnectService,
    private router: Router,
    private sessionPeConnectExpiredService: SessionPeConnectExpiredService,
    private sessionStorageEstimeService: SessionStorageEstimeService
  ) {

  }

  ngOnInit() {
    this.isPageLoadingDisplay = true;
    this.authorizationService.authentifierIndividu().subscribe({
      next: this.traiterRetourAuthentifierIndividu.bind(this),
      error: this.traiterErreurAuthentifierIndividu.bind(this)
    });

  }

  private traiterRetourAuthentifierIndividu(individu: Individu): void {
    this.isPageLoadingDisplay = false;
    this.individuConnectedService.saveIndividuConnected(individu);
    if (individu.populationAutorisee) {
      this.sessionPeConnectExpiredService.startCheckUserInactivity();
      if (this.sessionPeConnectExpiredService.isIndividuBackAfterSessionExpired()) {
        this.sessionPeConnectExpiredService.navigateToRouteActivated();
      } else {
        this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
      }
    } else {
      this.sessionStorageEstimeService.storeMessageDemandeurEmploiNonAutorise();
      this.peConnectService.logout();
    }
  }

  private traiterErreurAuthentifierIndividu(): void {
    this.sessionStorageEstimeService.storeMessageDemandeurEmploiConnexionImpossible();
    this.isPageLoadingDisplay = false;
    this.router.navigate([RoutesEnum.HOMEPAGE]);
  }
}
