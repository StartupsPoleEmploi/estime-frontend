import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '@app/core/services/connexion/authorization.service';
import { IndividuConnectedService } from "@app/core/services/connexion/individu-connected.service";
import { PeConnectService } from "@app/core/services/connexion/pe-connect.service";
import { QuestionService } from "@app/core/services/utile/question.service";
import { ScreenService } from '@app/core/services/utile/screen.service';
import { TemoignageService } from "@app/core/services/utile/temoignage.service";
import { CodesMessagesErreurEnum } from "@enumerations/codes-messages-erreur.enum";
import { NiveauMessagesErreurEnum } from "@enumerations/niveaux-message-erreur";
import { RoutesEnum } from '@enumerations/routes.enum';
import { MessageErreur } from '@models/message-erreur';
import { Question } from '@models/question';
import { Temoignage } from '@models/temoignage';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  isSmallScreen: boolean;
  messageErreur: MessageErreur;
  niveauMessageErreur = 'danger';
  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;

  constructor(
    private authorizationService: AuthorizationService,
    private individuConnectedService: IndividuConnectedService,
    private peConnectService: PeConnectService,
    private router: Router,
    private screenService: ScreenService
    ) {
      this.gererResizeScreen();
    }

  ngOnInit(): void {
    this.checkDemandeurEmploiConnecte();
    this.isSmallScreen = this.screenService.isSmallScreen();
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }

  public login(): void {
    this.peConnectService.login();
  }

  private checkDemandeurEmploiConnecte():void {
    if(this.individuConnectedService.isLoggedIn()) {
      this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
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
