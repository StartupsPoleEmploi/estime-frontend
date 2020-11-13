import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/services/utile/authentication.service';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';

@Component({
  selector: 'app-signin-redirect-callback',
  templateUrl: './signin-redirect-callback.component.html',
  styleUrls: ['./signin-redirect-callback.component.scss']
})
export class SigninRedirectCallbackComponent implements OnInit {

  isPageLoadingDisplay = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    this.isPageLoadingDisplay = true;
    this.authenticationService.completeLogin().then(
      (demandeur) => {
        this.isPageLoadingDisplay = false;
        this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION], { replaceUrl: true });
      }, (erreur) => {
        this.isPageLoadingDisplay = false;
        this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
      });
  }


}
