import { Component, OnInit, Input } from '@angular/core';
import { SimulationMensuelle } from '@app/commun/models/simulation-mensuelle';
import { SimulationAidesSociales } from '@models/simulation-aides-sociales';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { DiagrammeUtileService } from '@app/core/services/utile/diagramme-utile.service';
import {Chart} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Context} from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-diagramme-canvas',
  templateUrl: './diagramme-canvas.component.html',
  styleUrls: ['./diagramme-canvas.component.scss']
})
export class DiagrammeCanvasComponent implements OnInit {


  @Input() simulationAidesSociales: SimulationAidesSociales;
  public ressourcesTotalesPourChaqueMois: Array<Number>;
  public aidesDisponibles : Array<String>;
  public datasets_size: Number;
  public chart;

  constructor(
    public dateUtileService: DateUtileService,
    public screenService: ScreenService,
    public diagrammeUtileService: DiagrammeUtileService
  ) { }

  ngOnInit(): void {
    this.createChart();
  }

  createChart() {
    var chart_data = this.diagrammeUtileService.getDonneesDiagramme();
    var datasets_size = chart_data.datasets.length;
    this.ressourcesTotalesPourChaqueMois = this.diagrammeUtileService.getRessourcesTotalesPourChaqueMois(this.simulationAidesSociales);
    var aidesDisponibles = this.diagrammeUtileService.getAidesDisponibles(chart_data.datasets);

    this.chart = {
      type:'bar',
      data: chart_data,
      plugins: [ChartDataLabels],
      options:{
        legend: {
          position: this.screenService.isExtraSmallScreen()?'bottom':'right',
          align:'start',
          labels: {
            filter: function(legendItem, data) {
              return aidesDisponibles.includes(legendItem.text);
            },
            boxWidth: 13,
            fontSize: 13,
            fontStyle: 'bold',
            fontFamily: 'Arial',
            padding:20
          },
        },
        plugins: {
          datalabels: {
            formatter: (value, ctx) => {
              // Array of visible datasets :
              let datasets = ctx.chart.data.datasets.filter(
                (ds, datasetIndex) => ctx.chart.isDatasetVisible(datasetIndex)
              );
              // If this is the last visible dataset of the bar :
              if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
                let sum = 0;
                datasets.map(dataset => {
                  sum += dataset.data[ctx.dataIndex];
                });
                return sum.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                });
              }
              else {
                return '';
              }
            },
            align: 'end',
            anchor: 'end',
            display: function(ctx) {
              console.log(ctx);
              return ctx.chart.options.legend.position == 'right' && ctx.datasetIndex == datasets_size-1;
            },
            font: {
              weight: 'bold',
              size: 18
            }
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: this.screenService.isExtraSmallScreen()?0.8:3,
        scales: {
          display: true,
          xAxes: [{
            stacked: true,
            gridLines : {
              display : false
            },
            barPercentage: 0.6
          }],
          yAxes: [{
            scaleLabel: {
              display: false,
              labelString: 'Euros'
            },
            ticks: {
              // On inclut un signe Euros après les valeurs de ticks de l'échelle
              callback: function(value, index, values) {
                  return value+' €';
              },
              maxTicksLimit: 5
            },
            stacked: true,
            gridLines : {
              display : true,
              borderDash: [10,2.5]
            }
          }],
        }
      }
    }
  }

  setAidesDisponibles(chart_data): void {
    this.aidesDisponibles = this.diagrammeUtileService.getAidesDisponibles(chart_data.datasets);
  }

  setChartData(chart_data): void {
    this.chart.data = chart_data;
  }
}