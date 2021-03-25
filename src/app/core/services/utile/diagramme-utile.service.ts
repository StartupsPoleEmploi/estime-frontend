import { Injectable } from '@angular/core';
import { RessourcesFinancieresUtileService } from './ressources-financieres-utiles.service';
import { DeConnecteService } from '../demandeur-emploi-connecte/de-connecte.service';
import { DeConnecteRessourcesFinancieresService } from '../demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { DeConnecteSimulationAidesSocialesService } from '../demandeur-emploi-connecte/de-connecte-simulation-aides-sociales.service';
import { AidesService } from "@app/core/services/utile/aides.service";
import { DateUtileService } from "@app/core/services/utile/date-util.service";
import { DonneesDiagramme } from '@models/donnees-diagramme';
import { DatasetDiagramme } from '@models/dataset-diagramme';
import { CouleursAidesDiagrammeEnum } from '@enumerations/couleurs-aides-diagramme.enum';
import { CodesAidesEnum } from '@enumerations/codes-aides.enum';
import { CodesRessourcesFinancieresEnum } from '@enumerations/codes-ressources-financieres.enum';
import { SimulationAidesSociales } from '@app/commun/models/simulation-aides-sociales';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { SimulationMensuelle } from '@app/commun/models/simulation-mensuelle';

@Injectable({ providedIn: 'root' })
export class DiagrammeUtileService {


  private donneesDiagramme = {
    'labels': [],
    'datasets': {}
  };
  private datasets = {};

  // Label formatter function
public formatter = (value, ctx) => {
  const otherDatasetIndex = ctx.datasetIndex === 0 ? 1 : 0;
  const total =
    ctx.chart.data.datasets[otherDatasetIndex].data[ctx.dataIndex] + value;

  return `${(value / total * 100).toFixed(0)}%`;
};

  constructor(
    private deConnecteService: DeConnecteService,
    private deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    private deConnecteSimulationAidesSocialesService: DeConnecteSimulationAidesSocialesService,
    private dateUtileService: DateUtileService,
    private aidesService: AidesService
  ) {
    this.datasets[CodesAidesEnum.AGEPI] = {
      label: "AGEPI",
      backgroundColor: CouleursAidesDiagrammeEnum.AGEPI,
      data: [0, 0, 0, 0, 0, 0, 0]
    };

    this.datasets[CodesAidesEnum.AIDE_MOBILITE] = {
      label: "Aide à la mobilité",
      backgroundColor: CouleursAidesDiagrammeEnum.AIDE_MOBILITE,
      data: [0, 0, 0, 0, 0, 0, 0]
    };

    this.datasets[CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES] = {
      label: "AAH",
      backgroundColor: CouleursAidesDiagrammeEnum.ALLOCATION_ADULTES_HANDICAPES,
      data: [0, 0, 0, 0, 0, 0, 0]
    };

    this.datasets[CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE] = {
      label: "ASS",
      backgroundColor: CouleursAidesDiagrammeEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE,
      data: [0, 0, 0, 0, 0, 0, 0]
    };

    this.datasets[CodesAidesEnum.PENSION_INVALIDITE] = {
      label: "Pension d'invalidité",
      backgroundColor: CouleursAidesDiagrammeEnum.PENSION_INVALIDITE,
      data: [0, 0, 0, 0, 0, 0, 0]
    };

    this.datasets[CodesAidesEnum.PRIME_ACTIVITE] = {
      label: "Prime d'activité",
      backgroundColor: CouleursAidesDiagrammeEnum.PRIME_ACTIVITE,
      data: [0, 0, 0, 0, 0, 0, 0]
    };

    this.datasets[CodesAidesEnum.RSA] = {
      label: "RSA",
      backgroundColor: CouleursAidesDiagrammeEnum.RSA,
      data: [0, 0, 0, 0, 0, 0, 0]
    };

    this.datasets[CodesRessourcesFinancieresEnum.PAIE] = {
      label: "Salaire net",
      backgroundColor: CouleursAidesDiagrammeEnum.PAIE,
      data: [0, 0, 0, 0, 0, 0, 0]
    };

    this.datasets[CodesRessourcesFinancieresEnum.IMMOBILIER] = {
      label: "Revenus immobiliers",
      backgroundColor: CouleursAidesDiagrammeEnum.IMMOBILIER,
      data: [0, 0, 0, 0, 0, 0, 0]
    };

    this.datasets[CodesRessourcesFinancieresEnum.TRAVAILLEUR_INDEPENDANT] = {
      label: "Revenus de travailleur indépendant",
      backgroundColor: CouleursAidesDiagrammeEnum.TRAVAILLEUR_INDEPENDANT,
      data: [0, 0, 0, 0, 0, 0, 0]
    };

    this.datasets['ressources_avant_reprise_emploi'] = {
      label: "Ressources avant reprise d'emploi",
      backgroundColor: CouleursAidesDiagrammeEnum.RESSOURCES_AVANT_REPRISE_EMPLOI,
      data: [0, 0, 0, 0, 0, 0, 0]
    };
  }

