import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EtapeSimulationService } from '@app/core/services/utile/etape-simulation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fil-etapes-mobile',
  templateUrl: './fil-etapes-mobile.component.html',
  styleUrls: ['./fil-etapes-mobile.component.scss']
})
export class FilEtapesMobileComponent implements OnInit {

  etapeActive: number;
  subscriptionRouteNavigationEndObservable: Subscription;

  constructor(
    private etapeSimulationService: EtapeSimulationService,
    private router: Router
  ) {
    this.subscribeRouteNavigationEndObservable();
  }

  ngOnInit(): void {
    this.etapeActive = this.etapeSimulationService.getNumeroEtapeParcoursComplementAREByPathRoute(this.router.url);
  }

  ngOnDestroy(): void {
    this.subscriptionRouteNavigationEndObservable.unsubscribe();
  }

  private subscribeRouteNavigationEndObservable(): void {
    this.subscriptionRouteNavigationEndObservable = this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        this.etapeActive = this.etapeSimulationService.getNumeroEtapeParcoursComplementAREByPathRoute(this.router.url);
      }
    });
  }



}
