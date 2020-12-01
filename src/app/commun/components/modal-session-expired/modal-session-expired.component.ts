import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PeConnectService } from "@app/core/services/connexion/pe-connect.service";
import { SessionStorageEstimeService } from "@app/core/services/storage/session-storage-estime.service";
import { CookiesEstimeService } from "@app/core/services/storage/cookies-estime.service";
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { IndividuConnectedService } from '@app/core/services/connexion/individu-connected.service';

@Component({
  selector: 'app-modal-session-expired',
  templateUrl: './modal-session-expired.component.html',
  styleUrls: ['./modal-session-expired.component.scss']
})
export class ModalSessionExpiredComponent implements OnInit {

  closeBtnName: string;

  constructor(
    private bsModalRef: BsModalRef,
    private cookiesEstimeService: CookiesEstimeService,
    private individuConnectedService: IndividuConnectedService,
    private peConnectService: PeConnectService,
    private sessionStorageEstimeService: SessionStorageEstimeService,
    private router: Router
  ) {

  }

  ngOnInit() {
  }

  public onClickButtonClosePopup(): void {
    this.bsModalRef.hide();
    this.individuConnectedService.emitIndividuConnectedLogoutEvent();

    //au cas ou la session ne serait pas encore expirée, cela ne devrait pas arriver :)
    this.peConnectService.logout();

    this.sessionStorageEstimeService.clear();
    this.cookiesEstimeService.clear();
    this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
  }

  public onClickButtonSeConnecterAvecPE(): void {
    this.peConnectService.login();
  }

}
