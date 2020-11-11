import { Component, OnInit } from '@angular/core';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { Router } from '@angular/router';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { SimulationMensuelle } from '@app/commun/models/simulation-mensuelle';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { CodesAidesEnum } from "@enumerations/codes-aides.enum";
import { AideSociale } from '@app/commun/models/aide-sociale';

@Component({
  selector: 'app-resultat-ma-simulation',
  templateUrl: './resultat-ma-simulation.component.html',
  styleUrls: ['./resultat-ma-simulation.component.scss']
})
export class ResultatMaSimulationComponent implements OnInit {

  demandeurEmploiConnecte: DemandeurEmploi;
  simulationsMensuelles: Array<SimulationMensuelle>;
  simulationSelected:SimulationMensuelle;
  aideSocialeSelected: AideSociale;

  constructor(
    private dateUtileService: DateUtileService,
    public demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.loadData();
  }

  public onClickButtonSimulationMensuelle(): void {
    this.selectFirstAideSociale();
  }

  public changeAideSocialeSelected(aideSocialeSelected: AideSociale) {
    this.aideSocialeSelected = aideSocialeSelected;
  }

  public getTitleCardSimulation(simulationMensuelle: SimulationMensuelle): string {
    const dateSimulation = simulationMensuelle.datePremierJourMoisSimule;
    return this.dateUtileService.getDateTitleSimulation(dateSimulation);
  }

  public isLastCardSimulation(index: number): boolean {
    return index === this.demandeurEmploiConnecte.simulationAidesSociales.simulationsMensuelles.length - 1;
  }

  public onClickButtonRetour(): void {
    if(this.demandeurEmploiConnecte.situationFamiliale.isEnCouple){
      this.router.navigate([RoutesEnum.RESSOURCES_FINANCIERES_CONJOINT], { replaceUrl: true });
    } else {
      this.router.navigate([RoutesEnum.MES_RESSOURCES_FINANCIERES], { replaceUrl: true });
    }
  }

  public getTitrePage(): string {
    let titre = "5. Résultat de ma simulation";
    if(this.demandeurEmploiConnecte.situationFamiliale.isEnCouple){
      titre = "6. Résultat de ma simulation";
    }
    return titre;
  }

  private loadData(): void {
    this.demandeurEmploiConnecte  = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    this.simulationSelected = this.demandeurEmploiConnecte.simulationAidesSociales.simulationsMensuelles[0];
    this.selectFirstAideSociale();
  }

  public hasAidesObtenir(): boolean {
    let hasAidesObtenir = false;
    if(Object.entries(this.simulationSelected.mesAides).length > 1) {
      hasAidesObtenir = true;
    }
    if(Object.entries(this.simulationSelected.mesAides).length === 1) {
      for (let [codeAide, aide] of Object.entries(this.simulationSelected.mesAides)) {
        if(codeAide !== CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE) {
          hasAidesObtenir = true;
        }
      }
    }
    return hasAidesObtenir;
  }

  private selectFirstAideSociale(): void {
    if(this.hasAidesObtenir()) {
      let index = 0;
      for (let [codeAide, aide] of Object.entries(this.simulationSelected.mesAides)) {
        if((index === 0 && codeAide !== CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE) || index === 2) {
          this.aideSocialeSelected = aide;
        }
        index ++;
      }
    } else {
      this.aideSocialeSelected = null;
    }
  }
}
