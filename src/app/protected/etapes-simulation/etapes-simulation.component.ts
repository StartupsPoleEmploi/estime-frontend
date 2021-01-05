import { Component, OnInit } from '@angular/core';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-etapes-simulation',
  templateUrl: './etapes-simulation.component.html',
  styleUrls: ['./etapes-simulation.component.scss']
})
export class EtapesSimulationComponent implements OnInit {

  etapeActive: number;
  isSmallScreen: boolean;
  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;


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
