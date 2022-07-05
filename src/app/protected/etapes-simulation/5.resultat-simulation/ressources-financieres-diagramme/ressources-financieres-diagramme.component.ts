import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChartUtileService } from '@app/core/services/chart/chart-utile.service';
@Component({
  selector: 'app-ressources-financieres-diagramme',
  templateUrl: './ressources-financieres-diagramme.component.html',
  styleUrls: ['./ressources-financieres-diagramme.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RessourcesFinancieresDiagrammeComponent implements OnInit {

  public chart;

  constructor(
    public chartUtileService: ChartUtileService
  ) { }

  ngOnInit(): void {
    this.chart = this.chartUtileService.getChart();
  }
}
