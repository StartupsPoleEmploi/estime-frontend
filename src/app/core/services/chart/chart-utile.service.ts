import { Injectable } from '@angular/core';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { Simulation } from '@app/commun/models/simulation';
import { CouleursAidesDiagrammeEnum } from '@enumerations/couleurs-aides-diagramme.enum';
import { DevisesEnum } from '@enumerations/devises.enum';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DeConnecteSimulationService } from '../demandeur-emploi-connecte/de-connecte-simulation.service';
import { DeConnecteService } from '../demandeur-emploi-connecte/de-connecte.service';
import { DateUtileService } from '../utile/date-util.service';
import { ScreenService } from '../utile/screen.service';
import { SimulationService } from '../utile/simulation.service';
import { Chart } from './models/chart/chart';
import { Data } from './models/chart/data/data';
import { Dataset } from './models/chart/data/dataset/dataset';
import { Layout } from './models/chart/options/layout/layout';
import { Padding } from './models/chart/options/layout/padding/padding';
import { Options } from './models/chart/options/options';
import { Datalabels } from './models/chart/options/plugins/datalabels/datalabels';
import { Font } from './models/chart/options/plugins/datalabels/font/font';
import { Plugins } from './models/chart/options/plugins/plugins';
import { Axes } from './models/chart/options/scales/axes/axes';
import { GridLines } from './models/chart/options/scales/axes/gridLines/gridLines';
import { Ticks } from './models/chart/options/scales/axes/ticks/ticks';
import { Scales } from './models/chart/options/scales/scales';
import { DataObject } from './models/dto/dataObject';

@Injectable({ providedIn: 'root' })
export class ChartUtileService {
  private static CODE_TOTAL_RESSOURCES_DU_MOIS = "total_ressources_du_mois";
  private static LIBELLE_TOTAL_RESSOURCES_DU_MOIS = "Total des ressources du mois";
  private static BAR_PERCENTAGE_DESKTOP = 0.3;
  private static BAR_PERCENTAGE_MOBILE = 0.5;

  constructor(
    private deConnecteService: DeConnecteService,
    private deConnecteSimulationService: DeConnecteSimulationService,
    private dateUtileService: DateUtileService,
    private screenService: ScreenService,
    private simulationService: SimulationService
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
    const simulation = this.deConnecteSimulationService.getSimulation();
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    const data: Data = new Data();

    data.labels = this.getLabels(simulation);
    data.datasets = this.getDatasets(simulation, demandeurEmploiConnecte);

    return data;
  }

  /**
   * Fonction qui permet de déterminer les labels des mois qui déterminent les colonnes du diagramme
   * Le premier label est laissé vide car la première colonne concerne les ressources avant simulation
   *
   * @param simulation
   * @returns labelsMois
   */
  private getLabels(simulation): Array<string> {
    const labelsMois = Array();
    labelsMois.push(this.dateUtileService.getLibelleMoisCourtDateActuelle());
    simulation.simulationsMensuelles.forEach(
      (simulationMensuelle) => {
        labelsMois.push(
          this.dateUtileService.getLibelleMoisStringFormatCourt(
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
   * @param simulation
   * @param demandeurEmploiConnecte
   * @returns Array<Dataset>
   */
  private getDatasets(simulation: Simulation, demandeurEmploiConnecte: DemandeurEmploi): Array<Dataset> {
    const dataObject = this.initDatasets();

    simulation.simulationsMensuelles.forEach((simulationMensuelle, index) => {
      const montantTotalAidesMoisSimule = this.simulationService.calculerMontantTotalRessourcesMois(simulationMensuelle);
      dataObject.datasets.get(ChartUtileService.CODE_TOTAL_RESSOURCES_DU_MOIS).data[index + 1] = montantTotalAidesMoisSimule;
    });
    dataObject.datasets.get(ChartUtileService.CODE_TOTAL_RESSOURCES_DU_MOIS).data[0] = simulation.montantRessourcesFinancieresMoisAvantSimulation;
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
    dataObject.datasets.set(ChartUtileService.CODE_TOTAL_RESSOURCES_DU_MOIS,
      {
        label: ChartUtileService.LIBELLE_TOTAL_RESSOURCES_DU_MOIS,
        backgroundColor: [
          CouleursAidesDiagrammeEnum.RESSOURCES_AVANT_REPRISE_EMPLOI,
          CouleursAidesDiagrammeEnum.MONTANT_TOTAL_MOIS,
          CouleursAidesDiagrammeEnum.MONTANT_TOTAL_MOIS,
          CouleursAidesDiagrammeEnum.MONTANT_TOTAL_MOIS,
          CouleursAidesDiagrammeEnum.MONTANT_TOTAL_MOIS,
          CouleursAidesDiagrammeEnum.MONTANT_TOTAL_MOIS,
          CouleursAidesDiagrammeEnum.MONTANT_TOTAL_MOIS
        ],
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: this.screenService.isExtraSmallScreen() ? ChartUtileService.BAR_PERCENTAGE_MOBILE : ChartUtileService.BAR_PERCENTAGE_DESKTOP
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
    options.maintainAspectRatio = true;
    options.aspectRatio = this.getAspectRatio();
    options.legend = null;
    options.plugins = this.getPlugins(data);
    options.scales = this.getScales();
    options.layout = this.getLayout();

    return options;
  }

  private getAspectRatio() {
    if (this.screenService.isExtraSmallScreen()) return 0.9;
    if (this.screenService.isTabletScreen()) return 1;
    return 3;
  }

  private getPlugins(data: Data): Plugins {
    const plugins = new Plugins();

    plugins.datalabels = this.getDatalabels();

    return plugins;
  }

  private getDatalabels(): Datalabels {
    const datalabels = new Datalabels();

    datalabels.font = this.getFont();
    datalabels.align = 'top';
    datalabels.anchor = 'end';
    datalabels.color = function (ctx) {
      // use the same color as the border
      return ctx.dataset.backgroundColor
    };
    datalabels.formatter = (value, ctx) => {
      // Array of visible datasets :
      let datasets = ctx.chart.data.datasets;
      let sum = 0;
      datasets.map((dataset) => {
        sum += dataset.data[ctx.dataIndex];
      });
      if (sum != 0) return `${sum.toString()}${this.screenService.isExtraSmallScreen() ? DevisesEnum.EURO.symbole : ' ' + DevisesEnum.EURO.symbole}`;
      return '';
    };

    return datalabels;
  }

  private getFont(): Font {
    const font = new Font();
    font.weight = 'normal';
    font.size = this.screenService.isExtraSmallScreen() ? 12 : 15;
    font.family = 'Lato';

    return font;
  }

  private getScales(): Scales {
    const scales = new Scales();

    scales.xAxes = this.getXAxes();
    scales.yAxes = this.getYAxes();

    return scales;
  }

  private getXAxes(): Array<Axes> {
    const xAxes = new Axes();
    const gridLines = new GridLines();
    gridLines.display = false;
    xAxes.gridLines = gridLines;

    return [xAxes];
  }

  private getYAxes(): Array<Axes> {
    const yAxes = new Axes();
    yAxes.display = false;
    const gridLines = new GridLines();
    gridLines.display = false;
    yAxes.gridLines = gridLines;
    yAxes.ticks = new Ticks();
    yAxes.ticks.beginAtZero = true;

    return [yAxes];
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
    padding.top = 50;
    padding.bottom = 0;

    return padding;
  }

  private getType(): string {
    return 'bar';
  }
}
