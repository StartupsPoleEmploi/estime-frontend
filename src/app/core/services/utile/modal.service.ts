import { Injectable, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Injectable({ providedIn: 'root' })
export class ModalService {

    public modalRef: BsModalRef;
    public isOpen: boolean = false;

    constructor(
        private modalService: BsModalService
    ) { }

    openModal(event: Event, template: TemplateRef<any>) {
        event.preventDefault();
        this.modalRef = this.modalService.show(template,
            Object.assign({}, { class: 'gray modal-lg' }));
        this.modalRef.onHide.subscribe((reason: string | any) => {
            this.isOpen = false;
        });
        this.isOpen = true;
    }
}