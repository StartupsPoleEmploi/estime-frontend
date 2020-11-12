import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/services/utile/authentication.service';
import { RoutesEnum } from "@enumerations/routes.enum";

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const isLoggedIn = this.authenticationService.isLoggedIn();
      if(!isLoggedIn) {
        this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
      }
      return isLoggedIn;
  }

}