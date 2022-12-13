import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { PageHeadlineEnum } from '@app/commun/enumerations/page-headline.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { Environment } from '@app/commun/models/environment';
import { AuthorizationService } from '@app/core/services/connexion/authorization.service';
import { IndividuConnectedService } from '@app/core/services/connexion/individu-connected.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { RedirectionExterneService } from '@app/core/services/utile/redirection-externe.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalChoixConnexionComponent } from './modal-choix-connexion/modal-choix-connexion.component';

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

  PageHeadlineEnum: typeof PageHeadlineEnum = PageHeadlineEnum;
  @Input() isBeneficiaireARE: boolean;
  @Output() commencerSimulationParcoursToutesAides = new EventEmitter<any>();
  @Output() commencerSimulationParcoursComplementARE = new EventEmitter<any>();
  @ViewChild(ModalChoixConnexionComponent) modalChoixConnexionComponent;

  config: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    animated: true,
    ignoreBackdropClick: true,
    class: 'gray half-top full-height-modal not-side-modal'
  };

  constructor(
    public screenService: ScreenService,
    private redirectionExterneService: RedirectionExterneService,
    private environment: Environment,
    private estimeApiService: EstimeApiService,
    private deConnecteService: DeConnecteService,
    private bsModalService: BsModalService,
    private individuConnectedService: IndividuConnectedService,
    private authorizationService: AuthorizationService,
    private router: Router
  ) { }

  public clickOnSimulationComplete() {
    this.openModalOnEventChoixConnexion();
  }

  public openModalOnEventChoixConnexion() {
    if (this.individuConnectedService.isLoggedIn()) this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.AVANT_COMMENCER_SIMULATION]);
    else {
      const modalRef = this.bsModalService.show(ModalChoixConnexionComponent, this.config);
      modalRef.content.notifyParent.subscribe((result) => {
        console.error(result);
        this.checkDemandeurEmploiConnecte();
      });
    }
  }

  private checkDemandeurEmploiConnecte(): void {
    const messageErreur = this.authorizationService.getMessageErreur();
    if (messageErreur) {
      this.messageErreur = messageErreur.texte;
    }
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
    this.router.navigate([RoutesEnum.PARCOURS_COMPLEMENT_ARE, RoutesEnum.SITUATION]);
  }

  private traiterErreurCreerDemandeurEmploi(_error: HttpErrorResponse): void {
    this.isPageLoadingDisplay = false;
    this.messageErreur = MessagesErreurEnum.ERREUR_SERVICE;
  }

}
