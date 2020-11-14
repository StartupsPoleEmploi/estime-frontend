import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '@app/core/services/utile/authentication.service';
import { RoutesEnum } from '@enumerations/routes.enum';
import { Router } from '@angular/router';
import { EtapeSimulationService } from '@app/core/services/utile/etape-simulation.service';
import { QuestionService } from "@app/core/services/utile/question.service";
import { Question } from '@models/question';
import { TemoignageService } from "@app/core/services/utile/temoignage.service";
import { Temoignage } from '@app/commun/models/temoignage';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  etapesSimulation: Array<string>;
  isSmallScreen: boolean;
  messageErreur: string;
  questions: Array<Question>;
  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;
  temoignages: Array<Temoignage>;

  constructor(
    private authenticationService: AuthenticationService,
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
    this.authenticationService.login();
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
    if(this.authenticationService.isLoggedIn()) {
      this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION], { replaceUrl: true });
    } else {
      this.messageErreur = this.authenticationService.getMessageErreur();
    }
  }

  private gererResizeScreen(): void {
    this.resizeObservable = fromEvent(window, 'resize')
    this.resizeSubscription = this.resizeObservable.subscribe( evt => {
      this.isSmallScreen = this.screenService.isSmallScreen();
    })
  }
}
