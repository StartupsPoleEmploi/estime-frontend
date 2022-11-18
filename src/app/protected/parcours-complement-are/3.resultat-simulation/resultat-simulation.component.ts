import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { Simulation } from '@app/commun/models/simulation';
import { DeConnecteRessourcesFinancieresAvantSimulationService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { DeConnecteSimulationService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-simulation.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { AidesService } from '@app/core/services/utile/aides.service';
import { NumberUtileService } from '@app/core/services/utile/number-util.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { SideModalService } from '@app/core/services/utile/side-modal.service';

@Component({
  selector: 'app-resultat-simulation',
  templateUrl: './resultat-simulation.component.html',
  styleUrls: ['./resultat-simulation.component.scss']
})
export class ResultatSimulationComponent implements OnInit {

  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  @ViewChild('modalModificationCriteres') modalModificationCriteres;

  constructor(
    public screenService: ScreenService,
    private deConnecteService: DeConnecteService,
    private deConnecteSimulationService: DeConnecteSimulationService,
    private aidesService: AidesService,
    private numberUtileService: NumberUtileService,
    private deConnecteRessourcesFinancieresAvantSimulationService: DeConnecteRessourcesFinancieresAvantSimulationService,
    private sideModalService: SideModalService,
    private router: Router
  ) { }

  isPageLoadingDisplay: boolean;
  isCriteresDisplay: boolean;

  simulation: Simulation;
  isEligibleComplementARE: boolean;
  montantComplementARE: number;
  hasDeductions: boolean;
  montantCRC: number;
  montantCRDS: number;
  montantCSG: number;
  demandeurEmploiConnecte: DemandeurEmploi;

  ngOnInit(): void {
    this.isCriteresDisplay = false;
    this.demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.loadDataSimulation();
    this.initMontants();
  }

  private loadDataSimulation(): void {
    this.simulation = this.deConnecteSimulationService.getSimulation();
  }

  private initMontants() {
    this.montantComplementARE = this.aidesService.getMontantAideByCode(this.simulation, CodesAidesEnum.COMPLEMENT_AIDE_RETOUR_EMPLOI);
    this.isEligibleComplementARE = this.montantComplementARE > 0;

    if (this.isEligibleComplementARE) {
      this.montantCRC = this.aidesService.getMontantAideByCode(this.simulation, CodesAidesEnum.CRC);
      this.montantCRDS = this.aidesService.getMontantAideByCode(this.simulation, CodesAidesEnum.CRDS);
      this.montantCSG = this.aidesService.getMontantAideByCode(this.simulation, CodesAidesEnum.CSG);
      this.hasDeductions = this.montantCRC > 0 || this.montantCRDS > 0 || this.montantCSG > 0;
    }
  }

  public clickOnFaireSimulationComplete() {
    this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
  }

  public getCriteresSimulationDegressiviteARE(): string {
    const hasDegressiviteARE = this.deConnecteRessourcesFinancieresAvantSimulationService.getDegressiviteARE() ? 'oui' : 'non';
    return `Dégressivité : ${hasDegressiviteARE}`
  }

  public getCriteresSimulationSJR(): string {
    const sjr = this.numberUtileService.replaceDotByComma(this.deConnecteRessourcesFinancieresAvantSimulationService.getSalaireJournalierReferenceARE());
    return `Salaire journalier de référence : ${sjr}€`
  }

  public getCriteresSimulationAllocationJournaliere(): string {
    const allocationJournaliere = this.numberUtileService.replaceDotByComma(this.deConnecteRessourcesFinancieresAvantSimulationService.getAllocationJournaliereARE());
    return `Allocation journalière : ${allocationJournaliere}€`
  }


  public getCriteresSimulationFuturSalaire(): string {
    const futurSalaire = this.numberUtileService.replaceDotByComma(this.deConnecteRessourcesFinancieresAvantSimulationService.getFuturSalaireNet());
    return `Salaire de l'activité reprise : ${futurSalaire}€`
  }


  public onClickButtonModificationCriteres(): void {
    this.modificationCriteres();
  }

  public modificationCriteres() {
    this.sideModalService.openSideModalModifiationCriteres(this.modalModificationCriteres);
  }

  public displayLoading(displayLoading: boolean) {
    this.isPageLoadingDisplay = displayLoading;
  }

  public onClickCriteresDisplay(): void {
    this.isCriteresDisplay = !this.isCriteresDisplay;
  }

}
