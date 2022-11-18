import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DeConnecteRessourcesFinancieresAvantSimulationService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { DeConnecteSimulationService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-simulation.service";
import { SimulationPdfMakerService } from "@app/core/services/pdf-maker/simulation-pdf-maker.service";
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { ModalService } from '@app/core/services/utile/modal.service';
import { ScreenService } from "@app/core/services/utile/screen.service";
import { SideModalService } from '@app/core/services/utile/side-modal.service';
import { Aide } from '@models/aide';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { Simulation } from '@app/commun/models/simulation';
import { SimulationMensuelle } from '@models/simulation-mensuelle';
import { DetailTemporaliteService } from '@app/core/services/utile/detail-temporalite.service';
import { DetailTemporalite } from '@app/commun/models/detail-temporalite';
import { DetailMensuel } from '@app/commun/models/detail-mensuel';
import { ModificationCriteresComponent } from './modification-criteres/modification-criteres.component';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';

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
  detailTemporalite: DetailTemporalite;
  detailMensuelSelected: DetailMensuel;
  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  hoveredButtonSimulationMensuelle: number;

  afficherDetails: boolean;
  nombreMoisSimules: number;
  isPageLoadingDisplay: boolean;

  @ViewChild('modalDetailAideApresSimulation') modalDetailAideApresSimulation;
  @ViewChild('modalDetailMoisApresSimulation') modalDetailMoisApresSimulation;
  @ViewChild('modalModificationCriteres') modalModificationCriteres;
  @ViewChild(ModificationCriteresComponent) modificationCriteresComponent: ModificationCriteresComponent;

  constructor(
    private deConnecteService: DeConnecteService,
    private deConnecteRessourcesFinancieresAvantSimulationService: DeConnecteRessourcesFinancieresAvantSimulationService,
    private deConnecteSimulationService: DeConnecteSimulationService,
    private detailTemporaliteService: DetailTemporaliteService,
    private simulationPdfMakerService: SimulationPdfMakerService,
    private router: Router,
    public dateUtileService: DateUtileService,
    public modalService: ModalService,
    public screenService: ScreenService,
    public sideModalService: SideModalService,
  ) {
  }

  ngOnInit(): void {
    this.deConnecteService.controlerSiDemandeurEmploiConnectePresent();
    this.afficherDetails = true;
    this.loadDataSimulation();
    this.loadDetailTemporalite();
    this.nombreMoisSimules = this.simulation.simulationsMensuelles.length;
  }

  public simulationSelection(simulationMensuelle: SimulationMensuelle) {
    this.sideModalService.openSideModalMois(this.modalDetailMoisApresSimulation)
    this.simulationSelected = simulationMensuelle;
    this.detailMensuelSelected = this.getDetailMensuelSelected(simulationMensuelle);
  }

  public aideSelection(aide: Aide) {
    this.sideModalService.openSideModalAide(this.modalDetailAideApresSimulation);
    this.aideSelected = aide;
  }

  public displayLoading(displayLoading: boolean) {
    this.isPageLoadingDisplay = displayLoading;
  }

  public modificationCriteres() {
    this.sideModalService.openSideModalModifiationCriteres(this.modalModificationCriteres);
  }

  public getDetailMensuelSelected(simulationMensuelle: SimulationMensuelle) {
    return this.detailTemporalite.detailsMensuels[this.dateUtileService.getIndexMoisSimule(this.deConnecteSimulationService.getDatePremierMoisSimule(), simulationMensuelle.datePremierJourMoisSimule) - 1];
  }

  public onClickButtonImprimerMaSimulation(): void {
    this.simulationPdfMakerService.generatePdf(this.simulation);
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
    this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.RESSOURCES_ACTUELLES]);
  }

  public onClickButtonRefaireSimulation(): void {
    this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.CONTRAT_TRAVAIL]);
  }

  public onClickButtonModificationCriteres(): void {
    this.modificationCriteres();
  }

  private loadDataSimulation(): void {
    this.simulation = this.deConnecteSimulationService.getSimulation();
  }

  private loadDetailTemporalite(): void {
    this.detailTemporalite = this.detailTemporaliteService.createDetailTemporalite(this.simulation);
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

  public handleKeyUpOnModificationCriteres(event: any) {
    if (event.keyCode === 13) {
      this.onClickButtonModificationCriteres();
    }
  }

  public getCriteresSimulation(): string {
    if (this.screenService.isExtraSmallScreen()) return this.deConnecteRessourcesFinancieresAvantSimulationService.getCriteresSimulationLibelleCourt()
    return this.deConnecteRessourcesFinancieresAvantSimulationService.getCriteresSimulation();
  }
}
