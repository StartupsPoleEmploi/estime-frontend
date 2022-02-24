import { Component, OnInit } from '@angular/core';
import { ChartUtileService } from '@app/core/services/chart/chart-utile.service';
@Component({
  selector: 'app-diagramme-canvas',
  templateUrl: './diagramme-canvas.component.html',
  styleUrls: ['./diagramme-canvas.component.scss']
})
export class DiagrammeCanvasComponent implements OnInit {

  public chart;

  constructor(
    public chartUtileService: ChartUtileService
  ) { }

  ngOnInit(): void {
    this.chart = this.chartUtileService.getChart();
  }
}