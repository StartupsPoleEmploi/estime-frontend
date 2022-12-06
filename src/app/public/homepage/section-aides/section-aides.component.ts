import { Component } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { ScreenService } from "@app/core/services/utile/screen.service";
import { RedirectionExterneService } from '@app/core/services/utile/redirection-externe.service';
import { LiensUtilesEnum } from '@app/commun/enumerations/liens-utiles.enum';

@Component({
  selector: 'app-section-aides',
  templateUrl: './section-aides.component.html',
  styleUrls: ['./section-aides.component.scss']
})
export class SectionAidesComponent {

  codesAidesEnum: typeof CodesAidesEnum = CodesAidesEnum;

  constructor(
    public screenService: ScreenService,
    private redirectionExterneService: RedirectionExterneService
  ) { }


  public onClickVoirAides(codeAide: string): void {
    switch (codeAide) {
      case CodesAidesEnum.AGEPI:
        this.redirectionExterneService.navigate(LiensUtilesEnum.DESCRIPTION_AGEPI);
        break;
      case CodesAidesEnum.AIDE_MOBILITE:
        this.redirectionExterneService.navigate(LiensUtilesEnum.DESCRIPTION_AIDE_MOBILITE);
        break;
      case CodesAidesEnum.PRIME_ACTIVITE:
        this.redirectionExterneService.navigate(LiensUtilesEnum.DESCRIPTION_PRIME_ACTIVITE);
        break;

    }
  }

}
