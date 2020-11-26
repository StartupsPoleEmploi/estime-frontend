import { Injectable } from '@angular/core';
import { Individu } from '@app/commun/models/individu';
import { KeysStorageEnum } from "@enumerations/keys-storage.enum";
import { CookieService } from 'ngx-cookie-service';

@Injectable({providedIn: 'root'})
export class CookiesIndividuService {

  readonly dureeStorageCookieEnMin = 15;

  constructor(
    private cookieService: CookieService
  ) {

  }

  public saveInCookies(individu: Individu): void {
    const dateTokenExpired = this.getDateTokenExpired();
    this.cookieService.set(KeysStorageEnum.PE_CONNECT_INDIVIDU, JSON.stringify(individu), {expires: dateTokenExpired});
  }

  public getFromCookies(): Individu  {
    let individu = null;
    const peConnectAuthorisationString = this.cookieService.get(KeysStorageEnum.PE_CONNECT_INDIVIDU);
    if(peConnectAuthorisationString) {
      individu = JSON.parse(peConnectAuthorisationString);
    }
    return individu;
  }

  public deleteFromCookies(): void {
    this.cookieService.delete(KeysStorageEnum.PE_CONNECT_INDIVIDU);
  }

  /**
   * Retourne date du jour + 15 minutes. 15 minutes correspondant à la durée de validité des tokens PE Connect.
   */
  private getDateTokenExpired(): Date {
    const dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() + this.dureeStorageCookieEnMin);
    return dateNow;
  }
}