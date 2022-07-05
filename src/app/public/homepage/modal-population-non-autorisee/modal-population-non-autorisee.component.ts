import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-population-non-autorisee',
  templateUrl: './modal-population-non-autorisee.component.html',
  styleUrls: ['./modal-population-non-autorisee.component.scss']
})
export class ModalPopulationNonAutoriseeComponent {

  constructor(public bsModalRef: BsModalRef) { }

  public onClickButtonClosePopup(): void {
    this.bsModalRef.hide();
  }
}
