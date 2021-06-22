import { Injectable } from '@angular/core';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { SimulationAidesSociales } from '@app/commun/models/simulation-aides-sociales';
import { CodesAidesEnum } from '@enumerations/codes-aides.enum';
import { CodesRessourcesFinancieresEnum } from '@enumerations/codes-ressources-financieres.enum';
import { CouleursAidesDiagrammeEnum } from '@enumerations/couleurs-aides-diagramme.enum';
import { DevisesEnum } from '@enumerations/devises.enum';
import { LibellesAidesEnum } from '@enumerations/libelles-aides.enum';
import { LibellesRessourcesFinancieresEnum } from '@enumerations/libelles-ressources-financieres.enum';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DeConnecteRessourcesFinancieresService } from '../demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { DeConnecteSimulationAidesSocialesService } from '../demandeur-emploi-connecte/de-connecte-simulation-aides-sociales.service';
import { DeConnecteService } from '../demandeur-emploi-connecte/de-connecte.service';
import { AidesService } from '../utile/aides.service';
import { DateUtileService } from '../utile/date-util.service';
import { ScreenService } from '../utile/screen.service';
import { Chart } from './models/chart/chart';
import { Data } from './models/chart/data/data';
import { Dataset } from './models/chart/data/dataset/dataset';
import { Layout } from './models/chart/options/layout/layout';
import { Padding } from './models/chart/options/layout/padding/padding';
import { Labels } from './models/chart/options/legend/labels/labels';
import { Legend } from './models/chart/options/legend/legend';
import { Options } from './models/chart/options/options';
import { Datalabels } from './models/chart/options/plugins/datalabels/datalabels';
import { Font } from './models/chart/options/plugins/datalabels/font/font';
import { Plugins } from './models/chart/options/plugins/plugins';
import { Axes } from './models/chart/options/scales/axes/axes';
import { GridLines } from './models/chart/options/scales/axes/gridLines/gridLines';
import { ScaleLabel } from './models/chart/options/scales/axes/scaleLabel/scaleLabel';
import { Ticks } from './models/chart/options/scales/axes/ticks/ticks';
import { Scales } from './models/chart/options/scales/scales';
import { DataObject } from './models/dto/dataObject';



@Injectable({ providedIn: 'root' })
export class ChartUtileService {
  private static CODE_RESSOURCES_AVANT_REPRISE_EMPLOI = "ressources_avant_reprise_emploi";
  private static LIBELLE_RESSOURCES_AVANT_REPRISE_EMPLOI = "Ressources avant reprise d'emploi";
  private static BAR_PERCENTAGE = 0.6;

  constructor(
    private deConnecteService: DeConnecteService,
    private deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    private deConnecteSimulationAidesSocialesService: DeConnecteSimulationAidesSocialesService,
    private dateUtileService: DateUtileService,
    private aidesService: AidesService,
    private screenService: ScreenService
  ) { }

  public getChart(): Chart {
    const chart: Chart = new Chart();
    const data = this.getData();

    chart.data = data;
    chart.options = this.getOptions(data);
    chart.type = this.getType();
    chart.plugins = [ChartDataLabels];

    return chart;
  }

