import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstimeApiService } from "@app/core/services/estime-api/estime-api.service";
import { SessionStorageEstimeService } from "@app/core/services/storage/session-storage-estime.service";
import { MessagesErreurEnum } from "@enumerations/messages-erreur.enum";
import { RoutesEnum } from '@enumerations/routes.enum';
import { Individu } from '@models/individu';
import { MessageErreur } from "@models/message-erreur";
import { IndividuConnectedService } from './individu-connected.service';
import { SessionPeConnectExpiredService } from './session-pe-connect-expired.service';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {

  private messageErreur: MessageErreur;

  constructor(
    private activatedRoute: ActivatedRoute,
    private estimeApiService: EstimeApiService,
    private individuConnectedService: IndividuConnectedService,
    private router: Router,
    private sessionPeConnectExpiredService: SessionPeConnectExpiredService,
    private sessionStorageEstimeService: SessionStorageEstimeService) {
  }

  public completeLogin(): Promise<void> {
    return this.authentifierIndividu().then(
      (indidivu) => {
        this.individuConnectedService.saveIndividuConnected(indidivu);
        this.sessionPeConnectExpiredService.startCheckUserInactivity(indidivu.peConnectAuthorization.expireIn);
      }, (httpErrorResponse) => {
        this.traiterErrorAuthentifierIndividu(httpErrorResponse);
        return Promise.reject();
      }
    );
  }

  public completeLogout(): void {
    this.individuConnectedService.emitIndividuConnectedLogoutEvent();
    this.router.navigate([RoutesEnum.HOMEPAGE]);
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
