import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {

  constructor(
    private router: Router
  ) { }

  public onClickButtonRetourAccueil(): void {
    this.router.navigate([RoutesEnum.HOMEPAGE]);
  }

}
