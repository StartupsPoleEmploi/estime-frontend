import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  stickyFooter: boolean = false;
  subscriptionRouteNavigationEndObservable: Subscription;

  constructor(
    private router: Router,
    public screenService: ScreenService
  ) {
    this.subscribeRouteNavigationEndObservable();
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.subscriptionRouteNavigationEndObservable.unsubscribe();
  }

  public onClickAides(): void {
    this.router.navigate([RoutesEnum.AIDES]);
  }

  public onClickLinkAccessibilite(): void {
    this.router.navigate([RoutesEnum.ACCESSIBILITE]);
  }

  public onClickLinkCGU(): void {
    this.router.navigate([RoutesEnum.CGU]);
  }

  public onClickLinkContact(): void {
    this.router.navigate([RoutesEnum.CONTACT]);
  }

  public onClickLogoEstime(): void {
    this.router.navigate([RoutesEnum.HOMEPAGE]);
  }

  private subscribeRouteNavigationEndObservable(): void {
    this.subscriptionRouteNavigationEndObservable = this.router.events.subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        this.stickyFooter = routerEvent.url.split('?')[0] === RoutesEnum.HOMEPAGE
          || routerEvent.url.split('?')[0] === `/${RoutesEnum.ETAPES_SIMULATION}/${RoutesEnum.RESULTAT_SIMULATION}`;
      }
    });
  }

}
