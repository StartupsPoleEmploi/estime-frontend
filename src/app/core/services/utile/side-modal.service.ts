import { Injectable, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Injectable({ providedIn: 'root' })
export class SideModalService {

    public modalRefAide: BsModalRef;
    public modalRefMois: BsModalRef;
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

    openSideModalAide(template: TemplateRef<any>) {
        const modalClasses = 'gray modal-lg full-height-modal side-modal';
        this.modalRefAide = this.modalService.show(template,
            Object.assign({}, { class: modalClasses }));
    }

    openSideModalMois(template: TemplateRef<any>) {
        const modalClasses = 'gray modal-lg full-height-modal side-modal';
        this.modalRefMois = this.modalService.show(template,
            Object.assign({}, { class: modalClasses }));
    }

    closeSideModalAide() {
        this.modalRefAide.hide();
    }

    closeSideModalMois() {
        this.modalRefMois.hide();
    }
}