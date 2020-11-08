import { Component, OnInit } from '@angular/core';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { Router } from '@angular/router';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { SimulationMensuelle } from '@app/commun/models/simulation-mensuelle';
import { DateUtileService } from '@app/core/services/utile/date-util.service';

@Component({
  selector: 'app-resultat-ma-simulation',
  templateUrl: './resultat-ma-simulation.component.html',
  styleUrls: ['./resultat-ma-simulation.component.scss']
})
export class ResultatMaSimulationComponent implements OnInit {

  demandeurEmploiConnecte: DemandeurEmploi;
  simulationsMensuelles: Array<SimulationMensuelle>;
  simulationSelected:SimulationMensuelle;

  constructor(
    private dateUtileService: DateUtileService,
    public demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.demandeurEmploiConnecte  = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    this.simulationSelected = this.demandeurEmploiConnecte.simulationAidesSociales.simulationsMensuelles[0];
  }

  public getTitleCardSimulation(simulationMensuelle: SimulationMensuelle): string {
    const dateSimulation = simulationMensuelle.datePremierJourMoisSimule;
    return this.dateUtileService.getDateTitleSimulation(dateSimulation);
  }

  public isLastCardSimulation(index: number): boolean {
    return index === this.demandeurEmploiConnecte.simulationAidesSociales.simulationsMensuelles.length - 1;
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
