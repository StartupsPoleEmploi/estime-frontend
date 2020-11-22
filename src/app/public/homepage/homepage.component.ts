import { Component, OnInit } from '@angular/core';

import { AuthorizationService } from '@app/core/services/access-control/authorization.service';
import { RoutesEnum } from '@enumerations/routes.enum';
import { Router } from '@angular/router';
import { EtapeSimulationService } from '@app/core/services/utile/etape-simulation.service';
import { QuestionService } from "@app/core/services/utile/question.service";
import { Question } from '@models/question';
import { TemoignageService } from "@app/core/services/utile/temoignage.service";
import { Temoignage } from '@app/commun/models/temoignage';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { MessageErreur } from '@app/commun/models/message-erreur';
import { CodesMessagesErreurEnum } from "@enumerations/codes-messages-erreur.enum";
import { NiveauMessagesErreurEnum } from "@enumerations/niveaux-message-erreur";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  etapesSimulation: Array<string>;
  isSmallScreen: boolean;
  messageErreur: MessageErreur;
  niveauMessageErreur = 'danger';
  questions: Array<Question>;
  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;
  temoignages: Array<Temoignage>;

  constructor(
    private authorizationService: AuthorizationService,
    private etapeSimulationService: EtapeSimulationService,
    private questionService: QuestionService,
    private router: Router,
    private screenService: ScreenService,
    private temoignageService: TemoignageService
    ) {
      this.gererResizeScreen();
    }

  ngOnInit() {
    this.checkDemandeurEmploiConnecte();
    this.loadEtapesSimulation();
    this.loadQuestions();
    this.loadTemoignages();
    this.isSmallScreen = this.screenService.isSmallScreen();
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }

  public login(): void {
    this.authorizationService.login();
  }

  private loadEtapesSimulation(): void {
    this.etapesSimulation = this.etapeSimulationService.getEtapesSimulation();
  }

  private loadQuestions():void {
    this.questions = this.questionService.getQuestions();
  }

  private loadTemoignages(): void {
    this.temoignages = this.temoignageService.getTemoignages();
  }

  private checkDemandeurEmploiConnecte():void {
    if(this.authorizationService.isLoggedIn()) {
      this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION], { replaceUrl: true });
    } else {
      this.messageErreur = this.authorizationService.getMessageErreur();
      if(this.messageErreur) {
        if(this.messageErreur.code && this.messageErreur.code === CodesMessagesErreurEnum.INDIVIDU_NON_BENEFICIAIRE_MINIMA_SOCIAUX) {
          this.niveauMessageErreur = NiveauMessagesErreurEnum.INFO;
        } else {
          this.niveauMessageErreur = NiveauMessagesErreurEnum.ERROR;
        }
      }
    }
  }

  private gererResizeScreen(): void {
    this.resizeObservable = fromEvent(window, 'resize')
    this.resizeSubscription = this.resizeObservable.subscribe( evt => {
      this.isSmallScreen = this.screenService.isSmallScreen();
    })
  }
}
