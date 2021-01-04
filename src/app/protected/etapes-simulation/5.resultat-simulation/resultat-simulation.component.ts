import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DeConnecteRessourcesFinancieresService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { DeConnecteSimulationAidesSocialesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-simulation-aides-sociales.service";
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { ScreenService } from "@app/core/services/utile/screen.service";
import { CodesAidesEnum } from "@enumerations/codes-aides.enum";
import { AideSociale } from '@models/aide-sociale';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { SimulationAidesSociales } from '@models/simulation-aides-sociales';
import { SimulationMensuelle } from '@models/simulation-mensuelle';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { SimulationPdfMakerService } from "@app/core/services/pdf-maker/simulation-pdf-maker.service";
import { AidesService } from '@app/core/services/utile/aides.service';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';

@Component({
  selector: 'app-resultat-simulation',
  templateUrl: './resultat-simulation.component.html',
  styleUrls: ['./resultat-simulation.component.scss']
})
export class ResultatSimulationComponent implements OnInit {

  aideSocialeSelected: AideSociale;
  demandeurEmploiConnecte: DemandeurEmploi;
  isSmallScreen: boolean;
  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;
  simulationAidesSociales: SimulationAidesSociales;
  simulationSelected: SimulationMensuelle;
  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;

  @Output() retourEtapePrecedenteEventEmitter = new EventEmitter<void>();

  constructor(
    private aidesServices: AidesService,
    private dateUtileService: DateUtileService,
    public deConnecteService: DeConnecteService,
    public deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    public deConnecteSimulationAidesSocialesService: DeConnecteSimulationAidesSocialesService,
    private screenService: ScreenService,
    private simulationPdfMakerService:SimulationPdfMakerService
  ) {
    this.gererResizeScreen();
  }

  ngOnInit(): void {
    this.demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.loadDataSimulationAidesSociales();
    this.isSmallScreen = this.screenService.isSmallScreen();
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }

  public onClickButtonImprimerMaSimulation(): void {
    this.simulationPdfMakerService.generatePdf(this.demandeurEmploiConnecte, this.simulationAidesSociales);
  }

  public onClickButtonSimulationMensuelle(simulationMensuel: SimulationMensuelle): void {
    if (this.screenService.isSmallScreen()) {
      this.traiterOnClickButtonSimulationMensuelleForSmartphone(simulationMensuel);
    } else {
      this.simulationSelected = simulationMensuel;
      this.aideSocialeSelected = null;
      this.selectFirstAideSociale();
    }
  }

  public changeAideSocialeSelected(aideSocialeSelected: AideSociale) {
    this.aideSocialeSelected = aideSocialeSelected;
  }

  public getDateStringFormat(simulationMensuelle: SimulationMensuelle): string {
    const dateSimulation = simulationMensuelle.datePremierJourMoisSimule;
    return this.dateUtileService.getDateStringFormat(dateSimulation);
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
    this.retourEtapePrecedenteEventEmitter.emit();
  }

  public getSrcImgButtonImprimerSimulation(): string {
    let text = './assets/images/print.svg';
    if(this.isSmallScreen) {
      text = './assets/images/print.svg';
    }
    return text;
  }



  public getTextButtonImprimerSimulation(): string {
    let text = 'Imprimer la simulation';
    if(this.isSmallScreen) {
      text = 'Imprimer la simulation';
    }
    return text;
  }

  private gererResizeScreen(): void {
    this.resizeObservable = fromEvent(window, 'resize')
    this.resizeSubscription = this.resizeObservable.subscribe( evt => {
      this.isSmallScreen = this.screenService.isSmallScreen();
    })
  }

  private loadDataSimulationAidesSociales(): void {
    this.simulationAidesSociales = this.deConnecteSimulationAidesSocialesService.getSimulationAidesSociales();
    //si l'utilisateur est sur smartphone, aucune préselection
    if (!this.screenService.isSmallScreen()) {
      this.simulationSelected = this.simulationAidesSociales.simulationsMensuelles[0];
      this.selectFirstAideSociale();
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


  private selectFirstAideSociale(): void {
    if (this.aidesServices.hasAidesObtenir(this.simulationSelected)) {
      for (let [codeAide, aide] of Object.entries(this.simulationSelected.mesAides)) {
          if (codeAide !== CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE) {
            this.aideSocialeSelected = aide;
          }
      }
    } else {
      this.aideSocialeSelected = null;
    }
  }
}
