import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IndividuConnectedService } from '@app/core/services/connexion/individu-connected.service';
import { PeConnectService } from '@app/core/services/connexion/pe-connect.service';
import { RoutesEnum } from '@enumerations/routes.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false
  subscriptionStatutIndividuChangedObservable: Subscription;

  constructor(
    private individuConnectedService: IndividuConnectedService,
    private peConnectService: PeConnectService,
    private router: Router
  ) {
    this.subscribeStatutIndividuChangedObservable();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.individuConnectedService.isLoggedIn();
  }

  ngOnDestroy(): void {
    this.subscriptionStatutIndividuChangedObservable.unsubscribe();
  }

  public logout(): void {
    this.peConnectService.logout();
  }

  public login(): void {
    this.peConnectService.login();
  }

  public onClickLogoEstime(): void {
    this.router.navigate([RoutesEnum.HOMEPAGE]);
  }

  private subscribeStatutIndividuChangedObservable(): void {
    this.subscriptionStatutIndividuChangedObservable = this.individuConnectedService.statutIndividuChanged.subscribe(loggedIn =>  {
      this.isLoggedIn = loggedIn;
    });
  }
}
