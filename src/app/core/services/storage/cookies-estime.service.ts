import { Injectable } from '@angular/core';
import { Individu } from '@models/individu';
import { KeysStorageEnum } from "@enumerations/keys-storage.enum";
import { CookieService } from 'ngx-cookie-service';

@Injectable({providedIn: 'root'})
export class CookiesEstimeService {

  constructor(
    private cookieService: CookieService
  ) {

  }

  public storeIndividuConnecte(individu: Individu): void {
    const dateTokenExpired = this.getDateCookieExpire(individu);
    this.cookieService.set(KeysStorageEnum.PE_CONNECT_INDIVIDU, JSON.stringify(individu), {expires: dateTokenExpired});
  }

  public getIndividuConnected(): Individu  {
    let individu = null;
    const peConnectAuthorisationString = this.cookieService.get(KeysStorageEnum.PE_CONNECT_INDIVIDU);
    if(peConnectAuthorisationString) {
      individu = JSON.parse(peConnectAuthorisationString);
    }
    return individu;
  }

  public clear(): void {
    this.cookieService.delete(KeysStorageEnum.PE_CONNECT_INDIVIDU);
  }

  private getDateCookieExpire(individu: Individu): Date {
    const tokenPeConnectExpireIn = individu.peConnectAuthorization.expireIn;

    //on enlève 3min pour refaire une demande avant l'expiration du token qui obligerait l'utilisateur a se réauthentifier.
    const dureeStorageCookieEnSecond = tokenPeConnectExpireIn - 180;
    const dureeStorageCookieEnMin = dureeStorageCookieEnSecond / 60;

    //création de la date d'expiration du cookie
    const dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() + dureeStorageCookieEnMin);

    return dateNow;
  }
}