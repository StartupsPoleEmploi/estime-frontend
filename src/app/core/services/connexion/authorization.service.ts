import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CodesMessagesErreurEnum } from '@app/commun/enumerations/codes-messages-erreur.enum';
import { KeysStorageEnum } from '@app/commun/enumerations/keys-storage.enum';
import { Environment } from '@app/commun/models/environment';
import { EstimeApiService } from "@app/core/services/estime-api/estime-api.service";
import { SessionStorageEstimeService } from "@app/core/services/storage/session-storage-estime.service";
import { MessagesErreurEnum } from "@enumerations/messages-erreur.enum";
import { RoutesEnum } from '@enumerations/routes.enum';
import { Individu } from '@models/individu';
import { MessageErreur } from "@models/message-erreur";
import { CookieService } from 'ngx-cookie-service';
import { CookiesEstimeService } from '../storage/cookies-estime.service';
import { IndividuConnectedService } from './individu-connected.service';
import { PeConnectService } from './pe-connect.service';
import { SessionPeConnectExpiredService } from './session-pe-connect-expired.service';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {

  private messageErreur: MessageErreur;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private cookiesEstimeService: CookiesEstimeService,
    private environment: Environment,
    private estimeApiService: EstimeApiService,
    private individuConnectedService: IndividuConnectedService,
    private peConnectService: PeConnectService,
    private router: Router,
    private sessionPeConnectExpiredService: SessionPeConnectExpiredService,
    private sessionStorageEstimeService: SessionStorageEstimeService) {
  }

  public completeLogin(): Promise<Individu> {
    return this.authentifierIndividu().then(
      (individu) => {
        if(!this.environment.production) {
          this.creerCookieUserAgentLocalhost();
        }
        this.individuConnectedService.saveIndividuConnected(individu);
        if(individu.populationAutorisee) {
          this.sessionPeConnectExpiredService.startCheckUserInactivity(individu.peConnectAuthorization.expireIn);
        } else {
          this.peConnectService.logout();
        }
        return individu;
      }, (httpErrorResponse) => {
        this.traiterErrorAuthentifierIndividu(httpErrorResponse);
        return Promise.reject();
      }
    );
  }

  public completeLogout(): void {
    this.router.navigate([RoutesEnum.HOMEPAGE]);
    const individuConnected = this.cookiesEstimeService.getIndividuConnected();
    if(!individuConnected.populationAutorisee) {
      this.messageErreur = new MessageErreur();
      this.messageErreur.code = CodesMessagesErreurEnum.INDIVIDU_NON_BENEFICIAIRE_MINIMA_SOCIAUX;
      this.messageErreur.message = MessagesErreurEnum.POPULATION_NON_AUTORISEE;
    }
    this.individuConnectedService.emitIndividuConnectedLogoutEvent();
    this.cookiesEstimeService.clear();
    if(!this.environment.production) {
      this.deleteCookieUserAgentLocalhost();
    }
  }

  public getMessageErreur(): MessageErreur {
    return this.messageErreur;
  }


  /*********************************** private methods **************************************************/

  private authentifierIndividu(): Promise<Individu> {
    const peConnectPayload = this.sessionStorageEstimeService.getPayloadPeConnect();
    peConnectPayload.code = this.activatedRoute.snapshot.queryParams.code;
    if (this.activatedRoute.snapshot.queryParams.state === peConnectPayload.state) {
      return this.estimeApiService.authentifier(peConnectPayload);
    } else {
      this.router.navigate([RoutesEnum.HOMEPAGE]);
    }
  }

  private creerCookieUserAgentLocalhost(): void {
    this.cookieService.set(KeysStorageEnum.PE_CONNECT_USER_BADGE, "user_localhost");
  }

  private deleteCookieUserAgentLocalhost(): void {
    this.cookieService.delete(KeysStorageEnum.PE_CONNECT_USER_BADGE);
  }

  private traiterErrorAuthentifierIndividu(httpErrorResponse) {
    this.messageErreur = new MessageErreur();
    if (httpErrorResponse.error && httpErrorResponse.error.code) {
      this.messageErreur.code = httpErrorResponse.error.code;
      this.messageErreur.message = httpErrorResponse.error.message;
    } else {
      this.messageErreur.message = MessagesErreurEnum.CONNEXION_ESTIME_IMPOSSIBLE;
    }
  }
}
