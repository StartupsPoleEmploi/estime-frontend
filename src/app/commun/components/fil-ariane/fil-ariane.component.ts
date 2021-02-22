import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fil-ariane',
  templateUrl: './fil-ariane.component.html',
  styleUrls: ['./fil-ariane.component.scss']
})
export class FilArianeComponent implements OnInit {

  libelleRouteActive: string;
  subscriptionRouteNavigationEndObservable: Subscription;

  constructor(
    private router: Router
  ) {
    this.subscribeRouteNavigationEndObservable();
  }

  ngOnInit(): void {
    this.setLibelleRouteActiveSafe(this.router.url);
  }

  ngOnDestroy(): void {
    this.subscriptionRouteNavigationEndObservable.unsubscribe();
  }

  public onClickLinkAccueil(): void {
    this.router.navigate([RoutesEnum.HOMEPAGE]);
  }

  private setLibelleRouteActive(pathRouteActivated: string): void {

    switch (pathRouteActivated) {
      case RoutesEnum.ACCESSIBILITE:
        this.libelleRouteActive = PageTitlesEnum.ACCESSIBILITE;
        break;
      case RoutesEnum.AVANT_COMMENCER_SIMULATION:
        this.libelleRouteActive = PageTitlesEnum.AVANT_COMMENCER_SIMULATION;
        break;
      case RoutesEnum.CGU:
        this.libelleRouteActive = PageTitlesEnum.CGU;
        break;
      case RoutesEnum.CONTACT:
        this.libelleRouteActive = PageTitlesEnum.CONTACT;
        break;
      case `${RoutesEnum.ETAPES_SIMULATION}/${RoutesEnum.CONTRAT_TRAVAIL}`:
        this.libelleRouteActive = PageTitlesEnum.CONTRAT_TRAVAIL;
        break;
      case `${RoutesEnum.ETAPES_SIMULATION}/${RoutesEnum.MA_SITUATION}`:
        this.libelleRouteActive = PageTitlesEnum.MA_SITUATION;
        break;
      case `${RoutesEnum.ETAPES_SIMULATION}/${RoutesEnum.MES_PERSONNES_A_CHARGE}`:
        this.libelleRouteActive = PageTitlesEnum.MES_PERSONNES_CHARGE;
        break;
      case `${RoutesEnum.ETAPES_SIMULATION}/${RoutesEnum.RESSOURCES_ACTUELLES}`:
        this.libelleRouteActive = PageTitlesEnum.MES_RESSOURCES_ACTUELLES;
        break;
      case `${RoutesEnum.ETAPES_SIMULATION}/${RoutesEnum.RESULTAT_SIMULATION}`:
        this.libelleRouteActive = PageTitlesEnum.RESULTAT_MA_SIMULATION;
        break;
    }
  }

  private subscribeRouteNavigationEndObservable(): void {
    this.subscriptionRouteNavigationEndObservable = this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        this.setLibelleRouteActiveSafe(routerEvent.url);
      }
    });
  }

  /**
   * Méthode permettant d'enlever le '/'
   * ex : /etapes-simulation/contrat-de-travail => etapes-simulation/contrat-de-travail
   * @param url : url courante
   */
  private setLibelleRouteActiveSafe(url: string): void {
    const pathRouteActivated = url.substring(1, url.length);
    this.setLibelleRouteActive(pathRouteActivated);
  }

}
