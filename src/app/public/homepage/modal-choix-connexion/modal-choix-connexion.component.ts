import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { IndividuConnectedService } from '@app/core/services/connexion/individu-connected.service';
import { PeConnectService } from '@app/core/services/connexion/pe-connect.service';
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
    private sessionStorageEstimeService: SessionStorageEstimeService,
    private router: Router,
    public bsModalRef: BsModalRef,
    public screenService: ScreenService) { }

  public onClickButtonClosePopup(): void {
    this.bsModalRef.hide();
  }

  public onClickButtonSeConnecter(): void {
    if (this.individuConnectedService.isLoggedIn()) this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
    else this.peConnectService.login();
  }

  public onClickButtonContinuerSansConnexion(): void {
    this.bsModalRef.hide();
    this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
  }
}
