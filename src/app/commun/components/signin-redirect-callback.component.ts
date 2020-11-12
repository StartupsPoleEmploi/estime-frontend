import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/services/utile/authentication.service';
import { RoutesEnum } from "@enumerations/routes.enum";

@Component({
  selector: 'app-signin-callback',
  template: `<div></div>`
})

export class SigninRedirectCallbackComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
    this.authenticationService.completeLogin().then(
      (demandeur) => {
      this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION], { replaceUrl: true });
    }, (erreur) => {
      this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
    });
  }
}
