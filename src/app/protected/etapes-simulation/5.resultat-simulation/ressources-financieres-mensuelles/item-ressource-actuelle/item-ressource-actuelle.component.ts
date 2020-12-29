import { Component, Input, OnInit } from '@angular/core';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-item-ressource-actuelle',
  templateUrl: './item-ressource-actuelle.component.html',
  styleUrls: ['./item-ressource-actuelle.component.scss']
})
export class ItemRessourceActuelleComponent implements OnInit {

  isSmallScreen: boolean;
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
    this.isSmallScreen = this.screenService.isSmallScreen();
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }

  private gererResizeScreen(): void {
    this.resizeObservable = fromEvent(window, 'resize')
    this.resizeSubscription = this.resizeObservable.subscribe( evt => {
      this.isSmallScreen = this.screenService.isSmallScreen();
    })
  }

}