import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '@app/core/services/access-control/authorization.service';
import { RoutesEnum } from '@enumerations/routes.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false

  constructor(
    private authorizationService: AuthorizationService,
    private router: Router
  ) {
    this.authorizationService.loginChanged.subscribe(loggedIn =>  {
      this.isLoggedIn = loggedIn;
    })
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authorizationService.isLoggedIn();
  }

  public logout(): void {
    this.authorizationService.logout();
  }

  public onClickLogoEstime(): void {
    this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
  }
}
