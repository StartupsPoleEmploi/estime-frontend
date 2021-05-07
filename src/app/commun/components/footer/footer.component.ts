import { Component, OnInit, Input, } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  stickyFooter: boolean = false;

  constructor(
    private router: Router,
    public screenService: ScreenService
  ) { }

  ngOnInit(): void {
    const route = this.router.url.substr(0, this.router.url.indexOf('?'));
    this.stickyFooter = (route === RoutesEnum.HOMEPAGE || route === "");
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

}
