import { Component, OnInit, Input } from '@angular/core';
import { SimulationAidesSociales } from '@models/simulation-aides-sociales';
import { ChartUtileService } from '@app/core/services/chart/chart-utile.service';
@Component({
  selector: 'app-diagramme-canvas',
  templateUrl: './diagramme-canvas.component.html',
  styleUrls: ['./diagramme-canvas.component.scss']
})
export class DiagrammeCanvasComponent implements OnInit {


  @Input() simulationAidesSociales: SimulationAidesSociales;
  public chart;

  constructor(
    public chartUtileService: ChartUtileService
  ) { }

  ngOnInit(): void {
    this.chart = this.chartUtileService.getChart();
  }
}