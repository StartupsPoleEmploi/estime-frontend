import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { RoutesEnum } from "@enumerations/routes.enum";
import { Subscription } from 'rxjs';
import { SessionStorageEstimeService } from './core/services/storage/session-storage-estime.service';
import { ScreenService } from './core/services/utile/screen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isLazyModulesLoading: boolean;
  isDisplayFilAriane: boolean;
  subscriptionRouteNavigationEndObservable: Subscription;
  subscriptionTrafficSourceObservable: Subscription;

  constructor(
    private router: Router,
    private screenService: ScreenService,
    private renderer: Renderer2,
    private sessionStorageEstimeService: SessionStorageEstimeService,
    private route: ActivatedRoute
  ) {
    this.subscribeRouteNavigationEndObservable();
    this.subscribeTrafficSourceObservable();
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.isLazyModulesLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLazyModulesLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptionRouteNavigationEndObservable.unsubscribe();
  }

  private subscribeRouteNavigationEndObservable(): void {
    this.subscriptionRouteNavigationEndObservable = this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        this.isDisplayFilAriane = routerEvent.url.split('?')[0] !== RoutesEnum.HOMEPAGE
          && routerEvent.url.split('?')[0] !== `/${RoutesEnum.ETAPES_SIMULATION}/${RoutesEnum.RESULTAT_SIMULATION}`;
        if ((routerEvent.url.split('?')[0] === RoutesEnum.HOMEPAGE
          || routerEvent.url.split('?')[0] === `/${RoutesEnum.ETAPES_SIMULATION}/${RoutesEnum.RESULTAT_SIMULATION}`)
          && this.screenService.isExtraSmallScreen()) {
          this.renderer.addClass(document.body, 'body-with-sticky-footer');
        } else {
          this.renderer.removeClass(document.body, 'body-with-sticky-footer');
        }
      }
    });
  }

  private subscribeTrafficSourceObservable(): void {
    this.subscriptionTrafficSourceObservable = this.route.queryParams.subscribe(params => {
      const trafficSource = params.at_campaign;
      if (params.at_campaign) {
        if (typeof params.at_campaign === 'string') {
          this.sessionStorageEstimeService.storeTrafficSource(trafficSource);
        } else {
          this.sessionStorageEstimeService.storeTrafficSource(trafficSource.join(', '));
        }
      }
    });
  }
}
