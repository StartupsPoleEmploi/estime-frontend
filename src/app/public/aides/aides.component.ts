import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { Aide } from '@app/commun/models/aide';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { Subscription } from 'rxjs';

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
  subscriptionRouteNavigationEndObservable: Subscription;
  isAideSelected: boolean;

  constructor(
    private router: Router,
    public screenService: ScreenService
    ) {
   }

  public onClickAideSavoirPlus(codeAide): void {
    this.router.navigate([RoutesEnum.AIDES,codeAide]);
  }

  ngOnInit(): void {
    this.setAideSelected();
    this.subscribeRouteNavigationEndObservable();
  }

  ngOnDestroy(): void {
    this.subscriptionRouteNavigationEndObservable.unsubscribe();
  }

  private subscribeRouteNavigationEndObservable(): void {
    this.subscriptionRouteNavigationEndObservable = this.router.events.subscribe((routerEvent) => {
      if(routerEvent instanceof NavigationEnd) {
        this.setAideSelected();
      }
    });
  }

  private setAideSelected(): void {
    this.isAideSelected = this.getRouteFromUrl(this.router.url) !== RoutesEnum.AIDES;
    if(!this.isAideSelected) this.aideSelectedCode = '';
    else this.aideSelectedCode = this.getAideCodeFromUrl(this.router.url);
  }


  private getRouteFromUrl(url: string): string {
    return url.substring(1, url.length);
  }

  private getAideCodeFromUrl(url: string): string {
    return url.substring(1, url.length).split('/', 2)[1];
  }
}
