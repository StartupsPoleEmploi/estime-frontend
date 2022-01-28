import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DeConnecteRessourcesFinancieresService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { DeConnecteSimulationAidesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-simulation-aides.service";
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { SimulationPdfMakerService } from "@app/core/services/pdf-maker/simulation-pdf-maker.service";
import { AidesService } from '@app/core/services/utile/aides.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { ModalService } from '@app/core/services/utile/modal.service';
import { ScreenService } from "@app/core/services/utile/screen.service";
import { CodesAidesEnum } from "@enumerations/codes-aides.enum";
import { Aide } from '@models/aide';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { SimulationAides } from '@models/simulation-aides';
import { SimulationMensuelle } from '@models/simulation-mensuelle';

@Component({
  selector: 'app-resultat-simulation',
  templateUrl: './resultat-simulation.component.html',
  styleUrls: ['./resultat-simulation.component.scss']
})
export class ResultatSimulationComponent implements OnInit {

  aideSelected: Aide;
  demandeurEmploiConnecte: DemandeurEmploi;
  simulationAides: SimulationAides;
  simulationSelected: SimulationMensuelle;
  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  hoveredButtonSimulationMensuelle: number;

  afficherDetails: boolean;
  nombreMoisSimules: number;

  constructor(
    private aidesService: AidesService,
    private dateUtileService: DateUtileService,
    public deConnecteService: DeConnecteService,
    public deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    public deConnecteSimulationAidesService: DeConnecteSimulationAidesService,
    public modalService: ModalService,
    private router: Router,
    public screenService: ScreenService,
    private simulationPdfMakerService: SimulationPdfMakerService
  ) {
  }

  ngOnInit(): void {
    this.deConnecteService.controlerSiDemandeurEmploiConnectePresent();
    this.demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.afficherDetails = true;
    this.loadDataSimulationAides();
    this.nombreMoisSimules = this.simulationAides.simulationsMensuelles.length;
  }

  public simulationSelection(simulationSelected: SimulationMensuelle) {
    this.simulationSelected = simulationSelected;
  }

  public onClickButtonImprimerMaSimulation(): void {
    this.simulationPdfMakerService.generatePdf(this.demandeurEmploiConnecte, this.simulationAides);
  }

  public onClickButtonSimulationMensuelle(simulationMensuel: SimulationMensuelle): void {
    this.traiterOnClickButtonSimulationMensuelleForSmartphone(simulationMensuel);
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
    return index === this.simulationAides.simulationsMensuelles.length - 1;
  }

  public isSimulationMensuelleSelected(simulationMensuelle: SimulationMensuelle): boolean {
    return this.simulationSelected && simulationMensuelle.datePremierJourMoisSimule === this.simulationSelected.datePremierJourMoisSimule;
  }

  public isLastSimulationMensuelle(index: number) {
    return index === this.simulationAides.simulationsMensuelles.length - 1
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.RESSOURCES_ACTUELLES]);
  }

  public onClickButtonRefaireSimulation(): void {
    this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.CONTRAT_TRAVAIL]);
  }

  private loadDataSimulationAides(): void {
    this.simulationAides = this.deConnecteSimulationAidesService.getSimulationAides();
  }


  private traiterOnClickButtonSimulationMensuelleForSmartphone(simulationMensuel: SimulationMensuelle): void {
    //si click sur la même simulation, on unset l'attribut simulationSelected pour ne plus afficher le détail
    // sinon on set l'attribut simulationSelected avec celle sélectionnée
    if (this.isSimulationMensuelleSelected(simulationMensuel)) {
      this.simulationSelected = null;
    } else {
      this.simulationSelected = simulationMensuel;
      this.aideSelected = null;
    }
  }

  private selectAideAfficherDetail(): void {
    const isAideActuelleSelected = this.selectAideActuelle();
    if (!isAideActuelleSelected) {
      this.selectFirstAidePourraObtenir();
    }
  }

  private selectAideActuelle(): boolean {
    let isAideActuelleSelected = false;
    const aideAAH = this.aidesService.getAideByCodeFromSimulationMensuelle(this.simulationSelected, CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES);
    if (aideAAH) {
      this.aideSelected = aideAAH;
      isAideActuelleSelected = true;
    } else {
      const aideASS = this.aidesService.getAideByCodeFromSimulationMensuelle(this.simulationSelected, CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
      if (aideASS) {
        this.aideSelected = aideASS;
        isAideActuelleSelected = true;
      }
    }
    return isAideActuelleSelected;
  }

  private selectFirstAidePourraObtenir(): void {
    if (this.aidesService.hasAidesObtenir(this.simulationSelected)) {
      const aides = Object.values(this.simulationSelected.mesAides);
      aides.forEach((aide) => {
        if (this.aidesService.isAideDemandeurPourraObtenir(aide)) {
          this.aideSelected = aide;
        }
      });
    } else {
      this.aideSelected = null;
    }
  }

  public handleKeyUpOnSimulationMensuelle(event: any, simulationMensuelle: SimulationMensuelle) {
    if (event.keyCode === 13) {
      this.onClickButtonSimulationMensuelle(simulationMensuelle);
    }
  }
}
