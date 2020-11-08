import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/utile/auth-service.service';
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
    private authService: AuthService,
    private router: Router
    ) {
    this.authService.loginChanged.subscribe(loggedIn =>  {
      this.isLoggedIn = loggedIn;
    })
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  public logout(): void {
    this.authService.logout();
  }

  public onClickLogoEstime(): void {
    this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
  }
}
