import { Injectable } from '@angular/core';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { Simulation } from '@app/commun/models/simulation';
import { CodesAidesEnum } from '@enumerations/codes-aides.enum';
import { CouleursAidesDiagrammeEnum } from '@enumerations/couleurs-aides-diagramme.enum';
import { DevisesEnum } from '@enumerations/devises.enum';
import { LibellesAidesEnum } from '@enumerations/libelles-aides.enum';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DeConnecteRessourcesFinancieresAvantSimulationService } from '../demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { DeConnecteSimulationService } from '../demandeur-emploi-connecte/de-connecte-simulation.service';
import { DeConnecteService } from '../demandeur-emploi-connecte/de-connecte.service';
import { AidesService } from '../utile/aides.service';
import { DateUtileService } from '../utile/date-util.service';
import { ScreenService } from '../utile/screen.service';
import { SimulationService } from '../utile/simulation.service';
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
    private deConnecteRessourcesFinancieresAvantSimulationService: DeConnecteRessourcesFinancieresAvantSimulationService,
    private deConnecteSimulationService: DeConnecteSimulationService,
    private dateUtileService: DateUtileService,
    private aidesService: AidesService,
    private screenService: ScreenService,
    private simulationAidesService: SimulationService
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
    labelsMois.push('');
    simulation.simulationsMensuelles.forEach(
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
   * @param simulation
   * @param demandeurEmploiConnecte
   * @returns Array<Dataset>
   */
  private getDatasets(simulation: Simulation, demandeurEmploiConnecte: DemandeurEmploi): Array<Dataset> {
    const dataObject = this.initDatasets();

    simulation.simulationsMensuelles.forEach((simulationMensuelle, index) => {
      const ressourcesFinancieresEtAides = this.simulationAidesService.getRessourcesFinancieresEtAidesSimulationMensuelle(simulationMensuelle);
      ressourcesFinancieresEtAides.forEach((ressourcesFinanciereOuAide) => {
        switch (ressourcesFinanciereOuAide.code) {
          case CodesAidesEnum.AGEPI: {
            dataObject.datasets.get(CodesAidesEnum.AGEPI).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.AIDE_MOBILITE: {
            dataObject.datasets.get(CodesAidesEnum.AIDE_MOBILITE).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES: {
            dataObject.datasets.get(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE: {
            dataObject.datasets.get(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.ALLOCATION_SOUTIEN_FAMILIAL: {
            dataObject.datasets.get(CodesAidesEnum.ALLOCATION_SOUTIEN_FAMILIAL).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.ALLOCATIONS_FAMILIALES: {
            dataObject.datasets.get(CodesAidesEnum.ALLOCATIONS_FAMILIALES).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.AIDE_RETOUR_EMPLOI: {
            dataObject.datasets.get(CodesAidesEnum.AIDE_RETOUR_EMPLOI).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.COMPLEMENT_FAMILIAL: {
            dataObject.datasets.get(CodesAidesEnum.COMPLEMENT_FAMILIAL).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.PRIME_ACTIVITE: {
            dataObject.datasets.get(CodesAidesEnum.PRIME_ACTIVITE).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.PRESTATION_ACCUEIL_JEUNE_ENFANT: {
            dataObject.datasets.get(CodesAidesEnum.PRESTATION_ACCUEIL_JEUNE_ENFANT).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.PENSIONS_ALIMENTAIRES: {
            dataObject.datasets.get(CodesAidesEnum.PENSIONS_ALIMENTAIRES).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.RSA: {
            dataObject.datasets.get(CodesAidesEnum.RSA).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT: {
            dataObject.datasets.get(CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE: {
            dataObject.datasets.get(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE: {
            dataObject.datasets.get(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.PENSION_INVALIDITE: {
            dataObject.datasets.get(CodesAidesEnum.PENSION_INVALIDITE).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.ALLOCATION_SUPPLEMENTAIRE_INVALIDITE: {
            dataObject.datasets.get(CodesAidesEnum.ALLOCATION_SUPPLEMENTAIRE_INVALIDITE).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.SALAIRE: {
            dataObject.datasets.get(CodesAidesEnum.SALAIRE).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.IMMOBILIER: {
            dataObject.datasets.get(CodesAidesEnum.IMMOBILIER).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.TRAVAILLEUR_INDEPENDANT: {
            dataObject.datasets.get(CodesAidesEnum.TRAVAILLEUR_INDEPENDANT).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          case CodesAidesEnum.MICRO_ENTREPRENEUR: {
            dataObject.datasets.get(CodesAidesEnum.MICRO_ENTREPRENEUR).data[index + 1] = ressourcesFinanciereOuAide.montant;
            break;
          }
          default:
        }
      });
    });
    dataObject.datasets.get(ChartUtileService.CODE_RESSOURCES_AVANT_REPRISE_EMPLOI).data[0] = simulation.montantRessourcesFinancieresMoisAvantSimulation;
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
        label: LibellesAidesEnum.AGEPI.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.AGEPI,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.AIDE_MOBILITE,
      {
        label: LibellesAidesEnum.AIDE_MOBILITE.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.AIDE_MOBILITE,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES,
      {
        label: LibellesAidesEnum.ALLOCATION_ADULTES_HANDICAPES.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.ALLOCATION_ADULTES_HANDICAPES,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE,
      {
        label: LibellesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.ALLOCATION_SOUTIEN_FAMILIAL,
      {
        label: LibellesAidesEnum.ALLOCATION_SOUTIEN_FAMILIAL.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.ALLOCATION_SOUTIEN_FAMILIAL,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.ALLOCATIONS_FAMILIALES,
      {
        label: LibellesAidesEnum.ALLOCATIONS_FAMILIALES.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.ALLOCATIONS_FAMILIALES,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.AIDE_RETOUR_EMPLOI,
      {
        label: LibellesAidesEnum.AIDE_RETOUR_EMPLOI.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.AIDE_RETOUR_EMPLOI,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.COMPLEMENT_FAMILIAL,
      {
        label: LibellesAidesEnum.COMPLEMENT_FAMILIAL.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.COMPLEMENT_FAMILIAL,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.PENSION_INVALIDITE,
      {
        label: LibellesAidesEnum.PENSION_INVALIDITE.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.PENSION_INVALIDITE,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.PRESTATION_ACCUEIL_JEUNE_ENFANT,
      {
        label: LibellesAidesEnum.PRESTATION_ACCUEIL_JEUNE_ENFANT.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.PRESTATION_ACCUEIL_JEUNE_ENFANT,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.PENSIONS_ALIMENTAIRES,
      {
        label: LibellesAidesEnum.PENSIONS_ALIMENTAIRES.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.PENSIONS_ALIMENTAIRES,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.ALLOCATION_SUPPLEMENTAIRE_INVALIDITE,
      {
        label: LibellesAidesEnum.ALLOCATION_SUPPLEMENTAIRE_INVALIDITE.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.ALLOCATION_SUPPLEMENTAIRE_INVALIDITE,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.PRIME_ACTIVITE,
      {
        label: LibellesAidesEnum.PRIME_ACTIVITE.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.PRIME_ACTIVITE,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT,
      {
        label: LibellesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.AIDE_PERSONNALISEE_LOGEMENT,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE,
      {
        label: LibellesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.ALLOCATION_LOGEMENT_FAMILIALE,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE,
      {
        label: LibellesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.ALLOCATION_LOGEMENT_SOCIALE,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.RSA,
      {
        label: LibellesAidesEnum.RSA.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.RSA,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.SALAIRE,
      {
        label: LibellesAidesEnum.SALAIRE.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.SALAIRE,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.IMMOBILIER,
      {
        label: LibellesAidesEnum.IMMOBILIER.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.IMMOBILIER,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.TRAVAILLEUR_INDEPENDANT,
      {
        label: LibellesAidesEnum.TRAVAILLEUR_INDEPENDANT.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.TRAVAILLEUR_INDEPENDANT,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(CodesAidesEnum.MICRO_ENTREPRENEUR,
      {
        label: LibellesAidesEnum.MICRO_ENTREPRENEUR.padEnd(30, ' '),
        backgroundColor: CouleursAidesDiagrammeEnum.MICRO_ENTREPRENEUR,
        data: [0, 0, 0, 0, 0, 0, 0],
        barPercentage: ChartUtileService.BAR_PERCENTAGE
      }
    );

    dataObject.datasets.set(ChartUtileService.CODE_RESSOURCES_AVANT_REPRISE_EMPLOI,
      {
        label: ChartUtileService.LIBELLE_RESSOURCES_AVANT_REPRISE_EMPLOI.padEnd(20, ' '),
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
    options.aspectRatio = this.getAspectRatio();
    options.legend = this.getLegend(data);
    options.plugins = this.getPlugins(data);
    options.scales = this.getScales();
    options.layout = this.getLayout();
    options.borderRadius = {
      topRight: 4,
      topLeft: 4
    };

    return options;
  }

  private getAspectRatio() {
    if (this.screenService.isExtraSmallScreen()) return 0.5;
    if (this.screenService.isTabletScreen()) return 1;
    return 2;
  }

  private getLegend(data: Data): Legend {
    const legend = new Legend();

    legend.position = 'bottom';
    legend.align = 'start';
    legend.labels = this.getLegendLabels(data);

    return legend;
  }

  private getLegendLabels(data: Data): Labels {
    const aidesDisponibles = this.getAidesDisponibles(data);
    const labels = new Labels();

    labels.fontSize = 13;
    labels.boxWidth = 42;
    labels.boxHeight = 42;
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
        ctx.chart.options.aspectRatio != 0.5 &&
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
        if (sum != 0) return `${sum.toString()} ${DevisesEnum.EURO.symbole}`;
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
