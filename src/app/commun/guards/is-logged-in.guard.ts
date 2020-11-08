import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/utile/auth-service.service';
import { RoutesEnum } from "@enumerations/routes.enum";

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const isLoggedIn = this.authService.isLoggedIn();
      if(!isLoggedIn) {
        this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
      }
      return isLoggedIn;
  }

}