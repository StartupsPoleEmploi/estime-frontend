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
import { DemandeurEmploiConnecteService } from "@services/utile/demandeur-emploi-connecte.service";

@Injectable({providedIn: 'root'})
export class AuthService {


  private static readonly OIDC_AUTHORIZE_DATA_STORAGE_SESSION_KEY = 'estime.peOIDC.authorizeData';
  private static readonly OIDC_INDIVIDU_ACCESS_TOKEN_STORAGE_SESSION_KEY = 'estime.peOIDC.individuAccessToken';

  private informationsAccessTokenIndividuConnecte: InformationsAccessTokenPeConnect;
  private informationAutorisationOIDC: InformationAutorisationOIDC;
  private isLoggedInChangedSubject = new Subject<boolean>();

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

  completeLogin() {
    return this.authentifierDemandeurEmploi().then(informationsAccessTokenIndividuConnecte => {
        this.informationsAccessTokenIndividuConnecte = informationsAccessTokenIndividuConnecte;
        this.sessionStorageService.store(AuthService.OIDC_INDIVIDU_ACCESS_TOKEN_STORAGE_SESSION_KEY, informationsAccessTokenIndividuConnecte);
        this.demandeurEmploiConnecteService.createDemandeurEmploiConnecte();
        this.isLoggedInChangedSubject.next(true);
        return informationsAccessTokenIndividuConnecte;
    });
  }

  isLoggedIn():boolean {
    if(!this.informationsAccessTokenIndividuConnecte) {
      this.informationsAccessTokenIndividuConnecte =  this.sessionStorageService.retrieve(AuthService.OIDC_INDIVIDU_ACCESS_TOKEN_STORAGE_SESSION_KEY);
    }
    return !!this.informationsAccessTokenIndividuConnecte;
  }


  logout() {
    this.sessionStorageService.clear(DemandeurEmploiConnecteService.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
    this.sessionStorageService.clear(AuthService.OIDC_AUTHORIZE_DATA_STORAGE_SESSION_KEY);
    this.sessionStorageService.clear(AuthService.OIDC_INDIVIDU_ACCESS_TOKEN_STORAGE_SESSION_KEY);
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
    this.informationAutorisationOIDC =  this.sessionStorageService.retrieve(AuthService.OIDC_AUTHORIZE_DATA_STORAGE_SESSION_KEY);
    this.informationAutorisationOIDC.code = this.activatedRoute.snapshot.queryParams.code;
    if(this.activatedRoute.snapshot.queryParams.state === this.informationAutorisationOIDC.state) {
      return this.estimeApiService.authentifier(this.informationAutorisationOIDC);
    } else {
      this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
    }
  }

  private createOidcAuthorizeInformation() {
    this.informationAutorisationOIDC = new InformationAutorisationOIDC(
      this.environment.oidcClientId,
      '',
      this.generateRandomValue(),
      `${this.environment.oidcRedirectURI}signin-callback`,
      this.generateRandomValue()
    );
    this.sessionStorageService.store(AuthService.OIDC_AUTHORIZE_DATA_STORAGE_SESSION_KEY, this.informationAutorisationOIDC);
  }




}
