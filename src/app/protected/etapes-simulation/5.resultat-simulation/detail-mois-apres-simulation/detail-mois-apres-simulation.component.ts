import { LocationStrategy } from '@angular/common';
import { Component, Input, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Aide } from '@app/commun/models/aide';
import { SimulationMensuelle } from '@app/commun/models/simulation-mensuelle';
import { DeConnecteSimulationAidesService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-simulation-aides.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { AidesService } from '@app/core/services/utile/aides.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { SideModalService } from '@app/core/services/utile/side-modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-detail-mois-apres-simulation',
  templateUrl: './detail-mois-apres-simulation.component.html',
  styleUrls: ['./detail-mois-apres-simulation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailMoisApresSimulationComponent implements OnInit {

  @Input() simulationActuelle: SimulationMensuelle;
  @Input() modalRef: BsModalRef;
  @Output() aideSelection = new EventEmitter<Aide>();

  aideMois: Aide[];
  revenusMois: Aide[];
  aidesEtRevenusMois: Aide[];

  aideSelected: Aide[];

  constructor(
    private aidesService: AidesService,
    public dateUtileService: DateUtileService,
    public deConnecteSimulationAidesService: DeConnecteSimulationAidesService,
    private deConnecteService: DeConnecteService,
    public screenService: ScreenService,
    private location: LocationStrategy,
    public sideModalService: SideModalService) {
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      if (typeof this.aideSelected == undefined) {
        this.sideModalService.closeSideModalMois();
      }
    });
  }

  ngOnInit(): void {
    let demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.aideMois = this.deConnecteSimulationAidesService.getAidesSimulationMensuelle(this.simulationActuelle);
    this.revenusMois = this.deConnecteSimulationAidesService.getRevenusApresSimulation(demandeurEmploiConnecte);
    this.aidesEtRevenusMois = this.aideMois.concat(this.revenusMois);
    this.orderAidesEtRevenusMois();
  }

  private orderAidesEtRevenusMois() {
    this.aidesEtRevenusMois.sort((a, b) => b.montant - a.montant);
  }

  public isAideADemander(aide: Aide): boolean {
    return this.aidesService.isAideDemandeurPourraObtenir(aide);
  }

  public onClickOnAide(aide): void {
    this.aideSelected = aide;
    this.aideSelection.emit(aide);
  }

  public handleKeyUpOnAide(event: any, aide: Aide) {
    if (event.keyCode === 13) {
      this.onClickOnAide(aide);
    }
  }

  public handleKeyUpOnRetour(event: any) {
    if (event.keyCode === 13) {
      this.sideModalService.closeSideModalMois()
    }
  }

  public isAideSelected(aide): boolean {
    return this.aideSelected == aide;
  }

  public isAideAvecDetail(aide): boolean {
    return this.aidesService.isAideAvecDetail(aide);
  }
}
