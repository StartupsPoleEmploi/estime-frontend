import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ScreenService {

  isExtraSmallScreenDevice: boolean;
  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;

  constructor() {
    this.checkIsExtraSmallScreen();
    this.gererResizeScreen();
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }

  public isScreenInferieur(size: number): boolean {
    const widthScreen = window.innerWidth;
    return widthScreen < size;
  }

  public isExtraSmallScreen(): boolean {
    return this.isExtraSmallScreenDevice;
  }


  private gererResizeScreen(): void {
    this.resizeObservable = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObservable.subscribe(evt => {
      this.isExtraSmallScreenDevice = this.checkIsExtraSmallScreen();
    })
  }

  private checkIsExtraSmallScreen(): boolean {
    const widthScreen = Number(window.innerWidth);
    return widthScreen < 768;
  }
}