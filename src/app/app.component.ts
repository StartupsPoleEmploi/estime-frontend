import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
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
  subscriptionPopstateEventObservable: Subscription;

  constructor(
    private router: Router,
    private screenService: ScreenService,
    private renderer: Renderer2,
    private sessionStorageEstimeService: SessionStorageEstimeService,
    private route: ActivatedRoute
  ) {
    this.subscribeRouteNavigationEndObservable();
    this.subscribeTrafficSourceObservable();
    this.subscribePopstateEventObservable();
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



  /** Subscription
   *
   * Permet d'observer les évenements de router et notamment les événements type "popstate" qui concernent les retours en arrière du navigateur
   * Si le retour en arrière pointe vers la route /signin-callback, on le redirige vers la homepage
   *
   * Permet de régler le soucis de l'appel à l'authentification côté backend au retour à l'arrière générant des erreurs 400
   * en évitant d'utiliser deux fois le même code de récupération d'access_token
   */
  private subscribePopstateEventObservable(): void {
    this.subscriptionPopstateEventObservable = this.router.events.subscribe(routerEvent => {
      if (routerEvent instanceof NavigationStart) {
        if (routerEvent.navigationTrigger === "popstate") {
          if (routerEvent.url.split('?')[0] == `/${RoutesEnum.SIGNIN_CALLBACK}`) {
            this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
          }
        }
      }
    });
  }
}
