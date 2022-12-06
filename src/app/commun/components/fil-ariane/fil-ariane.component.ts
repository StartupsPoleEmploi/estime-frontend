import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { LibellesAidesEnum } from '@app/commun/enumerations/libelles-aides.enum';
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

  codesAidesEnum: typeof CodesAidesEnum = CodesAidesEnum;
  libellesAidesEnum: typeof LibellesAidesEnum = LibellesAidesEnum;

  routesAides: Object = {};

  constructor(
    private router: Router
  ) {
    this.subscribeRouteNavigationEndObservable();
  }

  ngOnInit(): void {
    this.setRoutesAides();
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
      case RoutesEnum.CGU:
        this.libelleRouteActive = PageTitlesEnum.CGU;
        break;
      case RoutesEnum.CONTACT:
        this.libelleRouteActive = PageTitlesEnum.CONTACT;
        break;
      case RoutesEnum.CHOIX_TYPE_SIMULATION:
        this.libelleRouteActive = "Type de simulation";
        break;
      case `${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.AVANT_COMMENCER_SIMULATION}`:
        this.libelleRouteActive = PageTitlesEnum.AVANT_COMMENCER_SIMULATION;
        break;
      case `${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.CONTRAT_TRAVAIL}`:
        this.libelleRouteActive = PageTitlesEnum.CONTRAT_TRAVAIL;
        break;
      case `${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.MA_SITUATION}`:
        this.libelleRouteActive = PageTitlesEnum.MA_SITUATION;
        break;
      case `${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.MES_PERSONNES_A_CHARGE}`:
        this.libelleRouteActive = PageTitlesEnum.MES_PERSONNES_CHARGE;
        break;
      case `${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.RESSOURCES_ACTUELLES}`:
        this.libelleRouteActive = PageTitlesEnum.MES_RESSOURCES_ACTUELLES;
        break;
      case `${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.RESULTAT_SIMULATION}`:
        this.libelleRouteActive = PageTitlesEnum.RESULTAT_MA_SIMULATION;
        break;
      case `${RoutesEnum.PARCOURS_COMPLEMENT_ARE}/${RoutesEnum.ACTIVITE_REPRISE}`:
        this.libelleRouteActive = PageTitlesEnum.ACTIVITE_REPRISE;
        break;
      case `${RoutesEnum.PARCOURS_COMPLEMENT_ARE}/${RoutesEnum.MA_SITUATION}`:
        this.libelleRouteActive = PageTitlesEnum.MA_SITUATION;
        break;
      case `${RoutesEnum.PARCOURS_COMPLEMENT_ARE}/${RoutesEnum.RESULTAT_SIMULATION}`:
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


  /**
   * Méthode permettant de lier les routes des aides à un libelle pour le fil d'arianne
   * ex: /aides/AM => Toutes les aides / Aide à la mobilité
   */
  private setRoutesAides() {
    this.routesAides[this.codesAidesEnum.AGEPI] = this.libellesAidesEnum.AGEPI;
    this.routesAides[this.codesAidesEnum.AIDE_MOBILITE] = this.libellesAidesEnum.AIDE_MOBILITE;
    this.routesAides[this.codesAidesEnum.ALLOCATION_ADULTES_HANDICAPES] = this.libellesAidesEnum.ALLOCATION_ADULTES_HANDICAPES;
    this.routesAides[this.codesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE] = this.libellesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE;
    this.routesAides[this.codesAidesEnum.PRIME_ACTIVITE] = this.libellesAidesEnum.PRIME_ACTIVITE;
  }

}
