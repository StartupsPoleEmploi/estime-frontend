import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SessionStorageService } from "ngx-webstorage";
import { Environment } from '@models/environment';
import { InformationAutorisationOIDC } from '@models/informations-autorisation-oidc';
import { InformationsAccessTokenPeConnect } from "@models/informations-access-token-pe-connect";
import { RoutesEnum } from '@enumerations/routes.enum';
import { EstimeApiService } from "@app/core/services/estime-api/estime-api.service";
import { DemandeurEmploiConnecteService } from "@app/core/services/utile/demandeur-emploi-connecte.service";
import { KeysSessionStorageEnum } from "@enumerations/keys-session-storage.enum";
import { MessagesErreurEnum } from "@enumerations/messages-erreur.enum";

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  private informationsAccessTokenIndividuConnecte: InformationsAccessTokenPeConnect;
  private informationAutorisationOIDC: InformationAutorisationOIDC;
  private isLoggedInChangedSubject = new Subject<boolean>();
  private messageErreur: string;

  loginChanged = this.isLoggedInChangedSubject.asObservable();


  constructor(private activatedRoute: ActivatedRoute,
              @Inject(DOCUMENT) private document: Document,
              private estimeApiService: EstimeApiService,
              private demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
              private environment: Environment,
              private router: Router,
              private sessionStorageService: SessionStorageService) {
  }

  login() {
    this.createOidcAuthorizeInformation();
    this.document.location.href = this.getPoleEmploiIdentityServerConnexionURI();
  }

  completeLogin(): Promise<void> {
    return this.authentifierDemandeurEmploi().then(
      (informationsAccessTokenIndividuConnecte) => {
        this.informationsAccessTokenIndividuConnecte = informationsAccessTokenIndividuConnecte;
        this.sessionStorageService.store(KeysSessionStorageEnum.OIDC_INDIVIDU_ACCESS_TOKEN_STORAGE_SESSION_KEY, informationsAccessTokenIndividuConnecte);
        this.isLoggedInChangedSubject.next(true);
      }, (erreur) => {
        console.log(erreur);
        this.messageErreur = MessagesErreurEnum.CONNEXION_ESTIME_IMPOSSIBLE;
        return Promise.reject();
      }
    );
  }

  getMessageErreur(): string {
    return this.messageErreur;
  }

  isLoggedIn():boolean {
    if(!this.informationsAccessTokenIndividuConnecte) {
      this.informationsAccessTokenIndividuConnecte =  this.sessionStorageService.retrieve(KeysSessionStorageEnum.OIDC_INDIVIDU_ACCESS_TOKEN_STORAGE_SESSION_KEY);
    }
    return !!this.informationsAccessTokenIndividuConnecte;
  }


  logout() {
    this.clearSessionStorage();
    this.document.location.href = this.getPoleEmploiIdentityServerDeconnexionURI();
  }

  completeLogout() {
    this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
  }

  private getPoleEmploiIdentityServerConnexionURI():string  {
    return `${this.environment.oidcPoleEmploiIdentityServerURL}/connexion/oauth2/authorize?` +
    'realm=%2Findividu&response_type=code' +
    `&client_id=${this.informationAutorisationOIDC.clientId}` +
    `&scope=${this.environment.oidcScope}` +
    `&redirect_uri=${this.informationAutorisationOIDC.redirectURI}` +
    `&state=${this.informationAutorisationOIDC.state}` +
    `&nonce=${this.informationAutorisationOIDC.nonce}`
    ;
  }

  private getPoleEmploiIdentityServerDeconnexionURI():string  {
    return `${this.environment.oidcPoleEmploiIdentityServerURL}/compte/deconnexion?` +
    `&id_token_hint=${this.informationsAccessTokenIndividuConnecte.idToken}` +
    `&redirect_uri=${this.environment.oidcRedirectURI}signout-callback`
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
    this.informationAutorisationOIDC =  this.sessionStorageService.retrieve(KeysSessionStorageEnum.OIDC_AUTHORIZE_DATA_STORAGE_SESSION_KEY);
    this.informationAutorisationOIDC.code = this.activatedRoute.snapshot.queryParams.code;
    if(this.activatedRoute.snapshot.queryParams.state === this.informationAutorisationOIDC.state) {
      return this.estimeApiService.authentifier(this.informationAutorisationOIDC);
    } else {
      this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
    }
  }

  private createOidcAuthorizeInformation() {
    this.informationAutorisationOIDC = new InformationAutorisationOIDC();
    this.informationAutorisationOIDC.clientId = this.environment.oidcClientId;
    this.informationAutorisationOIDC.nonce = this.generateRandomValue(),
    this.informationAutorisationOIDC.redirectURI = `${this.environment.oidcRedirectURI}signin-callback`;
    this.informationAutorisationOIDC.state = this.generateRandomValue();

    this.sessionStorageService.store(KeysSessionStorageEnum.OIDC_AUTHORIZE_DATA_STORAGE_SESSION_KEY, this.informationAutorisationOIDC);
  }

  private clearSessionStorage():void {
    this.sessionStorageService.clear(KeysSessionStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
    this.sessionStorageService.clear(KeysSessionStorageEnum.OIDC_AUTHORIZE_DATA_STORAGE_SESSION_KEY);
    this.sessionStorageService.clear(KeysSessionStorageEnum.OIDC_INDIVIDU_ACCESS_TOKEN_STORAGE_SESSION_KEY);
  }


}
