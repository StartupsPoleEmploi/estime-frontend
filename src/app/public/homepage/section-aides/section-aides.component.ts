import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { ScreenService } from "@app/core/services/utile/screen.service";

@Component({
  selector: 'app-section-aides',
  templateUrl: './section-aides.component.html',
  styleUrls: ['./section-aides.component.scss']
})
export class SectionAidesComponent {

  codesAidesEnum: typeof CodesAidesEnum = CodesAidesEnum;

  constructor(
    private router: Router,
    public screenService: ScreenService,
  ) { }
  public onClickVoirAides(codeAide: string): void {
    if (codeAide) this.router.navigate([RoutesEnum.AIDES, codeAide]);
    else this.router.navigate([RoutesEnum.AIDES]);
  }

}
