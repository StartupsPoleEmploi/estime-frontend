import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthorizationService } from '@app/core/services/access-control/authorization.service';
import { SessionExpiredService } from '@app/core/services/access-control/session-expired.service';

@Component({
  selector: 'app-modal-session-expired',
  templateUrl: './modal-session-expired.component.html',
  styleUrls: ['./modal-session-expired.component.scss']
})
export class ModalSessionExpiredComponent implements OnInit {

  closeBtnName: string;

  constructor(
    private authorizationService: AuthorizationService,
    private bsModalRef: BsModalRef
  ) {

  }

  ngOnInit() {
  }

  public onClickButtonClosePopup(): void {
    this.bsModalRef.hide();
    this.authorizationService.logoutAfterSessionExpired();
  }

  public onClickButtonSeConnecterAvecPE(): void {
    this.authorizationService.loginAfterSessionExpired();
  }

}
