import { Component, OnInit, Input } from '@angular/core';
import { SimulationAides } from '@models/simulation-aides';
import { ChartUtileService } from '@app/core/services/chart/chart-utile.service';
@Component({
  selector: 'app-diagramme-canvas',
  templateUrl: './diagramme-canvas.component.html',
  styleUrls: ['./diagramme-canvas.component.scss']
})
export class DiagrammeCanvasComponent implements OnInit {


  @Input() simulationAides: SimulationAides;
  public chart;

  constructor(
    public chartUtileService: ChartUtileService
  ) { }

  ngOnInit(): void {
    this.chart = this.chartUtileService.getChart();
  }
}