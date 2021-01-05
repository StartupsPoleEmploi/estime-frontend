import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EtapeSimulation } from '@app/commun/models/etape-simulation';
import { EtapeSimulationService } from "@app/core/services/utile/etape-simulation.service";
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

  constructor(
    private etapeSimulationService: EtapeSimulationService,
    private router: Router
  ) {
    this.subscribeRouteNavigationEndObservable();
  }

  ngOnInit(): void {
    this.etapesSimulation = this.etapeSimulationService.getEtapesSimulation();
    this.etapeActive = this.etapeSimulationService.getNumeroEtapeByPathRoute(this.router.url);
  }

  ngOnDestroy(): void {
    this.subscriptionRouteNavigationEndObservable.unsubscribe();
  }

  private subscribeRouteNavigationEndObservable(): void {
    this.subscriptionRouteNavigationEndObservable = this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        this.etapeActive = this.etapeSimulationService.getNumeroEtapeByPathRoute(routerEvent.url);
      }
    });
  }
}
