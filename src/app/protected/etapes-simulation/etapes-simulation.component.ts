import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-etapes-simulation',
  templateUrl: './etapes-simulation.component.html',
  styleUrls: ['./etapes-simulation.component.scss']
})
export class EtapesSimulationComponent implements OnInit {

  etapeActive: number;


  constructor(
    private deConnecteService: DeConnecteService,
    private router: Router,
    public screenService: ScreenService
  ) {
  }

  ngOnInit(): void {
    this.controlerSiDemandeurEmploiConnectePresent();
  }

  /**
   * Si on tente un accès au composant etape-simulation ou à ses fils
   * sans qu'il y ait un demandeur d'emploi connecte présent dans le session storage du navigateur
   * alors on doit rediriger vers le composant avant-de-commencer.
   *
   * Ce cas peut arriver si on tente un accès direct par url à un des composant et que l'on est déjà pe connecté.
   */
  private controlerSiDemandeurEmploiConnectePresent(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if(!demandeurEmploiConnecte) {
      this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
    }
  }
}
