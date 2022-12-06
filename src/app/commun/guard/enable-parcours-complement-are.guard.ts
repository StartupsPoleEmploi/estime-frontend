import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RoutesEnum } from '../enumerations/routes.enum';
import { Environment } from '../models/environment';


@Injectable()
export class EnableParcoursComplementAREGuard implements CanActivate {
    constructor(
        private environment: Environment,
        private router: Router
    ) {
    }

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
        const enableParcoursComplementAREGuard = this.environment.enableParcoursComplementARE;
        if (!enableParcoursComplementAREGuard) {
            this.router.navigate([RoutesEnum.HOMEPAGE]);
        }
        return enableParcoursComplementAREGuard;
    }
}
