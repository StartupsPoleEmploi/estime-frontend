import { Injectable } from '@angular/core';
import { DeConnecteService } from '../demandeur-emploi-connecte/de-connecte.service';
import { DeConnecteRessourcesFinancieresService } from '../demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { DeConnecteSimulationAidesSocialesService } from '../demandeur-emploi-connecte/de-connecte-simulation-aides-sociales.service';
import { AidesService } from "../utile/aides.service";
import { DateUtileService } from "../utile/date-util.service";
import { ScreenService } from '../utile/screen.service';
import { CouleursAidesDiagrammeEnum } from '@enumerations/couleurs-aides-diagramme.enum';
import { CodesAidesEnum } from '@enumerations/codes-aides.enum';
import { CodesRessourcesFinancieresEnum } from '@enumerations/codes-ressources-financieres.enum';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { DataObject } from './models/dto/dataObject'

import { Chart } from './models/chart/chart';
  import { Data } from './models/chart/data/data';
    import { Dataset } from './models/chart/data/dataset/dataset'
  import { Options } from './models/chart/options/options';
    import { Legend } from './models/chart/options/legend/legend';
      import { Labels } from './models/chart/options/legend/labels/labels';
    import { Plugins } from './models/chart/options/plugins/plugins';
      import { Datalabels } from './models/chart/options/plugins/datalabels/datalabels';
        import { Font } from './models/chart/options/plugins/datalabels/font/font';
    import { Scales } from './models/chart/options/scales/scales';
      import { Axes } from './models/chart/options/scales/axes/axes';
        import { GridLines } from './models/chart/options/scales/axes/gridLines/gridLines';
        import { ScaleLabel } from './models/chart/options/scales/axes/scaleLabel/scaleLabel';
        import { Ticks } from './models/chart/options/scales/axes/ticks/ticks';

@Injectable({ providedIn: 'root' })
export class ChartUtileService {

  constructor(
    private deConnecteService: DeConnecteService,
    private deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    private deConnecteSimulationAidesSocialesService: DeConnecteSimulationAidesSocialesService,
    private dateUtileService: DateUtileService,
    private aidesService: AidesService,
    private screenService: ScreenService
  ) {
  }

  public getChart() : Chart {
    var chart: Chart = new Chart();
    var data: Data = new Data();
    data = this.getData();

    chart.data = data;
    chart.options = this.getOptions(data);
    chart.type = this.getType();
    chart.plugins = [ChartDataLabels];

    return chart;
  }

  private getData(): Data {
    var simulationAidesSociales = this.deConnecteSimulationAidesSocialesService.getSimulationAidesSociales();
    var demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    var data: Data =  new Data();

    data.labels = this.getLabels(simulationAidesSociales);
    data.datasets = this.getDatasets(simulationAidesSociales, demandeurEmploiConnecte);

    return data;
  }

  /**
   * Fonction qui permet de déterminer les labels des mois qui déterminent les colonnes du diagramme
   * Le premier label est laissé vide car la première colonne concerne les ressources avant simulation
   *
   * @param simulationAidesSociales
   * @returns labelsMois
   */
   private getLabels(simulationAidesSociales): Array<String> {
    var labelsMois = [];
    labelsMois.push("");
    simulationAidesSociales.simulationsMensuelles.forEach((simulationMensuelle) => {
      labelsMois.push(this.dateUtileService.getLibelleDateStringFormat(simulationMensuelle.datePremierJourMoisSimule));
    });
    return labelsMois;
  }

