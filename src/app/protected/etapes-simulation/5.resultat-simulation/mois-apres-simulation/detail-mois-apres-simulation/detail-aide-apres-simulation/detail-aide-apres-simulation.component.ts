import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Aide } from '@app/commun/models/aide';

@Component({
  selector: 'app-detail-aide-apres-simulation',
  templateUrl: './detail-aide-apres-simulation.component.html',
  styleUrls: ['./../../../../../../public/aides/aides-description/aides-description.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailAideApresSimulationComponent implements OnInit {

  @Input() aide: Aide;

  constructor() { }

  ngOnInit(): void {
  }

  onClickFaireLaDemandeAide = function () {
    window.open(this.aideLienExterne, '_blank');
  }

}
