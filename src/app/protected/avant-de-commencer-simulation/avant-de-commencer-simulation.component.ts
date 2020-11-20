import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { RoutesEnum } from '@enumerations/routes.enum';

@Component({
  selector: 'app-avant-de-commencer-simulation',
  templateUrl: './avant-de-commencer-simulation.component.html',
  styleUrls: ['./avant-de-commencer-simulation.component.scss']
})
export class AvantDeCommencerSimulationComponent implements OnInit {

  isPageLoadingDisplay = false;

  constructor(
    private deConnecteService: DeConnecteService,
    private estimeApiService: EstimeApiService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  redirectVersPageMonContratDeTravail() {
    this.isPageLoadingDisplay = true;
    this.estimeApiService.getDemandeurEmploi().then(
      (demandeurEmploi) => {
        this.deConnecteService.setDemandeurEmploiConnecte(demandeurEmploi);
        this.isPageLoadingDisplay = false;
        this.router.navigate([RoutesEnum.MON_FUTUR_DE_TRAVAIL], { replaceUrl: true });
      }, (erreur) => {
        this.isPageLoadingDisplay = false;
        console.log(erreur);
      }
    );
  }
}
