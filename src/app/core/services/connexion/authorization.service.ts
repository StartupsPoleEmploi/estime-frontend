import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstimeApiService } from "@app/core/services/estime-api/estime-api.service";
import { SessionStorageEstimeService } from "@app/core/services/storage/session-storage-estime.service";
import { RoutesEnum } from '@enumerations/routes.enum';
import { Individu } from '@models/individu';
import { MessageErreur } from "@app/commun/models/message-erreur";
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {

  private messageErreur: MessageErreur;

  constructor(
    private activatedRoute: ActivatedRoute,
    private estimeApiService: EstimeApiService,
    private router: Router,
    private sessionStorageEstimeService: SessionStorageEstimeService) {
  }

  public authentifierIndividu(): Observable<Individu> {
    const peConnectPayload = this.sessionStorageEstimeService.getPayloadPeConnect();
    peConnectPayload.code = this.activatedRoute.snapshot.queryParams.code;
    const trafficSource = this.sessionStorageEstimeService.getTrafficSource();
    if (this.activatedRoute.snapshot.queryParams.state === peConnectPayload.state) {
      return this.estimeApiService.authentifier(peConnectPayload, trafficSource);
    } else {
      this.router.navigate([RoutesEnum.HOMEPAGE]);
    }
  }

  public getMessageErreur(): MessageErreur {
    const messageErreurDemandeurNonAutorise = this.sessionStorageEstimeService.getMessageDemandeurEmploi();
    if (!this.messageErreur && messageErreurDemandeurNonAutorise) {
      this.messageErreur = messageErreurDemandeurNonAutorise;
      this.sessionStorageEstimeService.clearMessageDemandeurEmploi();
    }
    return this.messageErreur;
  }
}
