import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { SessionStorageEstimeService } from '@app/core/services/storage/session-storage-estime.service';
import { EtapeSimulationService } from "@app/core/services/utile/etape-simulation.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fil-ariane',
  templateUrl: './fil-ariane.component.html',
  styleUrls: ['./fil-ariane.component.scss']
})
export class FilArianeComponent implements OnInit {

  libelleRouteActive: string;
  subscriptionEtapeSimulationChangedObservable: Subscription;
  subscriptionRouteNavigationEndObservable: Subscription;

  constructor(
    private etapeSimulationService: EtapeSimulationService,
    private router: Router,
    private sessionStorageEstimeService:SessionStorageEstimeService
  ) {
    this.subscribeEtapeSimulationChangedObservable();
    this.subscribeRouteNavigationEndObservable();
  }

  ngOnInit(): void {
    this.setLibelleRouteActive(this.router.url);
  }

  ngOnDestroy(): void {
    this.subscriptionEtapeSimulationChangedObservable.unsubscribe();
    this.subscriptionRouteNavigationEndObservable.unsubscribe();
  }

  public onClickLinkAccueil(): void {
    this.router.navigate([RoutesEnum.HOMEPAGE]);
  }

  private setLibelleRouteActive(url: string): void {
    const activeRoute = url.substring(1, url.length);

    switch(activeRoute) {

      case RoutesEnum.AVANT_COMMENCER_SIMULATION : {
        this.libelleRouteActive = PageTitlesEnum.AVANT_COMMENCER_SIMULATION;
        break;
      }
      case RoutesEnum.CGU : {
        this.libelleRouteActive = PageTitlesEnum.CGU;
        break;
      }
      case RoutesEnum.ETAPES_SIMULATION : {
        const numeroEtapeActive = this.sessionStorageEstimeService.getNumeroEtapeSimulation();
        this.setLibelleRouteActiveEtapeSimulation(parseInt(numeroEtapeActive));
        break;
      }
    }
  }

  private setLibelleRouteActiveEtapeSimulation(numeroEtapeActive: number): void {
    switch(numeroEtapeActive) {
      case 1 :
        this.libelleRouteActive = PageTitlesEnum.CONTRAT_TRAVAIL;
      break;
      case 2 :
        this.libelleRouteActive = PageTitlesEnum.MA_SITUATION;
      break;
      case 3 :
        this.libelleRouteActive = PageTitlesEnum.MES_PERSONNES_CHARGE;
      break;
      case 4 :
        this.libelleRouteActive = PageTitlesEnum.MES_RESSOURCES_ACTUELLES;
      break;
      case 5 :
        this.libelleRouteActive = PageTitlesEnum.RESULTAT_MA_SIMULATION;
      break;
    }
  }

  private subscribeEtapeSimulationChangedObservable(): void {

    this.subscriptionEtapeSimulationChangedObservable = this.etapeSimulationService.etapeSimulationChanged.subscribe(numeroEtape =>  {
      this.setLibelleRouteActiveEtapeSimulation(numeroEtape);
    })
  }

  private subscribeRouteNavigationEndObservable(): void {
    this.subscriptionRouteNavigationEndObservable = this.router.events.subscribe((routerEvent) => {
      if(routerEvent instanceof NavigationEnd) {
          this.setLibelleRouteActive(routerEvent.url);
      }
    });
  }

}
