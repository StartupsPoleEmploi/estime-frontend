import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalSessionExpiredComponent } from '@app/commun/components/modal-session-expired/modal-session-expired.component';
import { RoutesEnum } from '@enumerations/routes.enum';
import { BnNgIdleService } from 'bn-ng-idle';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { CookiesEstimeService } from '../storage/cookies-estime.service';
import { SessionStorageEstimeService } from '../storage/session-storage-estime.service';
import { EtapeSimulationService } from '../utile/etape-simulation.service';

@Injectable({ providedIn: 'root' })
export class SessionPeConnectExpiredService {

  subscriptionStartWatchingObservable: Subscription;

  constructor(
    private bnNgIdleService: BnNgIdleService,
    private bsModalService: BsModalService,
    private cookiesEstimeService: CookiesEstimeService,
    private etapeSimulationService: EtapeSimulationService,
    private router: Router,
    private sessionStorageEstimeService: SessionStorageEstimeService
  ) {

  }

  ngOnDestroy(): void {
    this.subscriptionStartWatchingObservable.unsubscribe();
  }

  config: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    animated: true,
    ignoreBackdropClick: true,
    class: 'gray half-top full-height-modal not-side-modal'
  };

  public startCheckUserInactivity() {
    const individuConnectePeConnectAuthorization = this.cookiesEstimeService.getIndividuConnectePeConnectAuthorization();
    //appelé quand la session utilisateur PE Connect a expirée
    this.subscriptionStartWatchingObservable = this.bnNgIdleService.startWatching(individuConnectePeConnectAuthorization.peConnectAuthorization.expireIn).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        this.openModal();
        this.bnNgIdleService.stopTimer();
      }
    });
  }

  public openModal(): void {
    this.bsModalService.show(ModalSessionExpiredComponent, this.config);
  }

  public isIndividuBackAfterSessionExpired(): boolean {
    const pathRouteActivated = this.sessionStorageEstimeService.getPathRouteActivatedByUser();
    return !!pathRouteActivated;
  }

  public navigateToRouteActivated(): void {
    if (this.isMemeIndividuReconnecteAfterSessionPeConnectExpired()) {
      this.traiterReconnexionMemeIndividu();
    } else {
      this.traiterReconnexionIndividuDifferent();
    }
  }

  private isMemeIndividuReconnecteAfterSessionPeConnectExpired(): boolean {
    let isMemeIndividu = false;
    const deConnecte = this.sessionStorageEstimeService.getDemandeurEmploiConnected();
    const individuConnectePeConnectAuthorization = this.cookiesEstimeService.getIndividuConnectePeConnectAuthorization();
    if (deConnecte && individuConnectePeConnectAuthorization) {
      isMemeIndividu = deConnecte.idPoleEmploi === individuConnectePeConnectAuthorization.idPoleEmploi;
    }
    return isMemeIndividu;
  }

  private traiterReconnexionMemeIndividu(): void {
    const pathRouteActivated = this.sessionStorageEstimeService.getPathRouteActivatedByUser();
    if (pathRouteActivated !== RoutesEnum.ETAPES_SIMULATION) {
      if (this.etapeSimulationService.isPathRouteEtapesSimulation(pathRouteActivated)) {
        this.router.navigate([RoutesEnum.ETAPES_SIMULATION, pathRouteActivated]);
      } else {
        this.router.navigate([pathRouteActivated]);
      }
    } else {
      this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
    }
    this.sessionStorageEstimeService.clearPathRouteActivatedByUser();
  }

  private traiterReconnexionIndividuDifferent(): void {
    this.sessionStorageEstimeService.clear();
    this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
  }
}
