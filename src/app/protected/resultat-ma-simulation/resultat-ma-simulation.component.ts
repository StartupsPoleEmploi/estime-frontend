import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { RoutesEnum } from '@enumerations/routes.enum';
import { Router } from '@angular/router';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { SimulationMensuelle } from '@app/commun/models/simulation-mensuelle';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { CodesAidesEnum } from "@enumerations/codes-aides.enum";
import { AideSociale } from '@app/commun/models/aide-sociale';
import { ScreenService } from "@app/core/services/utile/screen.service";

@Component({
  selector: 'app-resultat-ma-simulation',
  templateUrl: './resultat-ma-simulation.component.html',
  styleUrls: ['./resultat-ma-simulation.component.scss']
})
export class ResultatMaSimulationComponent implements OnInit {

  demandeurEmploiConnecte: DemandeurEmploi;
  simulationSelected: SimulationMensuelle;
  aideSocialeSelected: AideSociale;

  constructor(
    private dateUtileService: DateUtileService,
    public demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    private router: Router,
    private screenService: ScreenService
  ) {

  }

  ngOnInit(): void {
    this.loadData();
  }

  public onClickButtonSimulationMensuelle(simulationMensuel: SimulationMensuelle): void {
    if (this.screenService.isOnSmartphone()) {
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
    return index === this.demandeurEmploiConnecte.simulationAidesSociales.simulationsMensuelles.length - 1;
  }

  public isSimulationMensuelleSelected(simulationMensuelle: SimulationMensuelle): boolean {
    return this.simulationSelected && simulationMensuelle.datePremierJourMoisSimule === this.simulationSelected.datePremierJourMoisSimule;
  }

  public isLastSimulationMensuelle(index: number) {
    return index === this.demandeurEmploiConnecte.simulationAidesSociales.simulationsMensuelles.length - 1
  }

  public onClickButtonRetour(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale.isEnCouple) {
      this.router.navigate([RoutesEnum.RESSOURCES_FINANCIERES_CONJOINT], { replaceUrl: true });
    } else {
      this.router.navigate([RoutesEnum.MES_RESSOURCES_FINANCIERES], { replaceUrl: true });
    }
  }

  public getTitrePage(): string {
    let titre = "5. Résultat de ma simulation";
    if (this.demandeurEmploiConnecte.situationFamiliale.isEnCouple) {
      titre = "6. Résultat de ma simulation";
    }
    return titre;
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

  private loadData(): void {
    this.demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    //si l'utilisateur est sur smartphone, aucune préselection
    if (!this.screenService.isOnSmartphone()) {
      this.simulationSelected = this.demandeurEmploiConnecte.simulationAidesSociales.simulationsMensuelles[0];
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
