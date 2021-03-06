import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DeConnecteRessourcesFinancieresService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { DeConnecteSimulationAidesSocialesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-simulation-aides-sociales.service";
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { SimulationPdfMakerService } from "@app/core/services/pdf-maker/simulation-pdf-maker.service";
import { AidesService } from '@app/core/services/utile/aides.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { ScreenService } from "@app/core/services/utile/screen.service";
import { CodesAidesEnum } from "@enumerations/codes-aides.enum";
import { AideSociale } from '@models/aide-sociale';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { SimulationAidesSociales } from '@models/simulation-aides-sociales';
import { SimulationMensuelle } from '@models/simulation-mensuelle';

@Component({
  selector: 'app-resultat-simulation',
  templateUrl: './resultat-simulation.component.html',
  styleUrls: ['./resultat-simulation.component.scss']
})
export class ResultatSimulationComponent implements OnInit {

  aideSocialeSelected: AideSociale;
  demandeurEmploiConnecte: DemandeurEmploi;
  simulationAidesSociales: SimulationAidesSociales;
  simulationSelected: SimulationMensuelle;
  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  hoveredButtonSimulationMensuelle: number;


  constructor(
    private aidesService: AidesService,
    private dateUtileService: DateUtileService,
    public deConnecteService: DeConnecteService,
    public deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    public deConnecteSimulationAidesSocialesService: DeConnecteSimulationAidesSocialesService,
    private router: Router,
    public screenService: ScreenService,
    private simulationPdfMakerService:SimulationPdfMakerService
  ) {
  }

  ngOnInit(): void {
    this.demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.loadDataSimulationAidesSociales();
  }

  public onClickButtonImprimerMaSimulation(): void {
    this.simulationPdfMakerService.generatePdf(this.demandeurEmploiConnecte, this.simulationAidesSociales);
  }

  public onClickButtonSimulationMensuelle(simulationMensuel: SimulationMensuelle): void {
    if (this.screenService.isExtraSmallScreen()) {
      this.traiterOnClickButtonSimulationMensuelleForSmartphone(simulationMensuel);
    } else {
      this.simulationSelected = simulationMensuel;
      this.aideSocialeSelected = null;
      this.selectAideAfficherDetail();
    }
  }

  public onMouseOverButtonSimulationMensuelle(index) {
    this.hoveredButtonSimulationMensuelle = index;
  }

  public onMouseLeaveButtonSimulationMensuelle() {
    this.hoveredButtonSimulationMensuelle = -1;
  }

  public changeAideSocialeSelected(aideSocialeSelected: AideSociale) {
    this.aideSocialeSelected = aideSocialeSelected;
  }

  public getDateStringFormat(simulationMensuelle: SimulationMensuelle): string {
    let dateStringFormat = null;
    const dateSimulation = simulationMensuelle.datePremierJourMoisSimule;
    if(this.screenService.isTabletScreen()) {
      dateStringFormat = this.dateUtileService.getLibelleDateStringFormatCourt(dateSimulation);
    } else {
      dateStringFormat = this.dateUtileService.getLibelleDateStringFormat(dateSimulation);

    }
    return dateStringFormat;
  }

  public isLastCardSimulation(index: number): boolean {
    return index === this.simulationAidesSociales.simulationsMensuelles.length - 1;
  }

  public isSimulationMensuelleSelected(simulationMensuelle: SimulationMensuelle): boolean {
    return this.simulationSelected && simulationMensuelle.datePremierJourMoisSimule === this.simulationSelected.datePremierJourMoisSimule;
  }

  public isLastSimulationMensuelle(index: number) {
    return index === this.simulationAidesSociales.simulationsMensuelles.length - 1
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.RESSOURCES_ACTUELLES]);
  }

  public onClickButtonRefaireSimulation(): void {
    this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.CONTRAT_TRAVAIL]);
  }

  private loadDataSimulationAidesSociales(): void {
    this.simulationAidesSociales = this.deConnecteSimulationAidesSocialesService.getSimulationAidesSociales();
    //si l'utilisateur est sur smartphone, aucune préselection
    if (!this.screenService.isExtraSmallScreen()) {
      this.simulationSelected = this.simulationAidesSociales.simulationsMensuelles[0];
      this.selectAideAfficherDetail();
    }
  }


  private traiterOnClickButtonSimulationMensuelleForSmartphone(simulationMensuel: SimulationMensuelle): void {
    //si click sur la même simulation, on unset l'attribut simulationSelected pour ne plus afficher le détail
    // sinon on set l'attribut simulationSelected avec celle sélectionnée
    if (this.isSimulationMensuelleSelected(simulationMensuel)) {
      this.simulationSelected = null;
    } else {
      this.simulationSelected = simulationMensuel;
      this.aideSocialeSelected = null;
    }
  }

  private selectAideAfficherDetail(): void {
    const isAideActuelleSelected = this.selectAideActuelle();
    if(!isAideActuelleSelected) {
      this.selectFirstAidePourraObtenir();
    }
  }

  private selectAideActuelle(): boolean {
    let isAideActuelleSelected = false;
    const aideSocialeAAH = this.aidesService.getAideByCodeFromSimulationMensuelle(this.simulationSelected, CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES);
    if(aideSocialeAAH) {
      this.aideSocialeSelected = aideSocialeAAH;
      isAideActuelleSelected = true;
    } else {
      const aideSocialeASS = this.aidesService.getAideByCodeFromSimulationMensuelle(this.simulationSelected, CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
      if(aideSocialeASS) {
        this.aideSocialeSelected = aideSocialeASS;
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
          this.aideSocialeSelected = aide;
        }
      });
    } else {
      this.aideSocialeSelected = null;
    }
  }
}
