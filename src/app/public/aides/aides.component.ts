import { Component, OnInit } from '@angular/core';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { NavigationEnd, Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';

@Component({
  selector: 'app-aides',
  templateUrl: './aides.component.html',
  styleUrls: ['./aides.component.scss']
})
export class AidesComponent implements OnInit {
  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  constructor(private router: Router,) { }

  public onClickDesc(typeAides): void{
    this.router.navigate([RoutesEnum.AIDES_DESCRIPTION]);
  }

  ngOnInit(): void {
  }

}
