import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { Individu } from '@app/commun/models/individu';
import { PeConnectPayload } from '@app/commun/models/pe-connect-payload';
import { AuthorizationService } from '@app/core/services/connexion/authorization.service';
import { IndividuConnectedService } from '@app/core/services/connexion/individu-connected.service';
import { PeConnectService } from '@app/core/services/connexion/pe-connect.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { SessionStorageEstimeService } from '@app/core/services/storage/session-storage-estime.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-choix-connexion',
  templateUrl: './modal-choix-connexion.component.html',
  styleUrls: ['./modal-choix-connexion.component.scss']
})
export class ModalChoixConnexionComponent {

  isPageLoadingDisplay: boolean = false;

  @Output() notifyParent: EventEmitter<any> = new EventEmitter();

  constructor(
    private peConnectService: PeConnectService,
    private individuConnectedService: IndividuConnectedService,
    private router: Router,
    public bsModalRef: BsModalRef,
    public screenService: ScreenService,
    private estimeApiService: EstimeApiService,
    private sessionStorageEstimeService: SessionStorageEstimeService) { }

  public onClickButtonClosePopup(): void {
    this.bsModalRef.hide();
  }

  public authentifierSansConnexion(): void {
    const trafficSource = this.sessionStorageEstimeService.getTrafficSource();
    this.estimeApiService.authentifier(null, trafficSource).subscribe({
      next: this.traiterRetourAuthentifierIndividu.bind(this),
      error: this.traiterErreurAuthentifierIndividu.bind(this)
    });

  }

  private traiterRetourAuthentifierIndividu(individu: Individu): void {
    this.isPageLoadingDisplay = false;
    this.individuConnectedService.saveIndividuConnected(individu);
    this.bsModalRef.hide();
    this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
  }

  private traiterErreurAuthentifierIndividu(): void {
    this.sessionStorageEstimeService.storeMessageDemandeurEmploiConnexionImpossible();
    this.isPageLoadingDisplay = false;
    this.bsModalRef.hide();
    this.notifyParent.emit(MessagesErreurEnum.CONNEXION_ESTIME_IMPOSSIBLE);
    this.router.navigate([RoutesEnum.HOMEPAGE]);
  }

  public onClickButtonSeConnecter(): void {
    if (this.individuConnectedService.isLoggedIn()) this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
    else this.peConnectService.login();
  }

  public onClickButtonContinuerSansConnexion(): void {
    this.authentifierSansConnexion();
  }
}
