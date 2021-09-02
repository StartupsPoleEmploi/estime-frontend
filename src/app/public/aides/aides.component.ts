import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { Aide } from '@app/commun/models/aide';

@Component({
  selector: 'app-aides',
  templateUrl: './aides.component.html',
  styleUrls: ['./aides.component.scss']
})
export class AidesComponent implements OnInit {
  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;

  ICONS_PATH = "../../assets/images/";

  aideSelected: Aide;
  aideSelectedCode: string;
  codesAidesEnum: typeof CodesAidesEnum = CodesAidesEnum;

  constructor(private router: Router) {
   }

  public onClickAideSavoirPlus(codeAide): void {
    let aideRoute = "/"+codeAide;
    this.aideSelectedCode = codeAide;

    this.router.navigate([RoutesEnum.AIDES+aideRoute]);
  }

  ngOnInit(): void { }
}
