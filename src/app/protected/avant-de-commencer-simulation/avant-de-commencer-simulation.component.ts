import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { Environment } from '@app/commun/models/environment';
import { IndividuConnectedService } from '@app/core/services/connexion/individu-connected.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { ModalService } from '@app/core/services/utile/modal.service';
import { RedirectionExterneService } from '@app/core/services/utile/redirection-externe.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { PageTitlesEnum } from "@enumerations/page-titles.enum";
import { Subscription } from 'rxjs';
import { ChoixTypeDeSimulationComponent } from './choix-type-de-simulation/choix-type-de-simulation.component';

@Component({
  selector: 'app-avant-de-commencer-simulation',
  templateUrl: './avant-de-commencer-simulation.component.html',
  styleUrls: ['./avant-de-commencer-simulation.component.scss']
})
export class AvantDeCommencerSimulationComponent implements OnInit {

  private static URL_SIMUL_CALCUL = "https://candidat.pole-emploi.fr/candidat/simulationcalcul?serviceId=repriseEmploi"

  isPageLoadingDisplay = false;
  isChoixSimulationDisplay = false;
  isBeneficiaireARE = false;
  messageErreur: string;

  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  subscriptionPopstateEventObservable: Subscription;

  isParcoursComplementARE: boolean = false;

  constructor(
    private individuConnectedService: IndividuConnectedService,
    private deConnecteService: DeConnecteService,
    private estimeApiService: EstimeApiService,
    private router: Router,
    private environment: Environment,
    private redirectionExterneService: RedirectionExterneService,
    public screenService: ScreenService,
    public modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.isChoixSimulationDisplay = this.isEligibleChoixConnexion();
  }

  public commencerSimulationParcoursToutesAides() {
    this.isChoixSimulationDisplay = false;
  }

  public accesParcoursComplementARE(): void {
    this.isParcoursComplementARE = true;
    this.isPageLoadingDisplay = true;
    this.estimeApiService.creerDemandeurEmploi().subscribe({
      next: this.traiterRetourCreerDemandeurEmploi.bind(this),
      error: this.traiterErreurCreerDemandeurEmploi.bind(this)
    });
  }

  public accesParcoursToutesAides(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (!demandeurEmploiConnecte) {
      this.isPageLoadingDisplay = true;
      this.estimeApiService.creerDemandeurEmploi().subscribe({
        next: this.traiterRetourCreerDemandeurEmploi.bind(this),
        error: this.traiterErreurCreerDemandeurEmploi.bind(this)
      });
    } else {
      this.router.navigate([`/${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.CONTRAT_TRAVAIL}`]);
    }
  }

  private traiterRetourCreerDemandeurEmploi(demandeurEmploi: DemandeurEmploi): void {
    this.deConnecteService.setDemandeurEmploiConnecte(demandeurEmploi);
    this.isPageLoadingDisplay = false;
    if (this.isParcoursComplementARE) {
      this.router.navigate([RoutesEnum.PARCOURS_COMPLEMENT_ARE, RoutesEnum.MA_SITUATION]);
    } else {
      this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.CONTRAT_TRAVAIL]);
    }
  }

  private traiterErreurCreerDemandeurEmploi(_error: HttpErrorResponse): void {
    this.isPageLoadingDisplay = false;
    this.messageErreur = MessagesErreurEnum.ERREUR_SERVICE;
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

  public isConnected(): boolean {
    return this.individuConnectedService.getIndividuConnected() != null;
  }
}