  private getData(): Data {
    const simulationAidesSociales = this.deConnecteSimulationAidesSocialesService.getSimulationAidesSociales();
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    const data: Data = new Data();

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
  private getLabels(simulationAidesSociales): Array<string> {
    const labelsMois = Array();
    labelsMois.push('');
    simulationAidesSociales.simulationsMensuelles.forEach(
      (simulationMensuelle) => {
        labelsMois.push(
          this.dateUtileService.getLibelleDateStringFormat(
            simulationMensuelle.datePremierJourMoisSimule
          )
        );
      }
    );
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
  private getDatasets(simulationAidesSociales: SimulationAidesSociales, demandeurEmploiConnecte: DemandeurEmploi): Array<Dataset> {
    const dataObject = this.initDatasets();

    simulationAidesSociales.simulationsMensuelles.forEach((simulationMensuelle, index) => {
        for (let key in simulationMensuelle.mesAides) {
          switch (key) {
            case CodesAidesEnum.AGEPI: {
              dataObject.datasets.get(CodesAidesEnum.AGEPI).data[index + 1] = simulationMensuelle.mesAides[key].montant;
              break;
            }
            case CodesAidesEnum.AIDE_MOBILITE: {
              dataObject.datasets.get(CodesAidesEnum.AIDE_MOBILITE).data[index + 1] = simulationMensuelle.mesAides[key].montant;
              break;
            }
            case CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES: {
              dataObject.datasets.get(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES).data[index + 1] = simulationMensuelle.mesAides[key].montant;
              break;
            }
            case CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE: {
              dataObject.datasets.get(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE).data[index + 1] = simulationMensuelle.mesAides[key].montant;
              break;
            }
            case CodesAidesEnum.PRIME_ACTIVITE: {
              dataObject.datasets.get(CodesAidesEnum.PRIME_ACTIVITE).data[index + 1] = simulationMensuelle.mesAides[key].montant;
              break;
            }
            case CodesAidesEnum.RSA: {
              dataObject.datasets.get(CodesAidesEnum.RSA).data[index + 1] = simulationMensuelle.mesAides[key].montant;
              break;
            }
            default:
          }
        }
      }
    );
    for (let index = 0; index < simulationAidesSociales.simulationsMensuelles.length; index++) {
      dataObject.datasets.get(CodesAidesEnum.PENSION_INVALIDITE).data[index + 1] = this.aidesService.getMontantPensionInvalidite(demandeurEmploiConnecte);
      dataObject.datasets.get(CodesAidesEnum.ALLOCATION_SUPPLEMENTAIRE_INVALIDITE).data[index + 1] = this.aidesService.getMontantAllocationSupplementaireInvalidite(demandeurEmploiConnecte);
      dataObject.datasets.get(CodesRessourcesFinancieresEnum.PAIE).data[index + 1] = demandeurEmploiConnecte.futurTravail.salaire.montantNet;
      dataObject.datasets.get(CodesRessourcesFinancieresEnum.IMMOBILIER).data[index + 1] = this.deConnecteRessourcesFinancieresService.getRevenusImmobilierSur1Mois();
      dataObject.datasets.get(CodesRessourcesFinancieresEnum.TRAVAILLEUR_INDEPENDANT).data[index + 1] = this.deConnecteRessourcesFinancieresService.getRevenusTravailleurIndependantSur1Mois();
    }
    dataObject.datasets.get(ChartUtileService.CODE_RESSOURCES_AVANT_REPRISE_EMPLOI).data[0] = simulationAidesSociales.montantRessourcesFinancieresMoisAvantSimulation;
    return this.transformDataObjectToDatasets(dataObject);
  }

  /**
   *
   * Fonction qui permet d'initialiser les datasets à vide. Un dataset correspond à une aide potentiellement disponible à l'issu de la simulation
   *
   * @returns DataObject
   */
  private initDatasets(): DataObject {
    const dataObject = new DataObject();
    dataObject.datasets = new Map();

    dataObject.datasets.set(CodesAidesEnum.AGEPI,
      {
        label: LibellesAidesEnum.AGEPI.padEnd(30,' '),
        backgroundColor: CouleursAidesDiagrammeEnum.AGEPI,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.AIDE_MOBILITE,
      {
        label: LibellesAidesEnum.AIDE_MOBILITE.padEnd(30,' '),
        backgroundColor: CouleursAidesDiagrammeEnum.AIDE_MOBILITE,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES,
      {
        label: LibellesAidesEnum.ALLOCATION_ADULTES_HANDICAPES.padEnd(30,' '),
        backgroundColor: CouleursAidesDiagrammeEnum.ALLOCATION_ADULTES_HANDICAPES,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE,
      {
        label: LibellesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE.padEnd(30,' '),
        backgroundColor: CouleursAidesDiagrammeEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.PENSION_INVALIDITE,
      {
        label: LibellesAidesEnum.PENSION_INVALIDITE.padEnd(30,' '),
        backgroundColor: CouleursAidesDiagrammeEnum.PENSION_INVALIDITE,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.ALLOCATION_SUPPLEMENTAIRE_INVALIDITE,
      {
        label: LibellesAidesEnum.ALLOCATION_SUPPLEMENTAIRE_INVALIDITE.padEnd(30,' '),
        backgroundColor: CouleursAidesDiagrammeEnum.ALLOCATION_SUPPLEMENTAIRE_INVALIDITE,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.PRIME_ACTIVITE,
      {
        label: LibellesAidesEnum.PRIME_ACTIVITE.padEnd(30,' '),
        backgroundColor: CouleursAidesDiagrammeEnum.PRIME_ACTIVITE,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.RSA,
      {
        label: LibellesAidesEnum.RSA.padEnd(30,' '),
        backgroundColor: CouleursAidesDiagrammeEnum.RSA,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesRessourcesFinancieresEnum.PAIE,
      {
        label: LibellesRessourcesFinancieresEnum.SALAIRE.padEnd(30,' '),
        backgroundColor: CouleursAidesDiagrammeEnum.PAIE,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesRessourcesFinancieresEnum.IMMOBILIER,
      {
        label: LibellesRessourcesFinancieresEnum.IMMOBILIER.padEnd(30,' '),
        backgroundColor: CouleursAidesDiagrammeEnum.IMMOBILIER,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesRessourcesFinancieresEnum.TRAVAILLEUR_INDEPENDANT,
      {
        label: LibellesRessourcesFinancieresEnum.TRAVAILLEUR_INDEPENDANT.padEnd(30,' '),
        backgroundColor: CouleursAidesDiagrammeEnum.TRAVAILLEUR_INDEPENDANT,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(ChartUtileService.CODE_RESSOURCES_AVANT_REPRISE_EMPLOI,
      {
        label: ChartUtileService.LIBELLE_RESSOURCES_AVANT_REPRISE_EMPLOI.padEnd(20,' '),
        backgroundColor: CouleursAidesDiagrammeEnum.RESSOURCES_AVANT_REPRISE_EMPLOI,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

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
    const datasets: Array<Dataset> = Array();
    dataObject.datasets.forEach((dataset) => {
      datasets.push(dataset);
    });
    return datasets;
  }

  private getOptions(data: Data): Options {
    const options = new Options();

    options.responsive = true;
    options.maintainAspectRation = true;
    options.aspectRatio = this.screenService.isExtraSmallScreen() ? 0.8 : 3;
    options.legend = this.getLegend(data);
    options.plugins = this.getPlugins(data);
    options.scales = this.getScales();
    options.layout = this.getLayout();

    return options;
  }

  private getLegend(data: Data): Legend {
    const legend = new Legend();

    legend.position = this.screenService.isExtraSmallScreen()
      ? 'bottom'
      : 'right';
    legend.align = 'start';
    legend.labels = this.getLegendLabels(data);

    return legend;
  }

  private getLegendLabels(data: Data): Labels {
    const aidesDisponibles = this.getAidesDisponibles(data);
    const labels = new Labels();

    labels.boxWidth = 13;
    labels.fontSize = 13;
    labels.fontFamily = 'Lato';
    labels.fontColor = 'black';
    labels.padding = 20;
    labels.filter = function (legendItem: any) {
      return aidesDisponibles.includes(legendItem.text);
    };

    return labels;
  }

  private getPlugins(data: Data): Plugins {
    const plugins = new Plugins();

    plugins.datalabels = this.getDatalabels(data);

    return plugins;
  }

  private getDatalabels(data: Data): Datalabels {
    const datasetsSize = data.datasets.length;
    const datalabels = new Datalabels();

    datalabels.align = 'end';
    datalabels.anchor = 'end';
    datalabels.font = this.getFont();
    datalabels.color = 'black';
    datalabels.display = function (ctx) {
      return (
        ctx.chart.options.legend.position == 'right' &&
        ctx.datasetIndex == datasetsSize - 1
      );
    };
    datalabels.formatter = (value, ctx) => {
      // Array of visible datasets :
      let datasets = ctx.chart.data.datasets.filter((ds, datasetIndex) =>
        ctx.chart.isDatasetVisible(datasetIndex)
      );
      // If this is the last visible dataset of the bar :
      if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
        let sum = 0;
        datasets.map((dataset) => {
          sum += dataset.data[ctx.dataIndex];
        });
        if(sum != 0) return `${sum.toString()} ${DevisesEnum.EURO.symbole}`;
      }
      return '';
    };

    return datalabels;
  }

  private getFont(): Font {
    const font = new Font();

    font.weight = 'bold';
    font.size = 18;
    font.family = 'Lato';

    return font;
  }

  private getScales(): Scales {
    const scales = new Scales();

    scales.display = true;
    scales.xAxes = this.getXAxes();
    scales.yAxes = this.getYAxes();

    return scales;
  }

  private getXAxes(): Array<Axes> {
    const xAxes = new Axes();
    const gridLines = new GridLines();
    gridLines.display = false;

    xAxes.stacked = true;
    xAxes.gridLines = gridLines;

    return [xAxes];
  }

  private getYAxes(): Array<Axes> {
    const yAxes = new Axes();

    yAxes.stacked = true;
    yAxes.gridLines = this.getGridLines();
    yAxes.scaleLabel = this.getScaleLabel();
    yAxes.ticks = this.getTicks();

    return [yAxes];
  }

  private getGridLines(): GridLines {
    const gridLines = new GridLines();

    gridLines.display = true;
    gridLines.borderDash = [10, 2.5];

    return gridLines;
  }

  private getScaleLabel(): ScaleLabel {
    const scaleLabel = new ScaleLabel();

    scaleLabel.display = true;
    scaleLabel.labelString = DevisesEnum.EURO.libelle_majuscule_pluriel;

    return scaleLabel;
  }

  private getTicks(): Ticks {
    const ticks = new Ticks();

    ticks.maxTicksLimit = 6;
    // On inclut un signe Euros après les valeurs de ticks de l'échelle
    ticks.callback = function (value, index, values) {
      return `${value} ${DevisesEnum.EURO.symbole}`;
    };

    return ticks;
  }

  private getLayout(): Layout {
    const layout = new Layout();

    layout.padding = this.getPadding();

    return layout;
  }

  private getPadding(): Padding {
    const padding = new Padding();

    padding.right = 0;
    padding.left = 0;
    padding.top = this.screenService.isExtraSmallScreen() ? 0 : 50;
    padding.bottom = 0;

    return padding;
  }

  private getType(): string {
    return 'bar';
  }

  /**
   * Fonction qui permet de déterminer la liste des aides auxquelles le DE peut/pourra prétendre
   * et ainsi n'afficher que ces intitulés dans la légende du graphique
   *
   * @param datasets les datasets du diagramme
   * @returns aidesDisponibles : les libellés des aides disponibles
   */
  public getAidesDisponibles(data: Data): Array<string> {
    const aidesDisponibles = Array();
    data.datasets.forEach((dataset) => {
      if (!dataset['data'].every((item) => item === 0))
        aidesDisponibles.push(dataset['label']);
    });
    return aidesDisponibles;
  }
}
