import { Component, Input, OnInit } from '@angular/core';
import { Temoignage } from '@app/commun/models/temoignage';

@Component({
  selector: 'app-temoignages-desktop',
  templateUrl: './temoignages-desktop.component.html',
  styleUrls: ['./temoignages-desktop.component.scss']
})
export class TemoignagesDesktopComponent implements OnInit {

  @Input() temoignages: Array<Temoignage>;

  constructor() { }

  ngOnInit(): void {
  }

}
