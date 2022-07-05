import { Component, Input } from '@angular/core';
import { Temoignage } from '@app/commun/models/temoignage';

@Component({
  selector: 'app-temoignages-desktop',
  templateUrl: './temoignages-desktop.component.html',
  styleUrls: ['./temoignages-desktop.component.scss']
})
export class TemoignagesDesktopComponent {

  @Input() temoignages: Array<Temoignage>;
}
