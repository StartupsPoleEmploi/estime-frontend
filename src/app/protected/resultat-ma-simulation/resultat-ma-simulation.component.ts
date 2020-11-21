import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AideSociale } from '@app/commun/models/aide-sociale';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { SimulationMensuelle } from '@app/commun/models/simulation-mensuelle';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { ScreenService } from "@app/core/services/utile/screen.service";
import { CodesAidesEnum } from "@enumerations/codes-aides.enum";
import { RoutesEnum } from '@enumerations/routes.enum';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { DeConnecteRessourcesFinancieresService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { SimulationAidesSociales } from '@app/commun/models/simulation-aides-sociales';
import { DeConnecteSimulationAidesSocialesService } from "@app/core/services/demandeur-emploi-connecte/deConnecte-simulation-aides-sociales.service";

@Component({
  selector: 'app-resultat-ma-simulation',
  templateUrl: './resultat-ma-simulation.component.html',
  styleUrls: ['./resultat-ma-simulation.component.scss']
})
export class ResultatMaSimulationComponent implements OnInit {

  aideSocialeSelected: AideSociale;
  demandeurEmploiConnecte: DemandeurEmploi;
  isSmallScreen: boolean;
  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;
  simulationAidesSociales: SimulationAidesSociales;
  simulationSelected: SimulationMensuelle;

  constructor(
    private dateUtileService: DateUtileService,
    public deConnecteService: DeConnecteService,
    public deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    private deConnecteSimulationAidesSocialesService: DeConnecteSimulationAidesSocialesService,
    private router: Router,
    private screenService: ScreenService
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
    if (this.demandeurEmploiConnecte.situationFamiliale.isEnCouple) {
      this.router.navigate([RoutesEnum.RESSOURCES_FINANCIERES_CONJOINT], { replaceUrl: true });
    } else {
      this.router.navigate([RoutesEnum.RESSOURCES_FINANCIERES], { replaceUrl: true });
    }
  }

  public hasAidesObtenir(): boolean {
    let hasAidesObtenir = false;
    if (Object.entries(this.simulationSelected.mesAides).length > 1) {
      hasAidesObtenir = true;
    }
    if (Object.entries(this.simulationSelected.mesAides).length === 1) {
      for (let [codeAide, aide] of Object.entries(this.simulationSelected.mesAides)) {
        if (codeAide !== CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE) {
          hasAidesObtenir = true;
        }
      }
    }
    return hasAidesObtenir;
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
    if (this.hasAidesObtenir()) {
      for (let [codeAide, aide] of Object.entries(this.simulationSelected.mesAides)) {
        if (!this.aideSocialeSelected && codeAide !== CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE) {
          this.aideSocialeSelected = aide;
        }
      }
    } else {
      this.aideSocialeSelected = null;
    }
  }
}
