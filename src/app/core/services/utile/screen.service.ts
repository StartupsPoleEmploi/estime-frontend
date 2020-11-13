import { Injectable } from '@angular/core';


@Injectable({providedIn: 'root'})
export class ScreenService {

  sizeScreenMaxSmartphone = 1023;

  constructor() {
  }

  public isOnSmartphone(): boolean {
    const widthScreen = window.innerWidth;
    return widthScreen < this.sizeScreenMaxSmartphone;
  }

}