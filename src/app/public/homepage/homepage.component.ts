import { Component, OnInit } from '@angular/core';

import { AuthService } from '@services-utiles/auth-service.service';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { Router } from '@angular/router';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  messageErreur: string;

  constructor(
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    if(this.authService.isLoggedIn()) {
      this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION], { replaceUrl: true });
    } else {
      this.messageErreur = this.authService.getMessageErreur();
    }
  }

  login() {
    this.authService.login();
  }


}
