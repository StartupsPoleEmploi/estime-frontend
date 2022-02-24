import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { SimulationAides } from '@models/simulation-aides';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { AidesService } from '@app/core/services/utile/aides.service';
import { DeConnecteRessourcesFinancieresAvantSimulationService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';

@Component({
  selector: 'app-ressources-financieres-diagramme',
  templateUrl: './ressources-financieres-diagramme.component.html',
  styleUrls: ['./ressources-financieres-diagramme.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RessourcesFinancieresDiagrammeComponent implements OnInit {

  @Input() simulationAides: SimulationAides;
  constructor(
    public aidesService: AidesService,
    public deConnecteRessourcesFinancieresAvantSimulationService: DeConnecteRessourcesFinancieresAvantSimulationService,
    public screenService: ScreenService
  ) { }

  ngOnInit(): void {
  }
}
