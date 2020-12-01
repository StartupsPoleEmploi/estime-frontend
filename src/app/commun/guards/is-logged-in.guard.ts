import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { PeConnectService } from '@app/core/services/connexion/pe-connect.service';
import { RoutesEnum } from "@enumerations/routes.enum";
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { IndividuConnectedService } from "@app/core/services/connexion/individu-connected.service";
import { SessionStorageEstimeService } from "@app/core/services/storage/session-storage-estime.service";

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {



  constructor(
    private peConnectService: PeConnectService,
    private deConnecteService: DeConnecteService,
    private individuConnectedService: IndividuConnectedService,
    private router: Router,
    private sessionStorageEstimeService: SessionStorageEstimeService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      this.sessionStorageEstimeService.storeRouteActivatedByUser(route);
      const isLoggedIn = this.individuConnectedService.isLoggedIn();
      if(!isLoggedIn) {
        const demandeurConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
        if(demandeurConnecte){
          this.peConnectService.login();
        } else {
          this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
        }
      }
      return isLoggedIn;
  }
}