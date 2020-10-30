import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/utile/auth-service.service';
import { RoutesEnum } from "@enumerations/routes.enum";

@Component({
  selector: 'app-signin-callback',
  template: `<div></div>`
})

export class SigninRedirectCallbackComponent implements OnInit {
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.authService.completeLogin().then(informationsAccessTokenPeConnect => {
      this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION], { replaceUrl: true });
    })
  }
}
