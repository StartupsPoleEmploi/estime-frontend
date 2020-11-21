import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstimeApiService } from "@app/core/services/estime-api/estime-api.service";
import { KeysSessionStorageEnum } from "@enumerations/keys-session-storage.enum";
import { MessagesErreurEnum } from "@enumerations/messages-erreur.enum";
import { RoutesEnum } from '@enumerations/routes.enum';
import { Environment } from '@models/environment';
import { InformationsAccessTokenPeConnect } from "@models/informations-access-token-pe-connect";
import { InformationAutorisationOIDC } from '@models/informations-autorisation-oidc';
import { SessionStorageService } from "ngx-webstorage";
import { Subject } from 'rxjs';
import { DeConnecteService } from "@app/core/services/demandeur-emploi-connecte/de-connecte.service";
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { BeneficiaireAidesSociales } from '@app/commun/models/beneficiaire-aides-sociales';
import { MessageErreur } from "@models/message-erreur";

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  private informationsAccessTokenIndividuConnecte: InformationsAccessTokenPeConnect;
  private informationAutorisationOIDC: InformationAutorisationOIDC;
  private isLoggedInChangedSubject = new Subject<boolean>();
  private messageErreur: MessageErreur;

  loginChanged = this.isLoggedInChangedSubject.asObservable();


  constructor(private activatedRoute: ActivatedRoute,
              private deConnecteService: DeConnecteService,
              @Inject(DOCUMENT) private document: Document,
              private estimeApiService: EstimeApiService,
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
      (individu) => {
        this.informationsAccessTokenIndividuConnecte = individu.informationsAccessTokenPeConnect;
        const demandeurEmploiConnecte = this.creerDemandeurEmploiConnecte(individu.beneficiaireAidesSociales);
        this.deConnecteService.setDemandeurEmploiConnecte(demandeurEmploiConnecte);
        this.sessionStorageService.store(KeysSessionStorageEnum.OIDC_INDIVIDU_ACCESS_TOKEN_STORAGE_SESSION_KEY, this.informationsAccessTokenIndividuConnecte);
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

  private creerDemandeurEmploiConnecte(beneficiaireAidesSociales: BeneficiaireAidesSociales): DemandeurEmploi {
    const demandeurEmploiConnecte = new DemandeurEmploi();
    demandeurEmploiConnecte.beneficiaireAidesSociales = beneficiaireAidesSociales;
    return demandeurEmploiConnecte;
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
