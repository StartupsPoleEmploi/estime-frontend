import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SessionStorageService } from "ngx-webstorage";
import { Environment } from '@models/environment';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { DonneesAutorisationOIDC } from '@models/donnees-autorisation-oidc';
import { RoutesEnum } from '@enumerations/routes.enum';
import { DemandeurEmploiService } from "@services/estime-api/demandeur-emploi.service";

@Injectable({providedIn: 'root'})
export class AuthService {

  private demandeurEmploiConnecte: DemandeurEmploi;
  private donneesAutorisationOIDC: DonneesAutorisationOIDC;
  private isLoggedInChangedSubject = new Subject<boolean>();

  loginChanged = this.isLoggedInChangedSubject.asObservable();

  private static readonly OIDC_AUTHORIZE_DATA_STORAGE_SESSION_KEY = 'oidc.authorizeData';
  private static readonly DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY = 'application.demandeurEmploiConnecte';

  constructor(private activatedRoute: ActivatedRoute,
              @Inject(DOCUMENT) private document: Document,
              private demandeurEmploiService: DemandeurEmploiService,
              private environment: Environment,
              private router: Router,
              private sessionStorageService: SessionStorageService) {
  }

  login() {
    this.createOidcAuthorizeInformation();
    this.document.location.href = this.getPoleEmploiIdentityServerConnexionURI();
  }

  completeLogin() {
    return this.authentifierDemandeurEmploi().then(demandeurEmploi => {
        this.demandeurEmploiConnecte = demandeurEmploi;
        this.isLoggedInChangedSubject.next(true);
        this.sessionStorageService.store(AuthService.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY, this.demandeurEmploiConnecte);
        return demandeurEmploi;
    });
  }

  logout() {
    this.sessionStorageService.clear(AuthService.OIDC_AUTHORIZE_DATA_STORAGE_SESSION_KEY);
    this.sessionStorageService.clear(AuthService.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
    this.document.location.href = this.getPoleEmploiIdentityServerDeconnexionURI();
  }

  completeLogout() {
    this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
  }

  isLoggedIn():boolean {
    this.demandeurEmploiConnecte =  this.sessionStorageService.retrieve(AuthService.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
    this.isLoggedInChangedSubject.next(true);
    return !!this.demandeurEmploiConnecte;
  }

  getDemandeurEmploiConnecte(): DemandeurEmploi {
    return this.demandeurEmploiConnecte;
  }

  private getPoleEmploiIdentityServerConnexionURI():string  {
    return `${this.environment.oidcPoleEmploiIdentityServerURL}/connexion/oauth2/authorize?` +
    'realm=%2Findividu&response_type=code' +
    `&client_id=${this.donneesAutorisationOIDC.clientId}` +
    `&scope=${this.environment.oidcScope}` +
    `&redirect_uri=${this.donneesAutorisationOIDC.redirectURI}` +
    `&state=${this.donneesAutorisationOIDC.state}` +
    `&nonce=${this.donneesAutorisationOIDC.nonce}`
    ;
  }

  private getPoleEmploiIdentityServerDeconnexionURI():string  {
    return `${this.environment.oidcPoleEmploiIdentityServerURL}/compte/deconnexion?` +
    `&id_token_hint=${this.demandeurEmploiConnecte.donneesAccessToken.idToken}` +
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
    this.donneesAutorisationOIDC =  this.sessionStorageService.retrieve(AuthService.OIDC_AUTHORIZE_DATA_STORAGE_SESSION_KEY);
    this.donneesAutorisationOIDC.code = this.activatedRoute.snapshot.queryParams.code;
    if(this.activatedRoute.snapshot.queryParams.state === this.donneesAutorisationOIDC.state) {
      return this.demandeurEmploiService.authentifier(this.donneesAutorisationOIDC);
    } else {
      this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
    }
  }

  private createOidcAuthorizeInformation() {
    this.donneesAutorisationOIDC = new DonneesAutorisationOIDC(
      this.environment.oidcClientId,
      '',
      this.generateRandomValue(),
      `${this.environment.oidcRedirectURI}signin-callback`,
      this.generateRandomValue()
    );

    this.sessionStorageService.store(AuthService.OIDC_AUTHORIZE_DATA_STORAGE_SESSION_KEY, this.donneesAutorisationOIDC);
  }
}
