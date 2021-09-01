import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Aide } from '@models/aide';

@Component({
  selector: 'app-detail-aide',
  templateUrl: './detail-aide.component.html',
  styleUrls: ['./../../../../public/aides/aides-description/aides-description.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailAideComponent implements OnInit {

  @Input() aideSelected: Aide;

  constructor() { }

  ngOnInit(): void {
  }

  onClickFaireLaDemandeAide = function () {
    window.open(this.aideLienExterne, '_blank');
  }

}
