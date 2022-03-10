import { LocationStrategy } from '@angular/common';
import { Component, Input, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Aide } from '@app/commun/models/aide';
import { RessourceFinanciere } from '@app/commun/models/ressource-financiere';
import { SimulationMensuelle } from '@app/commun/models/simulation-mensuelle';
import { DeConnecteSimulationService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-simulation.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { RessourcesFinancieresService } from '@app/core/services/utile/ressources-financieres.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { SideModalService } from '@app/core/services/utile/side-modal.service';
import { SimulationService } from '@app/core/services/utile/simulation.service';
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

  ressourcesFinancieresEtAidesMois: RessourceFinanciere[];
  ressourceFinanciereOuAideSelected: RessourceFinanciere;

  constructor(
    private ressourcesFinancieresService: RessourcesFinancieresService,
    public dateUtileService: DateUtileService,
    public deConnecteSimulationService: DeConnecteSimulationService,
    public simulationService: SimulationService,
    public screenService: ScreenService,
    private location: LocationStrategy,
    public sideModalService: SideModalService) {
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      if (typeof this.ressourceFinanciereOuAideSelected == undefined) {
        this.sideModalService.closeSideModalMois();
      }
    });
  }

  ngOnInit(): void {
    this.ressourcesFinancieresEtAidesMois = this.simulationService.getRessourcesFinancieresEtAidesSimulationMensuelle(this.simulationActuelle);
    this.orderRessourcesFinancieresMois();
  }

  private orderRessourcesFinancieresMois() {
    this.ressourcesFinancieresEtAidesMois.sort((a, b) => b.montant - a.montant);
  }

  public isRessourceFinanciereOuAideADemander(ressourceFinanciereOuAide: RessourceFinanciere): boolean {
    return this.ressourcesFinancieresService.isRessourceFinanciereDemandeurPourraObtenir(ressourceFinanciereOuAide);
  }

  public onClickOnRessourceFinanciereOuAide(aide): void {
    if (this.isRessourceFinanciereOuAideAvecDetail(aide)) {
      this.ressourceFinanciereOuAideSelected = aide;
      this.aideSelection.emit(aide);
    }
  }

  public handleKeyUpOnRessourceFinanciereOuAide(event: any, ressourceFinanciereOuAide: RessourceFinanciere) {
    if (event.keyCode === 13) {
      this.onClickOnRessourceFinanciereOuAide(ressourceFinanciereOuAide);
    }
  }

  public handleKeyUpOnRetour(event: any) {
    if (event.keyCode === 13) {
      this.sideModalService.closeSideModalMois()
    }
  }

  public isRessourceFinanciereOuAideSelected(ressourceFinanciereOuAide: RessourceFinanciere): boolean {
    return this.ressourceFinanciereOuAideSelected == ressourceFinanciereOuAide;
  }

  public isRessourceFinanciereOuAideAvecDetail(ressourceFinanciereOuAide): boolean {
    return this.ressourcesFinancieresService.isRessourceFinanciereAvecDetail(ressourceFinanciereOuAide);
  }
}
