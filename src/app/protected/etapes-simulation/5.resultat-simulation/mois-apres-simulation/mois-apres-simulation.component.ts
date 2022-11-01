import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { DetailMensuel } from '@app/commun/models/detail-mensuel';
import { RessourceFinanciere } from '@app/commun/models/ressource-financiere';
import { SimulationMensuelle } from '@app/commun/models/simulation-mensuelle';
import { DeConnecteSimulationService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-simulation.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { SimulationService } from '@app/core/services/utile/simulation.service';

@Component({
  selector: 'app-mois-apres-simulation',
  templateUrl: './mois-apres-simulation.component.html',
  styleUrls: ['./mois-apres-simulation.component.scss']
})
export class MoisApresSimulationComponent implements OnInit {

  @Input() simulationSelected: SimulationMensuelle;
  @Input() simulationActuelle: SimulationMensuelle;
  @Input() detailMensuel: DetailMensuel;
  @Output() simulationSelection = new EventEmitter<SimulationMensuelle>();

  codesAidesEnum: typeof CodesAidesEnum = CodesAidesEnum;

  ressourcesFinancieresEtAidesMois: RessourceFinanciere[];
  private static OVERFLOW_LIMIT_REGULAR_SCREEN: number = 5;
  private static OVERFLOW_LIMIT_SMALL_SCREEN: number = 4;

  demandeurEmploiConnecte: DemandeurEmploi;

  constructor(
    private deConnecteService: DeConnecteService,
    public dateUtileService: DateUtileService,
    public deConnecteSimulationService: DeConnecteSimulationService,
    public simulationService: SimulationService,
    public screenService: ScreenService
  ) {
  }

  ngOnInit(
  ): void {
    this.demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.ressourcesFinancieresEtAidesMois = this.simulationService.getRessourcesFinancieresEtAidesSimulationMensuelle(this.simulationActuelle);
    this.orderRessourcesFinancieresMois();
  }

  private orderRessourcesFinancieresMois() {
    this.ressourcesFinancieresEtAidesMois.sort((a, b) => b.montant - a.montant);
  }

  public onClickAfficherDetail(event, simulationActuelle: SimulationMensuelle): void {
    event.preventDefault();
    this.simulationSelection.emit(simulationActuelle);
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

  public getRessourcesFinancieresEtAidesOverFlow(): number {
    return this.screenService.isExtraSmallScreen() ? this.ressourcesFinancieresEtAidesMois.length - MoisApresSimulationComponent.OVERFLOW_LIMIT_SMALL_SCREEN : this.ressourcesFinancieresEtAidesMois.length - MoisApresSimulationComponent.OVERFLOW_LIMIT_REGULAR_SCREEN;
  }

  public getResumeDetailMensuel(): string {
    let resume = "";
    if (this.detailMensuel.details.length > 0) {
      resume = this.detailMensuel.details[0];
      const threshold = this.screenService.isExtraSmallScreen() ? 75 : 80;
      if (this.detailMensuel.details.length > 1 || resume.length >= threshold) {
        resume = resume.substring(0, threshold - 10);
        resume += "... <span class='color-pe-red-typo pointer'>Lire la suite</span>";
      }
    }
    return resume;
  }

  // Permet d'afficher le même code pour les complément ARE et pour le reliquat ARE
  public getCodeFromRessourceFinanciereOuAide(ressourceFinanciereOuAide: RessourceFinanciere): string {
    if (ressourceFinanciereOuAide.code === 'CARE') return 'ARE';
    return ressourceFinanciereOuAide.code;
  }
}
