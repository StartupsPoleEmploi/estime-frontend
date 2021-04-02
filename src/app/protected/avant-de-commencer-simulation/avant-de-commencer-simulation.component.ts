import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { PageTitlesEnum } from "@enumerations/page-titles.enum";
import { RoutesEnum } from '@enumerations/routes.enum';

@Component({
  selector: 'app-avant-de-commencer-simulation',
  templateUrl: './avant-de-commencer-simulation.component.html',
  styleUrls: ['./avant-de-commencer-simulation.component.scss']
})
export class AvantDeCommencerSimulationComponent implements OnInit {

  isPageLoadingDisplay = false;
  messageErreur: string;

  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;

  question_icon_1: String = '';
  question_icon_2: String = '';

  constructor(
    private deConnecteService: DeConnecteService,
    private estimeApiService: EstimeApiService,
    private router: Router,
    public screenService: ScreenService
    ) {

    }

  ngOnInit(): void {
  }

  public onClickButtonJeContinue(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if(!demandeurEmploiConnecte) {
      this.isPageLoadingDisplay = true;
      this.estimeApiService.creerDemandeurEmploi().then(
        (demandeurEmploi) => {
          this.deConnecteService.setDemandeurEmploiConnecte(demandeurEmploi);
          this.isPageLoadingDisplay = false;
          this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.CONTRAT_TRAVAIL]);
        }, (erreur) => {
          this.isPageLoadingDisplay = false;
          this.messageErreur = MessagesErreurEnum.ERREUR_SERVICE;
        }
      );
    } else {
      this.router.navigate([`/${RoutesEnum.ETAPES_SIMULATION}/${RoutesEnum.CONTRAT_TRAVAIL}`]);
    }
  }

  public onMouseOverInfobulle(numero_infobulle) {
    if(numero_infobulle == 1) this.question_icon_1 = '_hover';
    if(numero_infobulle == 2) this.question_icon_2 = '_hover';
  }

  public onMouseLeaveInfobulle(numero_infobulle) {
    if(numero_infobulle == 1) this.question_icon_1 = '';
    if(numero_infobulle == 2) this.question_icon_2 = '';
  }
  public onClickInfobulle(numero_infobulle) {
    if(numero_infobulle == 1) this.question_icon_1 = '_click';
    if(numero_infobulle == 2) this.question_icon_2 = '_click';
  }



}
