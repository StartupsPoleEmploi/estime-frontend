import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { Environment } from '@app/commun/models/environment';
import { RedirectionExterneService } from '@app/core/services/utile/redirection-externe.service';
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-choix-type-de-simulation',
  templateUrl: './choix-type-de-simulation.component.html',
  styleUrls: ['./choix-type-de-simulation.component.scss']
})
export class ChoixTypeDeSimulationComponent {

  private static URL_SIMUL_CALCUL = "https://candidat.pole-emploi.fr/candidat/simulationcalcul?serviceId=repriseEmploi"

  isPageLoadingDisplay: boolean = false;
  demandeurConnecte: DemandeurEmploi;


  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  @Input() isBeneficiaireARE: boolean;
  @Output() commencerSimulationParcoursToutesAides = new EventEmitter<any>();
  @Output() commencerSimulationParcoursComplementARE = new EventEmitter<any>();

  constructor(
    public screenService: ScreenService,
    private redirectionExterneService: RedirectionExterneService,
    private environment: Environment
  ) { }

  public clickOnSimulationComplete() {
    this.commencerSimulationParcoursToutesAides.emit();
  }
  public handleKeyUpOnSimulationComplete(e: any): void {
    e.preventDefault();
    if (e.keyCode === 13) {
      this.clickOnSimulationComplete();
    }
  }

  public clickOnSimulationRapide() {
    if (this.isBeneficiaireARE || !this.environment.enableParcoursComplementARE) {
      this.redirectionExterneService.navigate(ChoixTypeDeSimulationComponent.URL_SIMUL_CALCUL);
    } else {
      this.commencerSimulationParcoursComplementARE.emit();
    }
  }

  public handleKeyUpOnSimulationRapide(e: any): void {
    e.preventDefault();
    if (e.keyCode === 13) {
      this.clickOnSimulationRapide();
    }
  }

}
