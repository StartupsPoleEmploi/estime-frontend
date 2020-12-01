import { Injectable } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalSessionExpiredComponent } from '@app/commun/components/modal-session-expired/modal-session-expired.component';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { KeysStorageEnum } from '@app/commun/enumerations/keys-storage.enum';
import { DeConnecteService } from "@app/core/services/demandeur-emploi-connecte/de-connecte.service";
import { CookiesIndividuService } from "@app/core/services/access-control/cookies-individu.service";
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { BnNgIdleService } from 'bn-ng-idle';

@Injectable({ providedIn: 'root' })
export class SessionExpiredService {

  config: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    animated: true,
    ignoreBackdropClick: true,
  };

  constructor(
    private bnNgIdleService: BnNgIdleService,
    private cookiesIndividuService: CookiesIndividuService,
    private deConnecteService: DeConnecteService,
    private modalService: BsModalService,
    private router: Router,
    private sessionStorageService: SessionStorageService,
  ) {

  }

  public startWatchingUserActivity() {
    //once the user is idle for 19 minutes then the subscribe method will get invoked
    this.bnNgIdleService.startWatching(1140).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        this.openModal();
      }
    });
  }

  public openModal(): void {
    this.modalService.show(ModalSessionExpiredComponent, this.config);
  }

  public isBackAfterSessionExpired(): boolean {
    const pathRouteActivated = this.getPathRouteActivated();
    return !!pathRouteActivated;
  }

  public navigateToRouteActivated(): void {
    if (this.isMemeIndividuReconnecte()) {
      this.traiterReconnexionMemeIndividu();
    } else {
      this.traiterReconnexionIndividuDifferent();
    }
  }

  public saveRouteActivatedInSessionStorage(routeActivated: string): void {
    this.sessionStorageService.store(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_ROUTE_ACTIVATED_STORAGE_SESSION_KEY, routeActivated);
  }

  private getPathRouteActivated(): string {
    return this.sessionStorageService.retrieve(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_ROUTE_ACTIVATED_STORAGE_SESSION_KEY);
  }

  private unsetPathRouteActivated(): void {
    return this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_ROUTE_ACTIVATED_STORAGE_SESSION_KEY);
  }

  private isMemeIndividuReconnecte(): boolean {
    const deConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    const individuConnecte = this.cookiesIndividuService.getFromCookies();
    return deConnecte.idPoleEmploi === individuConnecte.idPoleEmploi;
  }

  private traiterReconnexionMemeIndividu(): void {
    const pathRouteActivated = this.getPathRouteActivated();
    this.router.navigate([pathRouteActivated], { replaceUrl: true });
    this.unsetPathRouteActivated();
  }

  private traiterReconnexionIndividuDifferent(): void {
    this.unsetPathRouteActivated();
    this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
    this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION_AIDES_SOCIALE);
    this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION], { replaceUrl: true });
  }
}