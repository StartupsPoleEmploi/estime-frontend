import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IndividuConnectedService } from '@app/core/services/connexion/individu-connected.service';
import { PeConnectService } from '@app/core/services/connexion/pe-connect.service';
import { RoutesEnum } from '@enumerations/routes.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isHomepage = false;
  isPageResultat = false;
  subscriptionStatutIndividuChangedObservable: Subscription;
  subscriptionRouteNavigationEndObservable: Subscription;

  constructor(
    public individuConnectedService: IndividuConnectedService,
    private peConnectService: PeConnectService,
    private router: Router
  ) {
    this.subscribeRouteNavigationEndObservable();
  }

  ngOnDestroy(): void {
    this.subscriptionStatutIndividuChangedObservable.unsubscribe();
    this.subscriptionRouteNavigationEndObservable.unsubscribe();
  }

  public logout(): void {
    this.peConnectService.logout();
  }

  public login(): void {
    this.peConnectService.login();
  }

  public onClickLogoEstime(): void {
    this.router.navigate([RoutesEnum.HOMEPAGE]);
  }

  private subscribeRouteNavigationEndObservable(): void {
    this.subscriptionRouteNavigationEndObservable = this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        this.isHomepage = routerEvent.url.split('?')[0] === RoutesEnum.HOMEPAGE;
      }
      if (routerEvent instanceof NavigationEnd) {
        this.isPageResultat = routerEvent.url.split('?')[0] === `/${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.RESULTAT_SIMULATION}`
          || routerEvent.url.split('?')[0] === `/${RoutesEnum.PARCOURS_COMPLEMENT_ARE}/${RoutesEnum.RESULTAT_SIMULATION}`;
      }
    });
  }
}
