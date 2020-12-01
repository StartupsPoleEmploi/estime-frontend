import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IndividuConnectedService } from '@app/core/services/connexion/individu-connected.service';
import { RoutesEnum } from '@enumerations/routes.enum';
import { PeConnectService } from '@app/core/services/connexion/pe-connect.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false

  constructor(
    private individuConnectedService: IndividuConnectedService,
    private peConnectService: PeConnectService,
    private router: Router
  ) {
    this.individuConnectedService.statutIndividuChanged.subscribe(loggedIn =>  {
      this.isLoggedIn = loggedIn;
    })
  }

  ngOnInit(): void {
    this.isLoggedIn = this.individuConnectedService.isLoggedIn();
  }

  public logout(): void {
    this.peConnectService.logout();
  }

  public onClickLogoEstime(): void {
    this.router.navigate([RoutesEnum.HOMEPAGE], { replaceUrl: true });
  }
}
