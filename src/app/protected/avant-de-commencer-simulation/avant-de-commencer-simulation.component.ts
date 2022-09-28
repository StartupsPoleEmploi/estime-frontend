import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { IndividuConnectedService } from '@app/core/services/connexion/individu-connected.service';
import { ModalService } from '@app/core/services/utile/modal.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { PageTitlesEnum } from "@enumerations/page-titles.enum";
import { RoutesEnum } from '@enumerations/routes.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-avant-de-commencer-simulation',
  templateUrl: './avant-de-commencer-simulation.component.html',
  styleUrls: ['./avant-de-commencer-simulation.component.scss']
})
export class AvantDeCommencerSimulationComponent implements OnInit, OnDestroy {

  isPageLoadingDisplay = false;
  isChoixSimulationDisplay = false;
  isBeneficiaireARE = false;
  messageErreur: string;

  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  subscriptionPopstateEventObservable: Subscription;

  constructor(
    private individuConnectedService: IndividuConnectedService,
    private router: Router,
    public screenService: ScreenService,
    public modalService: ModalService
  ) {
    this.subscribePopstateEventObservable();
  }

  ngOnInit(): void {
    this.isChoixSimulationDisplay = this.isEligibleChoixConnexion();
  }

  ngOnDestroy(): void {
    this.subscriptionPopstateEventObservable.unsubscribe();
  }

  /** Subscription
   *
   * Permet d'observer les évenements de router et notamment les événements type "popstate" qui concernent les retours en arrière du navigateur
   * Si le retour en arrière pointe vers la route /signin-callback, on le redirige vers la homepage
   *
   * Permet de régler le soucis de l'appel à l'authentification côté backend au retour à l'arrière générant des erreurs 400
   * en évitant d'utiliser deux fois le même code de récupération d'access_token
   */
  private subscribePopstateEventObservable(): void {
    this.subscriptionPopstateEventObservable = this.router.events.subscribe(routerEvent => {
      if (routerEvent instanceof NavigationStart && routerEvent.navigationTrigger === "popstate") {
        if (routerEvent.url.split('?')[0] == `/${RoutesEnum.SIGNIN_CALLBACK}`) {
          this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
        }
      }
    });
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
