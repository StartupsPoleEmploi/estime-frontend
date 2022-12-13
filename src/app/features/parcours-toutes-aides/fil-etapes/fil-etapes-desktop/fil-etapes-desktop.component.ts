import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EtapeSimulation } from '@app/commun/models/etape-simulation';
import { EtapeSimulationService } from "@app/core/services/utile/etape-simulation.service";
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fil-etapes-desktop',
  templateUrl: './fil-etapes-desktop.component.html',
  styleUrls: ['./fil-etapes-desktop.component.scss']
})
export class FilEtapesDesktopComponent implements OnInit {

  etapeActive: number;
  etapesSimulation: Array<EtapeSimulation>;
  subscriptionRouteNavigationEndObservable: Subscription;
  hoveredEtape: number;


  constructor(
    private etapeSimulationService: EtapeSimulationService,
    private router: Router
  ) {
    this.subscribeRouteNavigationEndObservable();
  }

  ngOnInit(): void {
    this.etapesSimulation = this.etapeSimulationService.getEtapesSimulationParcoursToutesAides();
    this.etapeActive = this.etapeSimulationService.getNumeroEtapeParcoursToutesAidesByPathRoute(this.router.url);
  }

  ngOnDestroy(): void {
    this.subscriptionRouteNavigationEndObservable.unsubscribe();
  }

  public onMouseOverEtape(etapeActive, numeroEtape): void {
    if (etapeActive >= numeroEtape) this.hoveredEtape = numeroEtape;
  }

  public onMouseLeaveEtape(): void {
    this.hoveredEtape = 0;
  }

  private subscribeRouteNavigationEndObservable(): void {
    this.subscriptionRouteNavigationEndObservable = this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        this.etapeActive = this.etapeSimulationService.getNumeroEtapeParcoursToutesAidesByPathRoute(routerEvent.url);
      }
    });
  }

  public onClickButtonEtape(etapeActive: number, numeroEtape: number): void {
    if (etapeActive >= numeroEtape) {
      switch (numeroEtape) {
        case 1: {
          this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.CONTRAT_TRAVAIL]);
          break;
        }
        case 2: {
          this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.SITUATION]);
          break;
        }
        case 3: {
          this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.PERSONNES_A_CHARGE]);
          break;
        }
        case 4: {
          this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.RESSOURCES_ACTUELLES]);
          break;
        }
        case 5: {
          this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.RESULTAT_SIMULATION]);
          break;
        }
      }
    }
  }
}
