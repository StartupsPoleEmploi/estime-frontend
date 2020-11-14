import { Component, OnInit, Input } from '@angular/core';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { Observable, Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-item-ressource-actuelle',
  templateUrl: './item-ressource-actuelle.component.html',
  styleUrls: ['./item-ressource-actuelle.component.scss']
})
export class ItemRessourceActuelleComponent implements OnInit {

  isOnSmartphone: boolean;
  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;

  @Input() codeRessource: string;
  @Input() isAideSocialSelected: boolean;
  @Input() isColPictoArrowDisplay: boolean;
  @Input() isLastItem: boolean;
  @Input() libelleRessource: string;
  @Input() montantRessource: number;
  @Input() organismeRessource: string;

  constructor(
    private screenService: ScreenService
  ) {
    this.gererResizeScreen();
  }

  ngOnInit(): void {
    this.isOnSmartphone = this.screenService.isOnSmartphone();
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }

  private gererResizeScreen(): void {
    this.resizeObservable = fromEvent(window, 'resize')
    this.resizeSubscription = this.resizeObservable.subscribe( evt => {
      this.isOnSmartphone = this.screenService.isOnSmartphone();
    })
  }

}
