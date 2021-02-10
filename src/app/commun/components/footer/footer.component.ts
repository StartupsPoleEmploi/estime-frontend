import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public onClickLinkCGU(): void {
    this.router.navigate([RoutesEnum.CGU]);
  }

  public onClickLinkAccessibilite(): void {
    this.router.navigate([RoutesEnum.ACCESSIBILITE]);
  }

}
