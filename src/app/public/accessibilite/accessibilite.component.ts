import { Component } from '@angular/core';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';

@Component({
  selector: 'app-accessibilite',
  templateUrl: './accessibilite.component.html',
  styleUrls: ['./accessibilite.component.scss']
})
export class AccessibiliteComponent {

  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
}
