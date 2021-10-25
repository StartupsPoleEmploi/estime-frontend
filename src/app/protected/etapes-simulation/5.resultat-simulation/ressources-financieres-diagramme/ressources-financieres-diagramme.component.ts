import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { SimulationAides } from '@models/simulation-aides';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { AidesService } from '@app/core/services/utile/aides.service';
import { RessourcesFinancieres } from '@app/commun/models/ressources-financieres';
import { DeConnecteRessourcesFinancieresService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';

@Component({
  selector: 'app-ressources-financieres-diagramme',
  templateUrl: './ressources-financieres-diagramme.component.html',
  styleUrls: ['./ressources-financieres-diagramme.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RessourcesFinancieresDiagrammeComponent implements OnInit {

  @Input() simulationAides: SimulationAides;

  ressourcesFinancieres: RessourcesFinancieres;

  constructor(
    public aidesService: AidesService,
    public deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    public screenService: ScreenService
  ) { }

  ngOnInit(): void {
  }
}
