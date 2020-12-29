import { Component, OnInit } from '@angular/core';
import { EtapeSimulationService } from '@app/core/services/utile/etape-simulation.service';

@Component({
  selector: 'app-section-etapes-simulation',
  templateUrl: './section-etapes-simulation.component.html',
  styleUrls: ['./section-etapes-simulation.component.scss']
})
export class SectionEtapesSimulationComponent implements OnInit {

  etapesSimulation: Array<string>;

  constructor(
    private etapeSimulationService: EtapeSimulationService
  ) { }

  ngOnInit(): void {
    this.loadEtapesSimulation();
  }

  private loadEtapesSimulation(): void {
    this.etapesSimulation = this.etapeSimulationService.getEtapesSimulation();
  }

}
