
import { Injectable } from '@angular/core';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { DateUtileService } from '../../utile/date-util.service';
import { Style } from '../models/style';
import { Cell } from '../models/table/cell';
import { Table } from '../models/table/table';
import { TableElement } from '../models/table/table-element';
import { DeConnecteRessourcesFinancieresAvantSimulationService } from '../../demandeur-emploi-connecte/de-connecte-ressources-financieres.service';

@Injectable({ providedIn: 'root' })
export class BlockDonneesSaisiesService {

  constructor(
    private dateUtileService: DateUtileService,
    private deConnecteRessourcesFinancieresAvantSimulationService: DeConnecteRessourcesFinancieresAvantSimulationService,
  ) {

  }

  public addBlockDonneesSaisies(content: Array<any>, demandeurEmploi: DemandeurEmploi): void {
    let body = new Array<Array<Cell>>();
    this.addRowDateSimulation(body);
    this.addRowContratCible(body, demandeurEmploi);
    this.addRowRessourcesFinancieresAvantSimulation(body);
    content.push(this.createTableElement(body));
  }

  /************** méthode création table "Mes futures ressources et aides"  *****************/

  public addRowDateSimulation(body: Array<Array<Cell>>): void {
    const row = new Array<Cell>();
    const dateSimulation = this.getDateSimulation();
    row.push(this.createCell(dateSimulation));
    body.push(row);
  }

  private getDateSimulation() {
    return `• Date de simulation : ${this.dateUtileService.getLibelleDateHeureActuelle()}`;
  }

  /************** méthode création table "Mes futures ressources et aides"  *****************/

  public addRowContratCible(body: Array<Array<Cell>>, demandeurEmploi: DemandeurEmploi): void {
    const row = new Array<Cell>();
    const contratCible = this.getContratCible(demandeurEmploi);
    row.push(this.createCell(contratCible));
    body.push(row);
  }

  private getContratCible(demandeurEmploi: DemandeurEmploi) {
    const typeContrat = demandeurEmploi.futurTravail.typeContrat;
    const nombreMoisContratCDD = demandeurEmploi.futurTravail.typeContrat == 'CDD' ? `${demandeurEmploi.futurTravail.nombreMoisContratCDD} mois ` : '';
    const salaireNet = demandeurEmploi.futurTravail.salaire.montantMensuelNet;
    const nombreHeuresTravailleesSemaine = demandeurEmploi.futurTravail.nombreHeuresTravailleesSemaine;
    return `• Contrat ciblé : ${typeContrat} ${nombreMoisContratCDD}- ${salaireNet}€ net par mois - ${nombreHeuresTravailleesSemaine}h par semaine`;
  }

  /************** méthode création table "Mes futures ressources et aides"  *****************/

  public addRowRessourcesFinancieresAvantSimulation(body: Array<Array<Cell>>): void {
    const row = new Array<Cell>();
    const ressourcesFinancieresAvantSimulation = this.getRessourcesFinancieresAvantSimulation();
    row.push(this.createCell(ressourcesFinancieresAvantSimulation));
    body.push(row);
  }

  private getRessourcesFinancieresAvantSimulation() {
    const montantTotalRessourcesFinancieresAvantSimulation = this.deConnecteRessourcesFinancieresAvantSimulationService.getMontantTotalRessources()
    return `• Ressources actuelles : ${montantTotalRessourcesFinancieresAvantSimulation}€ par mois pour le foyer`;
  }

  private createCell(libelle: string): Cell {
    const cell = new Cell();
    cell.text = libelle;

    const style = new Style();
    style.color = '#23333C';
    style.fontSize = 11;
    cell.style = style;
    return cell;
  }


  private createTableElement(body: Array<Array<Cell>>): TableElement {
    const tableElement = new TableElement();
    tableElement.style = 'tableStyle5';
    tableElement.layout = 'noBorders';

    const table = new Table();
    table.widths = ['auto'];
    table.body = body;
    tableElement.table = table;

    return tableElement;
  }
}