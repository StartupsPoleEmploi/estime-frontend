import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/utile/auth-service.service';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { RoutesEnum } from '@enumerations/routes.enum';
import { Router } from '@angular/router';

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
    if(this.isLoggedIn) {
      this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION], { replaceUrl: true });
    }
  }

  logout() {
    this.authService.logout();
  }
}
