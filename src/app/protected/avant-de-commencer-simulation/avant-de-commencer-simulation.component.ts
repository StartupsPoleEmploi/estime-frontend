import { Component, OnInit } from '@angular/core';
import { IndividuConnectedService } from '@app/core/services/connexion/individu-connected.service';
import { ModalService } from '@app/core/services/utile/modal.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { PageTitlesEnum } from "@enumerations/page-titles.enum";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-avant-de-commencer-simulation',
  templateUrl: './avant-de-commencer-simulation.component.html',
  styleUrls: ['./avant-de-commencer-simulation.component.scss']
})
export class AvantDeCommencerSimulationComponent implements OnInit {

  isPageLoadingDisplay = false;
  isChoixSimulationDisplay = false;
  isBeneficiaireARE = false;
  messageErreur: string;

  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  subscriptionPopstateEventObservable: Subscription;

  constructor(
    private individuConnectedService: IndividuConnectedService,
    public screenService: ScreenService,
    public modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.isChoixSimulationDisplay = this.isEligibleChoixConnexion();
  }

  public commencerSimulation() {
    this.isChoixSimulationDisplay = false;
  }


  private isEligibleChoixConnexion(): boolean {
    const individuConnected = this.individuConnectedService.getIndividuConnected();
    if (individuConnected === null || (individuConnected.beneficiaireAides != null && individuConnected.beneficiaireAides.beneficiaireARE)) {
      if (individuConnected != null && individuConnected.beneficiaireAides != null && individuConnected.beneficiaireAides.beneficiaireARE) {
        this.isBeneficiaireARE = true;
      }
      return true;
    } return false;
  }
}
