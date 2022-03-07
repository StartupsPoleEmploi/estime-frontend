import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { RoutesEnum } from "@enumerations/routes.enum";
import { Subscription } from 'rxjs';
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
  subscriptionPopstateEventObservable: Subscription;

  constructor(
    private router: Router,
    private screenService: ScreenService,
    private renderer: Renderer2
  ) {
    this.subscribeRouteNavigationEndObservable();
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
    this.subscriptionPopstateEventObservable.unsubscribe();
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
      if (routerEvent instanceof NavigationStart && routerEvent.navigationTrigger === "popstate") {
        if (routerEvent.url.split('?')[0] == `/${RoutesEnum.SIGNIN_CALLBACK}`) {
          this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
        }
      }
    });
  }
}
