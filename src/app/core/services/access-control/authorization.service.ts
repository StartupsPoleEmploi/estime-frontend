import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeysStorageEnum } from '@app/commun/enumerations/keys-storage.enum';
import { PeConnectPayload } from '@app/commun/models/pe-connect-payload';
import { CookiesPeConnectAuthorizationService } from "@app/core/services/access-control/cookies-pe-connect-authorization.service";
import { EstimeApiService } from "@app/core/services/estime-api/estime-api.service";
import { MessagesErreurEnum } from "@enumerations/messages-erreur.enum";
import { RoutesEnum } from '@enumerations/routes.enum';
import { Environment } from '@models/environment';
import { MessageErreur } from "@models/message-erreur";
import { SessionStorageService } from "ngx-webstorage";
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthorizationService {

  private peConnectPayload: PeConnectPayload;
  private isLoggedInChangedSubject = new Subject<boolean>();
  private messageErreur: MessageErreur;

  loginChanged = this.isLoggedInChangedSubject.asObservable();


  constructor(private activatedRoute: ActivatedRoute,
              @Inject(DOCUMENT) private document: Document,
              private estimeApiService: EstimeApiService,
              private environment: Environment,
              private cookiesPeConnectAuthorizationService: CookiesPeConnectAuthorizationService,
              private router: Router,
              private sessionStorageService: SessionStorageService) {
  }

  login() {
    this.createPeConnectPayload();
    this.document.location.href = this.getPoleEmploiIdentityServerConnexionURI();
  }

  completeLogin(): Promise<void> {
    return this.authentifierDemandeurEmploi().then(
      (peConnectAuthorization) => {
        this.cookiesPeConnectAuthorizationService.saveInCookies(peConnectAuthorization);
        this.isLoggedInChangedSubject.next(true);
      }, (httpErrorResponse) => {
        console.log(httpErrorResponse.error);
        this.messageErreur = new MessageErreur();
        if(httpErrorResponse.error && httpErrorResponse.error.code) {
          this.messageErreur.code = httpErrorResponse.error.code;
          this.messageErreur.message = httpErrorResponse.error.message;
        } else {
          this.messageErreur.message = MessagesErreurEnum.CONNEXION_ESTIME_IMPOSSIBLE;
        }
        return Promise.reject();
      }
    );
  }

  getMessageErreur(): MessageErreur {
    return this.messageErreur;
  }

  isLoggedIn():boolean {
    return !!this.cookiesPeConnectAuthorizationService.getFromCookies();
  }


  logout() {
    const poleEmploiIdentityServerDeconnexionURI = this.getPoleEmploiIdentityServerDeconnexionURI();
    this.clearSessionStorage();
    this.document.location.href = poleEmploiIdentityServerDeconnexionURI;
  }

  completeLogout() {
    this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
  }

  private getPoleEmploiIdentityServerConnexionURI():string  {
    return `${this.environment.peconnectIdentityServerURL}/connexion/oauth2/authorize?` +
    'realm=%2Findividu&response_type=code' +
    `&client_id=${this.peConnectPayload.clientId}` +
    `&scope=${this.environment.peconnectScope}` +
    `&redirect_uri=${this.peConnectPayload.redirectURI}` +
    `&state=${this.peConnectPayload.state}` +
    `&nonce=${this.peConnectPayload.nonce}`
    ;
  }

  private getPoleEmploiIdentityServerDeconnexionURI():string  {
    const peConnectAuthorization = this.cookiesPeConnectAuthorizationService.getFromCookies();
    return `${this.environment.peconnectIdentityServerURL}/compte/deconnexion?` +
    `&id_token_hint=${peConnectAuthorization.idToken}` +
    `&redirect_uri=${this.environment.peconnectRedirecturi}signout-callback`
    ;
  }

  private generateRandomValue(): string {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let array = new Uint8Array(64);
    window.crypto.getRandomValues(array);
    array = array.map(x => validChars.charCodeAt(x % validChars.length));
    return String.fromCharCode.apply(null, array);
  }

  private authentifierDemandeurEmploi() {
    this.peConnectPayload =  this.sessionStorageService.retrieve(KeysStorageEnum.PE_CONNECT_PAYLOAD_STORAGE_SESSION_KEY);
    this.peConnectPayload.code = this.activatedRoute.snapshot.queryParams.code;
    if(this.activatedRoute.snapshot.queryParams.state === this.peConnectPayload.state) {
      return this.estimeApiService.authentifier(this.peConnectPayload);
    } else {
      this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
    }
  }

  private createPeConnectPayload() {
    this.peConnectPayload = new PeConnectPayload();
    this.peConnectPayload.clientId = this.environment.peconnectClientid;
    this.peConnectPayload.nonce = this.generateRandomValue(),
    this.peConnectPayload.redirectURI = `${this.environment.peconnectRedirecturi}signin-callback`;
    this.peConnectPayload.state = this.generateRandomValue();

    this.sessionStorageService.store(KeysStorageEnum.PE_CONNECT_PAYLOAD_STORAGE_SESSION_KEY, this.peConnectPayload);
  }

  private clearSessionStorage():void {
    this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
    this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION_AIDES_SOCIALE);
    this.sessionStorageService.clear(KeysStorageEnum.PE_CONNECT_PAYLOAD_STORAGE_SESSION_KEY);
    this.cookiesPeConnectAuthorizationService.deleteFromCookies();
  }
}
