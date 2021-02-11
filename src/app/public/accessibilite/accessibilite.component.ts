import { Component, OnInit } from '@angular/core';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';

@Component({
  selector: 'app-accessibilite',
  templateUrl: './accessibilite.component.html',
  styleUrls: ['./accessibilite.component.scss']
})
export class AccessibiliteComponent implements OnInit {

  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;

  constructor() { }

  ngOnInit(): void {
  }

}
