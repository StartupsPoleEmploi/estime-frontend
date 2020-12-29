import { Component, Input, OnInit } from '@angular/core';
import { EtapeSimulationService } from '@app/core/services/utile/etape-simulation.service';

@Component({
  selector: 'app-section-etapes-simulation',
  templateUrl: './section-etapes-simulation.component.html',
  styleUrls: ['./section-etapes-simulation.component.scss']
})
export class SectionEtapesSimulationComponent implements OnInit {

  @Input() isSmallScreen: boolean;

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
