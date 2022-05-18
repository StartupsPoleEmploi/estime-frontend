import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScreenService {

  isExtraSmallScreenDevice: boolean;
  isTabletScreenDevice: boolean;
  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;
  sizeMinTabletScreen = 768;
  sizeMinDesktopScreen = 992;

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
    this.isExtraSmallScreenDevice = this.checkIsExtraSmallScreen();
    return this.isExtraSmallScreenDevice;
  }

  public isTabletScreen(): boolean {
    this.isTabletScreenDevice = this.checkIsTabletScreen();
    return this.isTabletScreenDevice;
  }

  public isButtonSticky(scrollPosition: number, screenPositionOffset): boolean {
    return (scrollPosition > screenPositionOffset)
  }


  private gererResizeScreen(): void {
    this.resizeObservable = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObservable.subscribe(() => {
      this.isExtraSmallScreenDevice = this.checkIsExtraSmallScreen();
      this.isTabletScreenDevice = this.checkIsTabletScreen();
    })
  }

  private checkIsExtraSmallScreen(): boolean {
    const widthScreen = Number(window.innerWidth);
    return widthScreen < this.sizeMinTabletScreen;
  }

  private checkIsTabletScreen(): boolean {
    const widthScreen = Number(window.innerWidth);
    return widthScreen >= this.sizeMinTabletScreen && widthScreen < this.sizeMinDesktopScreen;
  }
}