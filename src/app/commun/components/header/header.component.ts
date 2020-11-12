import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/services/utile/authentication.service';
import { RoutesEnum } from '@enumerations/routes.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.authenticationService.loginChanged.subscribe(loggedIn =>  {
      this.isLoggedIn = loggedIn;
    })
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authenticationService.isLoggedIn();
  }

  public logout(): void {
    this.authenticationService.logout();
  }

  public onClickLogoEstime(): void {
    this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
  }
}
