import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthorizationService } from '@app/core/services/access-control/authorization.service';
import { RoutesEnum } from "@enumerations/routes.enum";
import { SessionExpiredService } from "@app/core/services/access-control/session-expired.service";
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {



  constructor(
    private authorizationService: AuthorizationService,
    private deConnecteService: DeConnecteService,
    private sessionExpiredService: SessionExpiredService,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const isLoggedIn = this.authorizationService.isLoggedIn();
      if(!isLoggedIn) {
        const demandeurConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
        if(demandeurConnecte){
          this.sessionExpiredService.saveRouteActivatedInSessionStorage(route.routeConfig.path);
          this.authorizationService.login();
        } else {
          this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
        }
      }
      return isLoggedIn;
  }
}