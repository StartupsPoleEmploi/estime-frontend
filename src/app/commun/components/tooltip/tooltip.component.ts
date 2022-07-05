import { LocationStrategy } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalService } from '@app/core/services/utile/modal.service';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {

  @Input('modalRef') public modalRef: BsModalRef;
  @Input('htmlData') public htmlData: string;

  constructor(
    private location: LocationStrategy,
    private modalService: ModalService) {
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      if (!this.modalService.isOpen) this.location.back();
    });
  }
}