  public getDonneesDiagramme(): any {

    var simulationAidesSociales = this.deConnecteSimulationAidesSocialesService.getSimulationAidesSociales();
    var demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();

    this.donneesDiagramme.labels = this.getLabelsMois(simulationAidesSociales);
    this.donneesDiagramme.datasets = this.getDatasets(simulationAidesSociales, demandeurEmploiConnecte);

    return this.donneesDiagramme;
  }

  public getRessourcesTotalesPourChaqueMois(simulationAidesSociales): Array<Number> {
    var ressourcesTotalesParMois = [];
    ressourcesTotalesParMois.push(simulationAidesSociales.montantRessourcesFinancieresMoisAvantSimulation);
    simulationAidesSociales.simulationsMensuelles.forEach(simulationMensuelle => {
      ressourcesTotalesParMois.push(this.deConnecteSimulationAidesSocialesService.calculerMontantTotalRessourcesMois(simulationMensuelle));
    });
    return ressourcesTotalesParMois;
  }

  /**
   * Fonction qui permet de déterminer la liste des aides auxquelles le DE peut/pourra prétendre
   * et ainsi n'afficher que ces intitulés dans la légende du graphique
   *
   * @param datasets les datasets du diagramme
   * @returns aidesDisponibles : les libellés des aides disponibles
   */
  public getAidesDisponibles(datasets: Array<Object>): Array<String> {
    var aidesDisponibles = [];
    datasets.forEach((dataset) => {
      if(!(dataset['data'].every(item => item === 0))) aidesDisponibles.push(dataset['label']);
    })
    return aidesDisponibles;

  }

  /**
   * Fonction qui permet de déterminer les labels des mois qui déterminent les colonnes du diagramme
   * Le premier label est laissé vide car la première colonne concerne les ressources avant simulation
   *
   * @param simulationAidesSociales
   * @returns labelsMois
   */
  private getLabelsMois(simulationAidesSociales): Array<String> {
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
   * @returns
   */
  private getDatasets(simulationAidesSociales, demandeurEmploiConnecte): Array<DatasetDiagramme> {
    simulationAidesSociales.simulationsMensuelles.forEach((simulationMensuelle, index) => {
      for(var key in simulationMensuelle.mesAides) {
        switch(key) {
          case CodesAidesEnum.AGEPI: {
            this.datasets[CodesAidesEnum.AGEPI].data[index+1] = simulationMensuelle.mesAides[key].montant;
            break;
          }
          case CodesAidesEnum.AIDE_MOBILITE: {
            this.datasets[CodesAidesEnum.AIDE_MOBILITE].data[index+1] = simulationMensuelle.mesAides[key].montant;
            break;
          }
          case CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES: {
            this.datasets[CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES].data[index+1] = simulationMensuelle.mesAides[key].montant;
            break;
          }
          case CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE: {
            this.datasets[CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE].data[index+1] = simulationMensuelle.mesAides[key].montant;
            break;
          }
          case CodesAidesEnum.PENSION_INVALIDITE: {
            this.datasets[CodesAidesEnum.PENSION_INVALIDITE].data[index+1] = simulationMensuelle.mesAides[key].montant;
            break;
          }
          case CodesAidesEnum.PRIME_ACTIVITE: {
            break;
          }
          case CodesAidesEnum.RSA: {
            this.datasets[CodesAidesEnum.RSA].data[index+1] = simulationMensuelle.mesAides[key].montant;
            break;
          }
          case CodesRessourcesFinancieresEnum.PAIE: {
            this.datasets[CodesRessourcesFinancieresEnum.PAIE].data[index+1] = simulationMensuelle.mesAides[key].montant;
            break;
          }
          case CodesRessourcesFinancieresEnum.IMMOBILIER: {
            this.datasets[CodesRessourcesFinancieresEnum.IMMOBILIER].data[index+1] = simulationMensuelle.mesAides[key].montant;
            break;
          }
          case CodesRessourcesFinancieresEnum.TRAVAILLEUR_INDEPENDANT: {

          }
          default:;
        }
        this.datasets[CodesAidesEnum.PRIME_ACTIVITE].data[index+1] = this.aidesService.getMontantPensionInvalidite(demandeurEmploiConnecte);
        this.datasets[CodesRessourcesFinancieresEnum.PAIE].data[index+1] = demandeurEmploiConnecte.futurTravail.salaireMensuelNet;
        this.datasets[CodesRessourcesFinancieresEnum.IMMOBILIER].data[index+1] = this.deConnecteRessourcesFinancieresService.getRevenusImmobilierSur1Mois();
        this.datasets[CodesRessourcesFinancieresEnum.TRAVAILLEUR_INDEPENDANT].data[index+1] = this.deConnecteRessourcesFinancieresService.getRevenusTravailleurIndependantSur1Mois();
      }
    });
    this.datasets['ressources_avant_reprise_emploi'].data[0] = simulationAidesSociales.montantRessourcesFinancieresMoisAvantSimulation;

    var datasetsArray = [];
    for(var key in this.datasets) datasetsArray.push(this.datasets[key]);
    return datasetsArray;
  }
}