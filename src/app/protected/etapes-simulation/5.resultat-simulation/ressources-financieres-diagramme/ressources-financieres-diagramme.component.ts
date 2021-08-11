import { Component, OnInit, Input } from '@angular/core';
import { SimulationAides } from '@models/simulation-aides';
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-ressources-financieres-diagramme',
  templateUrl: './ressources-financieres-diagramme.component.html',
  styleUrls: ['./ressources-financieres-diagramme.component.scss']
})
export class RessourcesFinancieresDiagrammeComponent implements OnInit {

  @Input() simulationAides: SimulationAides;

  constructor(
    public screenService: ScreenService
  ) { }

  ngOnInit(): void {
  }

}
