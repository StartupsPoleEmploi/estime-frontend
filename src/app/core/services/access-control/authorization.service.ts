import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeysStorageEnum } from '@app/commun/enumerations/keys-storage.enum';
import { PeConnectPayload } from '@app/commun/models/pe-connect-payload';
import { CookiesIndividuService } from "@app/core/services/access-control/cookies-individu.service";
import { EstimeApiService } from "@app/core/services/estime-api/estime-api.service";
import { MessagesErreurEnum } from "@enumerations/messages-erreur.enum";
import { RoutesEnum } from '@enumerations/routes.enum';
import { Environment } from '@models/environment';
import { MessageErreur } from "@models/message-erreur";
import { SessionStorageService } from "ngx-webstorage";
import { Subject } from 'rxjs';
import { Individu } from '@app/commun/models/individu';
import { SessionExpiredService } from './session-expired.service';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {

  private individuConnected: Individu;
  private peConnectPayload: PeConnectPayload;
  private isLoggedInChangedSubject = new Subject<boolean>();
  private messageErreur: MessageErreur;

  loginChanged = this.isLoggedInChangedSubject.asObservable();


  constructor(private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private estimeApiService: EstimeApiService,
    private environment: Environment,
    private cookiesIndividuService: CookiesIndividuService,
    private router: Router,
    private sessionStorageService: SessionStorageService) {
  }

  public login(): void {
    this.createPeConnectPayload();
    this.document.location.href = this.getPoleEmploiIdentityServerConnexionURI();
  }

  public loginAfterSessionExpired(): void {
    this.killSessionPeConnectExpiredSoon();
  }

  public completeLogin(): Promise<void> {
    return this.authentifierDemandeurEmploi().then(
      (indidivu) => {
        this.individuConnected = indidivu;
        this.cookiesIndividuService.saveInCookies(indidivu);
        this.isLoggedInChangedSubject.next(true);
      }, (httpErrorResponse) => {
        console.log(httpErrorResponse.error);
        this.messageErreur = new MessageErreur();
        if (httpErrorResponse.error && httpErrorResponse.error.code) {
          this.messageErreur.code = httpErrorResponse.error.code;
          this.messageErreur.message = httpErrorResponse.error.message;
        } else {
          this.messageErreur.message = MessagesErreurEnum.CONNEXION_ESTIME_IMPOSSIBLE;
        }
        return Promise.reject();
      }
    );
  }

  public getMessageErreur(): MessageErreur {
    return this.messageErreur;
  }

  public isLoggedIn(): boolean {
    return this.cookiesIndividuService.getFromCookies() !== null;
  }

  public logoutAfterSessionExpired(): void {
    this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_ROUTE_ACTIVATED_STORAGE_SESSION_KEY);
    this.logout();
  }

  public logout(): void  {
    const poleEmploiIdentityServerDeconnexionURI = this.getPoleEmploiIdentityServerDeconnexionURI();
    this.clearStorage();
    if(poleEmploiIdentityServerDeconnexionURI !== null) {
      this.document.location.href = poleEmploiIdentityServerDeconnexionURI;
    } else {
      this.completeLogout();
    }
  }

  public completeLogout(): void {
    this.isLoggedInChangedSubject.next(false);
    this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
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

  private getPoleEmploiIdentityServerDeconnexionURI(): string {
    let poleEmploiIdentityServerDeconnexionURI = null;
    const individu = this.getIndividuConnected();
    if (individu && individu.peConnectAuthorization && individu.peConnectAuthorization.idToken) {
      poleEmploiIdentityServerDeconnexionURI = `${this.environment.peconnectIdentityServerURL}/compte/deconnexion?` +
        `&id_token_hint=${individu.peConnectAuthorization.idToken}` +
        `&redirect_uri=${this.environment.peconnectRedirecturi}signout-callback`
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

  private authentifierDemandeurEmploi(): Promise<Individu>  {
    this.peConnectPayload = this.sessionStorageService.retrieve(KeysStorageEnum.PE_CONNECT_PAYLOAD_STORAGE_SESSION_KEY);
    this.peConnectPayload.code = this.activatedRoute.snapshot.queryParams.code;
    if (this.activatedRoute.snapshot.queryParams.state === this.peConnectPayload.state) {
      return this.estimeApiService.authentifier(this.peConnectPayload);
    } else {
      this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
    }
  }

  private createPeConnectPayload(): void {
    this.peConnectPayload = new PeConnectPayload();
    this.peConnectPayload.clientId = this.environment.peconnectClientid;
    this.peConnectPayload.nonce = this.generateRandomValue(),
      this.peConnectPayload.redirectURI = `${this.environment.peconnectRedirecturi}signin-callback`;
    this.peConnectPayload.state = this.generateRandomValue();

    this.sessionStorageService.store(KeysStorageEnum.PE_CONNECT_PAYLOAD_STORAGE_SESSION_KEY, this.peConnectPayload);
  }

  private clearStorage(): void {
    this.individuConnected = null;
    this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
    this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION_AIDES_SOCIALE);
    this.sessionStorageService.clear(KeysStorageEnum.PE_CONNECT_PAYLOAD_STORAGE_SESSION_KEY);
    this.cookiesIndividuService.deleteFromCookies();
  }

  private getIndividuConnected(): Individu {
    if (!this.individuConnected) {
      this.individuConnected = this.cookiesIndividuService.getFromCookies();
    }
    return this.individuConnected;
  }

  private killSessionPeConnectExpiredSoon(): void {
    const poleEmploiIdentityServerDeconnexionURI = this.getPoleEmploiIdentityServerDeconnexionURI();
    if(poleEmploiIdentityServerDeconnexionURI !== null) {
      this.document.location.href = poleEmploiIdentityServerDeconnexionURI;
    }
  }
}
