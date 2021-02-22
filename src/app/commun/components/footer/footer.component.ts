import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    private router: Router,
    public screenService: ScreenService
  ) { }

  ngOnInit(): void {
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
