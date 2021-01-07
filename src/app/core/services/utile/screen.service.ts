import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ScreenService {

  sizeScreenSmallScreen = 1023;
  sizeExtraSmallScreen = 576;
  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;

  constructor() {
    this.gererResizeScreen();
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }

  public isScreenInferieur(size: number): boolean {
    const widthScreen = window.innerWidth;
    return widthScreen < size;
  }

  public isSmallScreen(): boolean {
    const widthScreen = window.innerWidth;
    return widthScreen < this.sizeScreenSmallScreen;
  }

  public isExtraSmallScreen(): boolean {
    const widthScreen = window.innerWidth;
    return widthScreen < this.sizeExtraSmallScreen;
  }


  private gererResizeScreen(): void {
    this.resizeObservable = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObservable.subscribe(evt => {})
  }
}