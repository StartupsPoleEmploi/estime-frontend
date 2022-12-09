import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { Environment } from '@app/commun/models/environment';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { RedirectionExterneService } from '@app/core/services/utile/redirection-externe.service';
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-choix-type-de-simulation',
  templateUrl: './choix-type-de-simulation.component.html',
  styleUrls: ['./choix-type-de-simulation.component.scss']
})
export class ChoixTypeDeSimulationComponent {

  private static URL_SIMUL_CALCUL = "https://candidat.pole-emploi.fr/candidat/simucalcul/repriseemploi"

  isPageLoadingDisplay: boolean = false;
  demandeurConnecte: DemandeurEmploi;
  messageErreur: string;


  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  @Input() isBeneficiaireARE: boolean;
  @Output() commencerSimulationParcoursToutesAides = new EventEmitter<any>();
  @Output() commencerSimulationParcoursComplementARE = new EventEmitter<any>();

  constructor(
    public screenService: ScreenService,
    private redirectionExterneService: RedirectionExterneService,
    private environment: Environment,
    private estimeApiService: EstimeApiService,
    private deConnecteService: DeConnecteService,
    private router: Router
  ) { }

  public clickOnSimulationComplete() {
    this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.AVANT_COMMENCER_SIMULATION]);
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
      this.estimeApiService.creerDemandeurEmploi().subscribe({
        next: this.traiterRetourCreerDemandeurEmploi.bind(this),
        error: this.traiterErreurCreerDemandeurEmploi.bind(this)
      });
    }
  }

  public handleKeyUpOnSimulationRapide(e: any): void {
    e.preventDefault();
    if (e.keyCode === 13) {
      this.clickOnSimulationRapide();
    }
  }

  private traiterRetourCreerDemandeurEmploi(demandeurEmploi: DemandeurEmploi): void {
    this.deConnecteService.setDemandeurEmploiConnecte(demandeurEmploi);
    this.isPageLoadingDisplay = false;
    this.router.navigate([RoutesEnum.PARCOURS_COMPLEMENT_ARE, RoutesEnum.MA_SITUATION]);
  }

  private traiterErreurCreerDemandeurEmploi(_error: HttpErrorResponse): void {
    this.isPageLoadingDisplay = false;
    this.messageErreur = MessagesErreurEnum.ERREUR_SERVICE;
  }

}
