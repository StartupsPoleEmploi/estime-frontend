import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NiveauMessagesErreurEnum } from '@app/commun/enumerations/niveaux-message-erreur';
import { EstimeApiService } from "@app/core/services/estime-api/estime-api.service";
import { SessionStorageEstimeService } from "@app/core/services/storage/session-storage-estime.service";
import { MessagesErreurEnum } from "@enumerations/messages-erreur.enum";
import { RoutesEnum } from '@enumerations/routes.enum';
import { Individu } from '@models/individu';
import { MessageErreur } from "@app/commun/models/message-erreur";
import { IndividuConnectedService } from './individu-connected.service';
import { PeConnectService } from './pe-connect.service';
import { SessionPeConnectExpiredService } from './session-pe-connect-expired.service';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {

  private messageErreur: MessageErreur;

  constructor(
    private activatedRoute: ActivatedRoute,
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
        this.individuConnectedService.saveIndividuConnected(individu);
        if (individu.populationAutorisee) {
          this.sessionPeConnectExpiredService.startCheckUserInactivity();
        } else {
          this.sessionStorageEstimeService.storeMessageDemandeurEmploiNonAutorise();
          this.peConnectService.logout();
        }
        return individu;
      }, (httpErrorResponse) => {
        this.messageErreur = new MessageErreur();
        this.messageErreur.texte = MessagesErreurEnum.CONNEXION_ESTIME_IMPOSSIBLE;
        this.messageErreur.niveau = NiveauMessagesErreurEnum.ERROR;
        return Promise.reject();
      }
    );
  }

  public getMessageErreur(): MessageErreur {
    const messageErreurDemandeurNonAutorise = this.sessionStorageEstimeService.getMessageDemandeurEmploi();
    if (!this.messageErreur && messageErreurDemandeurNonAutorise) {
      this.messageErreur = messageErreurDemandeurNonAutorise;
      this.sessionStorageEstimeService.clearMessageDemandeurEmploi();
    }
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
}
