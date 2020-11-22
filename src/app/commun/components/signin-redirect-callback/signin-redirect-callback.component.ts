import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '@app/core/services/access-control/authorization.service';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';

@Component({
  selector: 'app-signin-redirect-callback',
  templateUrl: './signin-redirect-callback.component.html',
  styleUrls: ['./signin-redirect-callback.component.scss']
})
export class SigninRedirectCallbackComponent implements OnInit {

  isPageLoadingDisplay = false;

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router) { }

  ngOnInit() {
    this.isPageLoadingDisplay = true;
    this.authorizationService.completeLogin().then(
      (demandeur) => {
        this.isPageLoadingDisplay = false;
        this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION], { replaceUrl: true });
      }, (erreur) => {
        this.isPageLoadingDisplay = false;
        this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
      });
  }


}
