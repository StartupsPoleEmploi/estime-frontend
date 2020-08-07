import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/utile/auth-service.component';

@Component({
  selector: 'app-signin-callback',
  template: `<div></div>`
})

export class SigninRedirectCallbackComponent implements OnInit {
  constructor(private _authService: AuthService,
              private _router: Router) { }

  ngOnInit() {
    this._authService.completeLogin().then(user => {
      this._router.navigate(['/recapitulatif-infos-de'], { replaceUrl: true });
    })
  }
}
