import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { ModalService } from '@app/core/services/utile/modal.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { PageHeadlineEnum } from "@app/commun/enumerations/page-headline.enum";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-avant-de-commencer-simulation',
  templateUrl: './avant-de-commencer-simulation.component.html',
  styleUrls: ['./avant-de-commencer-simulation.component.scss']
})
export class AvantDeCommencerSimulationComponent {


  isPageLoadingDisplay = false;
  messageErreur: string;

  PageHeadlineEnum: typeof PageHeadlineEnum = PageHeadlineEnum;
  subscriptionPopstateEventObservable: Subscription;

  constructor(
    private deConnecteService: DeConnecteService,
    private estimeApiService: EstimeApiService,
    private router: Router,
    public screenService: ScreenService,
    public modalService: ModalService
  ) { }

  public onClickButtonJeContinue(): void {
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
    this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.CONTRAT_TRAVAIL]);
  }

  private traiterErreurCreerDemandeurEmploi(_error: HttpErrorResponse): void {
    this.isPageLoadingDisplay = false;
    this.messageErreur = MessagesErreurEnum.ERREUR_SERVICE;
  }
}
