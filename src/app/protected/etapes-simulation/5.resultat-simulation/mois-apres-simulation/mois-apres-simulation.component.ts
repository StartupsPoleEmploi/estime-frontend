import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { Aide } from '@app/commun/models/aide';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { SimulationMensuelle } from '@app/commun/models/simulation-mensuelle';
import { DeConnecteSimulationAidesService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-simulation-aides.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { AidesService } from '@app/core/services/utile/aides.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-mois-apres-simulation',
  templateUrl: './mois-apres-simulation.component.html',
  styleUrls: ['./mois-apres-simulation.component.scss']
})
export class MoisApresSimulationComponent implements OnInit {

  @Input() simulationSelected: SimulationMensuelle;
  @Input() simulationActuelle: SimulationMensuelle;
  @Output() simulationSelection = new EventEmitter<SimulationMensuelle>();

  codesAidesEnum: typeof CodesAidesEnum = CodesAidesEnum;

  aideMois: Aide[];
  revenusMois: Aide[];
  aidesEtRevenusMois: Aide[];
  private static OVERFLOW_LIMIT_REGULAR_SCREEN: number = 5;
  private static OVERFLOW_LIMIT_SMALL_SCREEN: number = 4;

  demandeurEmploiConnecte: DemandeurEmploi;

  constructor(
    public aidesService: AidesService,
    public dateUtileService: DateUtileService,
    public deConnecteService: DeConnecteService,
    public deConnecteSimulationAidesService: DeConnecteSimulationAidesService,
    public screenService: ScreenService
  ) {
  }

  ngOnInit(
  ): void {
    this.demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.aideMois = this.deConnecteSimulationAidesService.getAidesSimulationMensuelle(this.simulationActuelle);
    this.revenusMois = this.deConnecteSimulationAidesService.getRevenusApresSimulation(this.demandeurEmploiConnecte);
    this.aidesEtRevenusMois = this.aideMois.concat(this.revenusMois);

  }

  public onClickAfficherDetail(event, simulationActuelle: SimulationMensuelle): void {
    event.preventDefault();
    this.simulationSelection.emit(simulationActuelle);
  }

  public getAidesMois(simulationMensuelle: SimulationMensuelle) {
    this.aideMois.push()
  }

  public isNoSimulationMensuelleSelected(): boolean {
    return this.simulationSelected == null;
  }

  public isSimulationMensuelleSelected(simulationMensuelle: SimulationMensuelle): boolean {
    return this.simulationSelected && simulationMensuelle.datePremierJourMoisSimule === this.simulationSelected.datePremierJourMoisSimule;
  }

  /**
   * Fonction qui permet de déterminer la classe à affecter à l'icone :
   * si cette icone représente le nombre à afficher quand y a trop d'aide, on renvoit la classe 'overflow'
   * @param index
   * @returns
   */
  public getOverflowClass(index: number) {
    if (this.screenService.isExtraSmallScreen()) {
      return index == 4 ? 'overflow' : 'else';
    }
    return index == 5 ? 'overflow' : 'else';
  }

  public getAidesEtRevenusOverFlow(): number {
    return this.screenService.isExtraSmallScreen() ? this.aidesEtRevenusMois.length - MoisApresSimulationComponent.OVERFLOW_LIMIT_SMALL_SCREEN : this.aidesEtRevenusMois.length - MoisApresSimulationComponent.OVERFLOW_LIMIT_REGULAR_SCREEN;
  }

}