  /**
   * Fonction qui permet, à partir des simulations d'aides sociales et du profil de demandeur d'emploi
   * de créer les datasets dont le diagramme a besoin
   *
   * Pour ce faire, on parcourt les simulationsMensuelles et les aides qui les composent et on ajoute la valeur correspondante dans un tableau
   *
   * @param simulationAidesSociales
   * @param demandeurEmploiConnecte
   * @returns Array<Dataset>
   */
   private getDatasets(simulationAidesSociales, demandeurEmploiConnecte): Array<Dataset> {

    var dataObject: DataObject = new DataObject;

    dataObject = this.initDatasets();

    simulationAidesSociales.simulationsMensuelles.forEach((simulationMensuelle, index) => {
      for(var key in simulationMensuelle.mesAides) {
        switch(key) {
          case CodesAidesEnum.AGEPI: {
            dataObject.datasets.get(CodesAidesEnum.AGEPI).data[index+1] = simulationMensuelle.mesAides[key].montant;
            break;
          }
          case CodesAidesEnum.AIDE_MOBILITE: {
            dataObject.datasets.get(CodesAidesEnum.AIDE_MOBILITE).data[index+1] = simulationMensuelle.mesAides[key].montant;
            break;
          }
          case CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES: {
            dataObject.datasets.get(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES).data[index+1] = simulationMensuelle.mesAides[key].montant;
            break;
          }
          case CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE: {
            dataObject.datasets.get(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE).data[index+1] = simulationMensuelle.mesAides[key].montant;
            break;
          }
          case CodesAidesEnum.PRIME_ACTIVITE: {
            dataObject.datasets.get(CodesAidesEnum.PRIME_ACTIVITE).data[index+1] = simulationMensuelle.mesAides[key].montant;
            break;
          }
          case CodesAidesEnum.RSA: {
            dataObject.datasets.get(CodesAidesEnum.RSA).data[index+1] = simulationMensuelle.mesAides[key].montant;
            break;
          }
          case CodesRessourcesFinancieresEnum.PAIE: {
            dataObject.datasets.get(CodesRessourcesFinancieresEnum.PAIE).data[index+1] = simulationMensuelle.mesAides[key].montant;
            break;
          }
          case CodesRessourcesFinancieresEnum.IMMOBILIER: {
            dataObject.datasets.get(CodesRessourcesFinancieresEnum.IMMOBILIER).data[index+1] = simulationMensuelle.mesAides[key].montant;
            break;
          }
          default:;
        }
        dataObject.datasets.get(CodesAidesEnum.PRIME_ACTIVITE).data[index+1] = this.aidesService.getMontantPensionInvalidite(demandeurEmploiConnecte);
        dataObject.datasets.get(CodesRessourcesFinancieresEnum.PAIE).data[index+1] = demandeurEmploiConnecte.futurTravail.salaireMensuelNet;
        dataObject.datasets.get(CodesRessourcesFinancieresEnum.IMMOBILIER).data[index+1] = this.deConnecteRessourcesFinancieresService.getRevenusImmobilierSur1Mois();
        dataObject.datasets.get(CodesRessourcesFinancieresEnum.TRAVAILLEUR_INDEPENDANT).data[index+1] = this.deConnecteRessourcesFinancieresService.getRevenusTravailleurIndependantSur1Mois();
      }
    });
    dataObject.datasets.get('ressources_avant_reprise_emploi').data[0] = simulationAidesSociales.montantRessourcesFinancieresMoisAvantSimulation;

    return this.transformDataObjectToDatasets(dataObject);
  }

  /**
   *
   * Fonction qui permet d'initialiser les datasets à vide. Un dataset correspond à une aide potentiellement disponible à l'issu de la simulation
   *
   * @returns DataObject
   */
  private initDatasets(): DataObject {

    var dataObject: DataObject =  new DataObject();
    var datasets: Map<String, Dataset> = new Map();

    datasets.set(CodesAidesEnum.AGEPI, {
      label: "AGEPI",
      backgroundColor: CouleursAidesDiagrammeEnum.AGEPI,
      data: [0, 0, 0, 0, 0, 0, 0]
    });

    datasets.set(CodesAidesEnum.AIDE_MOBILITE, {
      label: "Aide à la mobilité",
      backgroundColor: CouleursAidesDiagrammeEnum.AIDE_MOBILITE,
      data: [0, 0, 0, 0, 0, 0, 0]
    });

    datasets.set(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES, {
      label: "AAH",
      backgroundColor: CouleursAidesDiagrammeEnum.ALLOCATION_ADULTES_HANDICAPES,
      data: [0, 0, 0, 0, 0, 0, 0]
    });

    datasets.set(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE, {
      label: "ASS",
      backgroundColor: CouleursAidesDiagrammeEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE,
      data: [0, 0, 0, 0, 0, 0, 0]
    });

    datasets.set(CodesAidesEnum.PENSION_INVALIDITE, {
      label: "Pension d'invalidité",
      backgroundColor: CouleursAidesDiagrammeEnum.PENSION_INVALIDITE,
      data: [0, 0, 0, 0, 0, 0, 0]
    });

    datasets.set(CodesAidesEnum.PRIME_ACTIVITE, {
      label: "Prime d'activité",
      backgroundColor: CouleursAidesDiagrammeEnum.PRIME_ACTIVITE,
      data: [0, 0, 0, 0, 0, 0, 0]
    });

    datasets.set(CodesAidesEnum.RSA, {
      label: "RSA",
      backgroundColor: CouleursAidesDiagrammeEnum.RSA,
      data: [0, 0, 0, 0, 0, 0, 0]
    });

    datasets.set(CodesRessourcesFinancieresEnum.PAIE, {
      label: "Salaire net",
      backgroundColor: CouleursAidesDiagrammeEnum.PAIE,
      data: [0, 0, 0, 0, 0, 0, 0]
    });

    datasets.set(CodesRessourcesFinancieresEnum.IMMOBILIER, {
      label: "Revenus immobiliers",
      backgroundColor: CouleursAidesDiagrammeEnum.IMMOBILIER,
      data: [0, 0, 0, 0, 0, 0, 0]
    });

    datasets.set(CodesRessourcesFinancieresEnum.TRAVAILLEUR_INDEPENDANT, {
      label: "Revenus de travailleur indépendant",
      backgroundColor: CouleursAidesDiagrammeEnum.TRAVAILLEUR_INDEPENDANT,
      data: [0, 0, 0, 0, 0, 0, 0]
    });

    datasets.set('ressources_avant_reprise_emploi', {
      label: "Ressources avant reprise d'emploi",
      backgroundColor: CouleursAidesDiagrammeEnum.RESSOURCES_AVANT_REPRISE_EMPLOI,
      data: [0, 0, 0, 0, 0, 0, 0]
    });

    dataObject.datasets = datasets;

    return dataObject;
  }

