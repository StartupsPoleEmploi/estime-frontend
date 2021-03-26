import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KeysStorageEnum } from '@app/commun/enumerations/keys-storage.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { Individu } from '@app/commun/models/individu';
import { Environment } from '@models/environment';
import { PeConnectPayload } from '@models/pe-connect-payload';
import { SessionStorageService } from "ngx-webstorage";
import { CookiesEstimeService } from '../storage/cookies-estime.service';
import { IndividuConnectedService } from "@app/core/services/connexion/individu-connected.service";
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class PeConnectService {

  private peConnectPayload: PeConnectPayload;

  constructor(
    private cookieService: CookieService,
    private cookiesEstimeService: CookiesEstimeService,
    @Inject(DOCUMENT) private document: Document,
    private environment: Environment,
    private individuConnectedService: IndividuConnectedService,
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) {
  }

  public isDemandeurPEConnecte(): boolean {
    const userBadge = this.cookieService.get(KeysStorageEnum.PE_CONNECT_USER_BADGE);
    return userBadge && userBadge !== "0";
  }

  public login(): void {
    this.createPeConnectPayload();
    this.document.location.href = this.getPoleEmploiIdentityServerConnexionURI();
  }

  public logout(): void {
    this.sessionStorageService.clear();
    const individuConnected = this.cookiesEstimeService.getIndividuConnected();
    const poleEmploiIdentityServerDeconnexionURI = this.getPoleEmploiIdentityServerDeconnexionURI(individuConnected);
    if (poleEmploiIdentityServerDeconnexionURI !== null) {
      this.document.location.href = poleEmploiIdentityServerDeconnexionURI;
    } else {
      this.cookiesEstimeService.clear();
      this.router.navigate([RoutesEnum.HOMEPAGE]);
      this.individuConnectedService.emitIndividuConnectedLogoutEvent();
    }
  }

  private getPoleEmploiIdentityServerConnexionURI(): string {
    return `${this.environment.peconnectIdentityServerURL}/connexion/oauth2/authorize?` +
      'realm=%2Findividu&response_type=code' +
      `&client_id=${this.peConnectPayload.clientId}` +
      `&scope=${this.environment.peconnectScope}` +
      `&redirect_uri=${this.peConnectPayload.redirectURI}` +
      `&state=${this.peConnectPayload.state}` +
      `&nonce=${this.peConnectPayload.nonce}`
      ;
  }

  private getPoleEmploiIdentityServerDeconnexionURI(individuConnected: Individu): string {
    let poleEmploiIdentityServerDeconnexionURI = null;
    if (individuConnected && individuConnected.peConnectAuthorization && individuConnected.peConnectAuthorization.idToken) {
      poleEmploiIdentityServerDeconnexionURI = `${this.environment.peconnectIdentityServerURL}/compte/deconnexion?` +
        `&id_token_hint=${individuConnected.peConnectAuthorization.idToken}` +
        `&redirect_uri=${this.environment.peconnectRedirecturi}${RoutesEnum.SIGNOUT_CALLBACK}`
    }
    return poleEmploiIdentityServerDeconnexionURI;
  }

  private generateRandomValue(): string {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let array = new Uint8Array(64);
    window.crypto.getRandomValues(array);
    array = array.map(x => validChars.charCodeAt(x % validChars.length));
    return String.fromCharCode.apply(null, array);
  }

  private createPeConnectPayload(): void {
    this.peConnectPayload = new PeConnectPayload();
    this.peConnectPayload.clientId = this.environment.peconnectClientid;
    this.peConnectPayload.nonce = this.generateRandomValue();
    this.peConnectPayload.redirectURI = `${this.environment.peconnectRedirecturi}${RoutesEnum.SIGNIN_CALLBACK}`;
    this.peConnectPayload.state = this.generateRandomValue();

    this.sessionStorageService.store(KeysStorageEnum.PE_CONNECT_PAYLOAD_STORAGE_SESSION_KEY, this.peConnectPayload);
  }
}
