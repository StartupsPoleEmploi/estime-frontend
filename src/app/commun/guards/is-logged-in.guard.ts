import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { AuthorizationService } from '@app/core/services/access-control/authorization.service';
import { RoutesEnum } from "@enumerations/routes.enum";

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const isLoggedIn = this.authorizationService.isLoggedIn();
      if(!isLoggedIn) {
        this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
      }
      return isLoggedIn;
  }

}