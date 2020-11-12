import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/services/utile/authentication.service';
import { RoutesEnum } from './commun/enumerations/routes.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'estime';
  isLoggedIn = false

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
    ) {
    this.authenticationService.loginChanged.subscribe(loggedIn =>  {
      this.isLoggedIn = loggedIn;
    })
  }

  ngOnInit() {
    this.isLoggedIn = this.authenticationService.isLoggedIn();
  }

  public logout(): void {
    this.authenticationService.logout();
  }

  public onClickLogoEstime(): void {
    this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
  }
}
