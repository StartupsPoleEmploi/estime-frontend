import { Injectable, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Injectable({ providedIn: 'root' })
export class ModalService {

    public modalRef: BsModalRef;
    public isOpen: boolean = false;

    constructor(
        private modalService: BsModalService
    ) {
        this.modalService.onHidden.subscribe(() => {
            this.isOpen = false;
        });
        this.modalService.onShown.subscribe(() => {
            this.isOpen = true;
        });
    }

    openModal(event: Event, template: TemplateRef<any>, isFullHeight: boolean = false) {
        event.preventDefault();
        const modalClasses = isFullHeight ? 'gray modal-lg full-height-modal' : 'gray modal-lg';
        this.modalRef = this.modalService.show(template,
            Object.assign({}, { class: modalClasses }));
    }
}