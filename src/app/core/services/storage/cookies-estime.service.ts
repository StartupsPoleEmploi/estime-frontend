import { Injectable } from '@angular/core';
import { KeysStorageEnum } from "@enumerations/keys-storage.enum";
import { CookieService } from 'ngx-cookie-service';
import { Environment } from '@app/commun/models/environment';
import { IndividuConnectePeConnectAuthorization } from "@models/individu-connecte-pe-connect-authorization";

@Injectable({ providedIn: 'root' })
export class CookiesEstimeService {

  constructor(
    private cookieService: CookieService,
    private environment: Environment
  ) {

  }

  public storeIndividuConnectePeConnectAuthorization(individuConnectePeConnectAuthorization: IndividuConnectePeConnectAuthorization): void {
    const dateTokenExpired = this.getDateCookieExpire(individuConnectePeConnectAuthorization.peConnectAuthorization.expireIn);
    if (this.environment.production) {
      //sécurité : store un cookie avec secure à true
      this.cookieService.set(KeysStorageEnum.PE_CONNECT_INDIVIDU, JSON.stringify(individuConnectePeConnectAuthorization), { expires: dateTokenExpired, path: '/', secure: true });
    } else {
      this.cookieService.set(KeysStorageEnum.PE_CONNECT_INDIVIDU, JSON.stringify(individuConnectePeConnectAuthorization), { expires: dateTokenExpired });
    }
    this.cookieService.set(KeysStorageEnum.IS_LOGGED_IN, JSON.stringify(true));
  }

  public getIndividuConnectePeConnectAuthorization(): IndividuConnectePeConnectAuthorization {
    let individu = null;
    const peConnectAuthorisationString = this.cookieService.get(KeysStorageEnum.PE_CONNECT_INDIVIDU);
    if (peConnectAuthorisationString) {
      individu = JSON.parse(peConnectAuthorisationString);
    }
    return individu;
  }

  public isLoggedIn(): boolean {
    const isLoggedIn = this.cookieService.get(KeysStorageEnum.IS_LOGGED_IN);
    if (isLoggedIn && JSON.parse(isLoggedIn)) {
      return this.getIndividuConnectePeConnectAuthorization() !== null;
    }
    return false;
  }

  public clear(): void {
    this.cookieService.delete(KeysStorageEnum.PE_CONNECT_INDIVIDU);
    this.cookieService.delete(KeysStorageEnum.IS_LOGGED_IN);
  }

  private getDateCookieExpire(tokenPeConnectExpireIn: number): Date {

    //on enlève 2min pour refaire une demande avant l'expiration du token qui obligerait l'utilisateur a se réauthentifier.
    const dureeStorageCookieEnSecond = tokenPeConnectExpireIn - 120;
    const dureeStorageCookieEnMin = dureeStorageCookieEnSecond / 60;

    //création de la date d'expiration du cookie
    const dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() + dureeStorageCookieEnMin);

    return dateNow;
  }
}