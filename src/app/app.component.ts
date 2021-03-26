import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RoutesEnum } from './commun/enumerations/routes.enum';
import { Environment } from './commun/models/environment';
import { PeConnectService } from './core/services/connexion/pe-connect.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isDisplayFilAriane: boolean;
  subscriptionRouteNavigationEndObservable: Subscription;

  constructor(
    private environment: Environment,
    private router: Router,
    private peConnectService: PeConnectService
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
