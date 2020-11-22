import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { PeConnectAuthorization } from "@models/pe-connect-authorization";
import { KeysStorageEnum } from "@enumerations/keys-storage.enum";

@Injectable({providedIn: 'root'})
export class CookiesPeConnectAuthorizationService {

  constructor(
    private cookieService: CookieService
  ) {

  }

  public saveInCookies(peConnectAuthorization: PeConnectAuthorization): void {
    const dateTokenExpired = this.getDateTokenExpired();
    this.cookieService.set(KeysStorageEnum.PE_CONNECT_AUTHORIZATION, JSON.stringify(peConnectAuthorization), {expires: dateTokenExpired});
  }

  public getFromCookies(): PeConnectAuthorization  {
    let peConnectAuthorisation = null;
    const peConnectAuthorisationString = this.cookieService.get(KeysStorageEnum.PE_CONNECT_AUTHORIZATION);
    if(peConnectAuthorisationString) {
      peConnectAuthorisation = JSON.parse(peConnectAuthorisationString);
    }
    return peConnectAuthorisation;
  }

  public deleteFromCookies(): void {
    this.cookieService.delete(KeysStorageEnum.PE_CONNECT_AUTHORIZATION);
  }

  private getDateTokenExpired(): Date {
    const dateNow = new Date();
    //TODO jla à adapter en fonction du temps d'expiration du token Pe Connect
    dateNow.setMinutes(dateNow.getMinutes() + 60);
    return dateNow;
  }
}