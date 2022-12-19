import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { RoutesEnum } from "@enumerations/routes.enum";
import { Subscription } from 'rxjs';
import { PageTitleEnum } from './commun/enumerations/page-title.enum';
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
  }

  private subscribeRouteNavigationEndObservable(): void {
    this.subscriptionRouteNavigationEndObservable = this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        const currentURL = routerEvent.url.split('?')[0];
        this.isDisplayFilAriane = currentURL !== RoutesEnum.STATS
          && currentURL !== RoutesEnum.HOMEPAGE
          && currentURL !== `/${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.RESULTAT_SIMULATION}`
          && currentURL !== `/${RoutesEnum.PARCOURS_COMPLEMENT_ARE}/${RoutesEnum.RESULTAT_SIMULATION}`;
        if ((currentURL === `/${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.RESULTAT_SIMULATION}`
          || currentURL === `/${RoutesEnum.PARCOURS_COMPLEMENT_ARE}/${RoutesEnum.RESULTAT_SIMULATION}`)
          && this.screenService.isExtraSmallScreen()) {
          this.renderer.addClass(document.body, 'body-with-sticky-footer');
        } else {
          this.renderer.removeClass(document.body, 'body-with-sticky-footer');
        }
        this.handleFirstFocusableElement(currentURL);
      }
    });
  }

  private handleFirstFocusableElement(url: string) {
    let title = "";
    switch (url) {
      case '/':
        title = `${PageTitleEnum.CHOIX_SIMULATION} ${PageTitleEnum.SUFFIX}`
        break;
      case `/${RoutesEnum.SIGNIN_CALLBACK}`:
        title = `${PageTitleEnum.SIGNIN_CALLBACK} ${PageTitleEnum.SUFFIX}`
        break;
      case `/${RoutesEnum.STATS}`:
        title = `${PageTitleEnum.STATS} ${PageTitleEnum.SUFFIX}`
        break;
      case `/${RoutesEnum.NOT_FOUND}`:
        title = `${PageTitleEnum.NOT_FOUND} ${PageTitleEnum.SUFFIX}`
        break;
      case `/${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.AVANT_COMMENCER_SIMULATION}`:
        title = `${PageTitleEnum.AVANT_COMMENCER_SIMULATION} ${PageTitleEnum.SUFFIX}`
        break;
      case `/${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.CONTRAT_TRAVAIL}`:
        title = `${PageTitleEnum.CONTRAT_TRAVAIL} ${PageTitleEnum.SUFFIX}`
        break;
      case `/${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.SITUATION}`:
        title = `${PageTitleEnum.SITUATION} ${PageTitleEnum.SUFFIX}`
        break;
      case `/${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.PERSONNES_A_CHARGE}`:
        title = `${PageTitleEnum.PERSONNES_A_CHARGE} ${PageTitleEnum.SUFFIX}`
        break;
      case `/${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.RESSOURCES_ACTUELLES}`:
        title = `${PageTitleEnum.RESSOURCES_ACTUELLES} ${PageTitleEnum.SUFFIX}`
        break;
      case `/${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.RESULTAT_SIMULATION}`:
        title = `${PageTitleEnum.RESULTAT_SIMULATION} ${PageTitleEnum.SUFFIX}`
        break;
      case `/${RoutesEnum.PARCOURS_COMPLEMENT_ARE}/${RoutesEnum.SITUATION}`:
        title = `${PageTitleEnum.SITUATION_PARCOURS_COMPLEMENT_ARE} ${PageTitleEnum.SUFFIX}`
        break;
      case `/${RoutesEnum.PARCOURS_COMPLEMENT_ARE}/${RoutesEnum.ACTIVITE_REPRISE}`:
        title = `${PageTitleEnum.ACTIVITE_REPRISE_PARCOURS_COMPLEMENT_ARE} ${PageTitleEnum.SUFFIX}`
        break;
      case `/${RoutesEnum.PARCOURS_COMPLEMENT_ARE}/${RoutesEnum.RESULTAT_SIMULATION}`:
        title = `${PageTitleEnum.RESULTAT_SIMULATION_PARCOURS_COMPLEMENT_ARE} ${PageTitleEnum.SUFFIX}`
        break;
    }
    this.renderer.appendChild(this.renderer.selectRootElement("#firstFocusableElement"), this.renderer.createText(title));
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
