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

    openModal(template: TemplateRef<any>, isFullHeight: boolean = false) {
        const modalClasses = isFullHeight ? 'gray modal-lg full-height-modal not-side-modal' : 'gray modal-lg not-side-modal';
        this.modalRef = this.modalService.show(template,
            Object.assign({}, { class: modalClasses }));
    }

    openModalOnEvent(event: Event, template: TemplateRef<any>, isFullHeight: boolean = false) {
        event.preventDefault();
        this.openModal(template, isFullHeight);
    }
}