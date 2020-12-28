import { Component, OnInit } from '@angular/core';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';

@Component({
  selector: 'app-cgu',
  templateUrl: './cgu.component.html',
  styleUrls: ['./cgu.component.scss']
})
export class CguComponent implements OnInit {

  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;

  constructor() { }

  ngOnInit(): void {
  }

}