  /**
   *
   * Fonction qui permet de transformer un l'objet dataObject en objet Array<Dataset>
   *
   * Cette transformation est nécessaire car pour faciliter l'insertion des valeurs dans les datasets on utilise un objet intermédiaire
   * que l'on a ensuite besoin de transformer en un format accepté par chart.js
   *
   * @param dataObject
   * @returns Array<Dataset>
   */
  private transformDataObjectToDatasets(dataObject: DataObject): Array<Dataset> {
    var datasets: Array<Dataset> =[];
    dataObject.datasets.forEach(dataset => {
      datasets.push(dataset);
    });
    return datasets;
  }

  private getOptions(data: Data): Options {
    var options: Options = new Options();

    options.responsive = true;
    options.maintainAspectRation = true;
    options.aspectRatio = this.screenService.isExtraSmallScreen()?0.8:3;
    options.legend = this.getLegend(data);
    options.plugins = this.getPlugins(data);
    options.scales = this.getScales();

    return options;
  }

  private getLegend(data: Data): Legend {
    var legend : Legend = new Legend();

    legend.position = this.screenService.isExtraSmallScreen()?'bottom':'right';
    legend.align = 'start';
    legend.labels = this.getLegendLabels(data);

    return legend;
  }

  private getLegendLabels(data: Data): Labels {
    var aidesDisponibles = this.getAidesDisponibles(data);
    var labels: Labels = new Labels();

    labels.boxWidth = 13;
    labels.fontSize = 13;
    labels.fontFamily = 'Lato';
    labels.fontColor = '#23333C';
    labels.padding = 20;
    labels.filter = function(legendItem, data) {
      return aidesDisponibles.includes(legendItem.text);
    };

    return labels;
  }

  private getPlugins(data: Data): Plugins {
    var plugins: Plugins = new Plugins();

    plugins.datalabels = this.getDatalabels(data);

    return plugins;
  }

  private getDatalabels(data: Data): Datalabels {
    var datasetsSize = data.datasets.length;
    var datalabels: Datalabels = new Datalabels();

    datalabels.align = 'end';
    datalabels.anchor = 'end';
    datalabels.font = this.getFont();
    datalabels.display = function(ctx) {
      return ctx.chart.options.legend.position == 'right' && ctx.datasetIndex == datasetsSize-1;
    };
    datalabels.formatter = (value, ctx) => {
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
        return sum.toString()+'€';
      }
      else {
        return '';
      }
    };

    return datalabels;
  }

  private getFont(): Font {
    var font: Font = new Font();

    font.weight = 'bold';
    font.size = 18;
    font.color = '#23333C';
    font.family = "Lato";

    return font;
  }

  private getScales(): Scales {
    var scales: Scales = new Scales();

    scales.display = true;
    scales.xAxes = this.getXAxes();
    scales.yAxes = this.getYAxes();

    return scales;
  }

  private getXAxes(): Array<Axes> {
    var xAxes: Axes = new Axes();
    var gridLines: GridLines = new GridLines();
    gridLines.display = false;

    xAxes.stacked = true;
    xAxes.barPercentage = 0.6;
    xAxes.gridLines = gridLines;

    return [xAxes];
  }

  private getYAxes(): Array<Axes> {
    var yAxes: Axes = new Axes();

    yAxes.stacked = true;
    yAxes.gridLines = this.getGridLines();
    yAxes.scaleLabel = this.getScaleLabel();
    yAxes.ticks = this.getTicks();

    return [yAxes];
  }

  private getGridLines(): GridLines{
    var gridLines: GridLines = new GridLines();

    gridLines.display = true;
    gridLines.borderDash = [10,2.5];

    return gridLines;
  }

  private getScaleLabel(): ScaleLabel{
    var scaleLabel: ScaleLabel = new ScaleLabel();

    scaleLabel.display = true;
    scaleLabel.labelString = 'Euros';

    return scaleLabel;
  }

  private getTicks(): Ticks{
    var ticks: Ticks = new Ticks();

    ticks.maxTicksLimit = 5;
    // On inclut un signe Euros après les valeurs de ticks de l'échelle
    ticks.callback = function(value, index, values) {
      return value+' €';
    };

    return ticks;
  }

  private getType(): String {
    var type: String = 'bar';
    return type;
  }

  /**
   * Fonction qui permet de déterminer la liste des aides auxquelles le DE peut/pourra prétendre
   * et ainsi n'afficher que ces intitulés dans la légende du graphique
   *
   * @param datasets les datasets du diagramme
   * @returns aidesDisponibles : les libellés des aides disponibles
   */
  public getAidesDisponibles(data: Data): Array<String> {
    var aidesDisponibles = [];
    data.datasets.forEach((dataset) => {
      if(!(dataset['data'].every(item => item === 0))) aidesDisponibles.push(dataset['label']);
    })
    return aidesDisponibles;

  }




}