import { Component, OnInit } from '@angular/core';
import { RoutesEnum } from '@enumerations/routes.enum';
import { Router } from '@angular/router';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';

@Component({
  selector: 'app-avant-de-commencer-simulation',
  templateUrl: './avant-de-commencer-simulation.component.html',
  styleUrls: ['./avant-de-commencer-simulation.component.scss']
})
export class AvantDeCommencerSimulationComponent implements OnInit {

  isPageLoadingDisplay = false;

  constructor(
    private demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    private estimeApiService: EstimeApiService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  redirectVersPageMonContratDeTravail() {
    this.isPageLoadingDisplay = true;
    this.estimeApiService.getDemandeurEmploi().then(
      (demandeurEmploi) => {
        this.demandeurEmploiConnecteService.setDemandeurEmploiConnecte(demandeurEmploi);
        this.isPageLoadingDisplay = false;
        this.router.navigate([RoutesEnum.MON_FUTUR_DE_TRAVAIL], { replaceUrl: true });
      }, (erreur) => {
        this.isPageLoadingDisplay = false;
        console.log(erreur);
      }
    );
  }
}
