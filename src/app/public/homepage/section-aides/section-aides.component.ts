import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { ScreenService } from "@app/core/services/utile/screen.service";

@Component({
  selector: 'app-section-aides',
  templateUrl: './section-aides.component.html',
  styleUrls: ['./section-aides.component.scss']
})
export class SectionAidesComponent implements OnInit {

  constructor(
    private router: Router,
    public screenService: ScreenService
  ) { }

  ngOnInit(): void {}

  public onClickVoirAides(): void {
    this.router.navigate([RoutesEnum.ACCESSIBILITE]);
  }

}
