import { Component, OnInit } from '@angular/core';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { Router } from '@angular/router';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';

@Component({
  selector: 'app-resultat-ma-simulation',
  templateUrl: './resultat-ma-simulation.component.html',
  styleUrls: ['./resultat-ma-simulation.component.scss']
})
export class ResultatMaSimulationComponent implements OnInit {

  demandeurEmploiConnecte: DemandeurEmploi;

  constructor(
    private demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initialisationPage();
  }

  initialisationPage(): void {
    this.demandeurEmploiConnecte  = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
  }

  redirectVersPagePrecedente() {
    if(this.demandeurEmploiConnecte.situationFamiliale.isEnCouple){
      this.router.navigate([RoutesEnum.RESSOURCES_FINANCIERES_CONJOINT], { replaceUrl: true });
    } else {
      this.router.navigate([RoutesEnum.MES_RESSOURCES_FINANCIERES], { replaceUrl: true });
    }
  }

  getTitrePage() {
    let titre = "5. Résultat de ma simulation";
    if(this.demandeurEmploiConnecte.situationFamiliale.isEnCouple){
      titre = "6. Résultat de ma simulation";
    }
    return titre;
  }

}
