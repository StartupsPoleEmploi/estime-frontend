import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DeConnecteRessourcesFinancieresAvantSimulationService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { DeConnecteSimulationService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-simulation.service";
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { SimulationPdfMakerService } from "@app/core/services/pdf-maker/simulation-pdf-maker.service";
import { AidesService } from '@app/core/services/utile/aides.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { ModalService } from '@app/core/services/utile/modal.service';
import { ScreenService } from "@app/core/services/utile/screen.service";
import { SideModalService } from '@app/core/services/utile/side-modal.service';
import { Aide } from '@models/aide';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { Simulation } from '@app/commun/models/simulation';
import { SimulationMensuelle } from '@models/simulation-mensuelle';

@Component({
  selector: 'app-resultat-simulation',
  templateUrl: './resultat-simulation.component.html',
  styleUrls: ['./resultat-simulation.component.scss']
})
export class ResultatSimulationComponent implements OnInit {

  aideSelected: Aide;
  demandeurEmploiConnecte: DemandeurEmploi;
  simulation: Simulation;
  simulationSelected: SimulationMensuelle;
  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  hoveredButtonSimulationMensuelle: number;

  afficherDetails: boolean;
  nombreMoisSimules: number;

  @ViewChild('modalDetailAideApresSimulation') modalDetailAideApresSimulation;
  @ViewChild('modalDetailMoisApresSimulation') modalDetailMoisApresSimulation;

  constructor(
    public aidesService: AidesService,
    public dateUtileService: DateUtileService,
    public deConnecteService: DeConnecteService,
    public deConnecteRessourcesFinancieresAvantSimulationService: DeConnecteRessourcesFinancieresAvantSimulationService,
    public deConnecteSimulationService: DeConnecteSimulationService,
    public modalService: ModalService,
    private router: Router,
    public screenService: ScreenService,
    public sideModalService: SideModalService,
    private simulationPdfMakerService: SimulationPdfMakerService
  ) {
  }

  ngOnInit(): void {
    this.deConnecteService.controlerSiDemandeurEmploiConnectePresent();
    this.demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.afficherDetails = true;
    this.loadDataSimulation();
    this.nombreMoisSimules = this.simulation.simulationsMensuelles.length;
  }

  public simulationSelection(simulationMensuelle: SimulationMensuelle) {
    this.sideModalService.openSideModalMois(this.modalDetailMoisApresSimulation)
    this.simulationSelected = simulationMensuelle;
  }

  public aideSelection(aide: Aide) {
    this.sideModalService.openSideModalAide(this.modalDetailAideApresSimulation);
    this.aideSelected = aide;
  }

  public onClickButtonImprimerMaSimulation(): void {
    this.simulationPdfMakerService.generatePdf(this.demandeurEmploiConnecte, this.simulation);
  }

  public onClickOnglet(afficherDetails: boolean): void {
    this.afficherDetails = afficherDetails;
  }

  public onMouseOverButtonSimulationMensuelle(index) {
    this.hoveredButtonSimulationMensuelle = index;
  }

  public onMouseLeaveButtonSimulationMensuelle() {
    this.hoveredButtonSimulationMensuelle = -1;
  }

  public changeAideSelected(aideSelected: Aide) {
    this.aideSelected = aideSelected;
  }

  public getDateStringFormat(simulationMensuelle: SimulationMensuelle): string {
    let dateStringFormat = null;
    const dateSimulation = simulationMensuelle.datePremierJourMoisSimule;
    if (this.screenService.isTabletScreen()) {
      dateStringFormat = this.dateUtileService.getLibelleDateStringFormatCourt(dateSimulation);
    } else {
      dateStringFormat = this.dateUtileService.getLibelleDateStringFormat(dateSimulation);

    }
    return dateStringFormat;
  }

  public isLastCardSimulation(index: number): boolean {
    return index === this.simulation.simulationsMensuelles.length - 1;
  }

  public isSimulationMensuelleSelected(simulationMensuelle: SimulationMensuelle): boolean {
    return this.simulationSelected && simulationMensuelle.datePremierJourMoisSimule === this.simulationSelected.datePremierJourMoisSimule;
  }

  public isLastSimulationMensuelle(index: number) {
    return index === this.simulation.simulationsMensuelles.length - 1
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.RESSOURCES_ACTUELLES]);
  }

  public onClickButtonRefaireSimulation(): void {
    this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.CONTRAT_TRAVAIL]);
  }

  private loadDataSimulation(): void {
    this.simulation = this.deConnecteSimulationService.getSimulation();
  }

  public handleKeyUpOnSimulationMensuelle(event: any, simulationMensuelle: SimulationMensuelle) {
    if (event.keyCode === 13) {
      this.simulationSelection(simulationMensuelle);
    }
  }

  public handleKeyUpOnTelechargerSimulation(event: any) {
    if (event.keyCode === 13) {
      this.onClickButtonImprimerMaSimulation();
    }
  }

  public handleKeyUpOnRefaireSimulation(event: any) {
    if (event.keyCode === 13) {
      this.onClickButtonRefaireSimulation();
    }
  }
}
