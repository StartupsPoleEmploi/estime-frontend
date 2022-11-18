import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalService } from '@app/core/services/utile/modal.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { PageTitlesEnum } from "@enumerations/page-titles.enum";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-documents-avant-de-commencer',
  templateUrl: './documents-avant-de-commencer.component.html',
  styleUrls: ['./documents-avant-de-commencer.component.scss']
})
export class DocumentsAvantDeCommencerComponent {

  isPageLoadingDisplay = false;

  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  subscriptionPopstateEventObservable: Subscription;

  @Input() messageErreur: string;
  @Output() accesParcoursToutesAides = new EventEmitter<any>();

  constructor(
    public screenService: ScreenService,
    public modalService: ModalService
  ) {
  }

  public onClickButtonJeContinue(): void {
    this.accesParcoursToutesAides.emit();
  }
}
