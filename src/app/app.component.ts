import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoutesEnum } from './commun/enumerations/routes.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isDisplayFilAriane: boolean;
  subscriptionRouteNavigationEndObservable: Subscription;

  constructor(
    private router: Router
  ) {
    this.subscribeRouteNavigationEndObservable();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscriptionRouteNavigationEndObservable.unsubscribe();
  }

  private subscribeRouteNavigationEndObservable(): void {
    this.subscriptionRouteNavigationEndObservable = this.router.events.subscribe((routerEvent) => {
      if(routerEvent instanceof NavigationEnd) {
        this.isDisplayFilAriane = routerEvent.url !== RoutesEnum.HOMEPAGE;
      }
    });
  }
}
