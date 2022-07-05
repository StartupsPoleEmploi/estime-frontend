import { Component, Input } from '@angular/core';
import { Temoignage } from '@app/commun/models/temoignage';

@Component({
  selector: 'app-temoignages-mobile',
  templateUrl: './temoignages-mobile.component.html',
  styleUrls: ['./temoignages-mobile.component.scss']
})
export class TemoignagesMobileComponent {


  @Input() temoignages: Array<Temoignage>;
  @Input() isSmallScreen: boolean;
}
