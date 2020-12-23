
import { Injectable } from '@angular/core';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { SimulationMensuelle } from '@app/commun/models/simulation-mensuelle';
import { SimulationAidesSociales } from '@models/simulation-aides-sociales';
import { DateUtileService } from '../../utile/date-util.service';
import { Style } from '../models/style';
import { Cell } from '../models/table/cell';
import { Table } from '../models/table/table';
import { TableElement } from '../models/table/table-element';
import { Text } from '../models/text';
import { DeConnecteSimulationAidesSocialesService } from "../../demandeur-emploi-connecte/de-connecte-simulation-aides-sociales.service";
import { LayoutTable } from '../models/table/layout-table'

@Injectable({ providedIn: 'root' })
export class BlockRessourcesEstimeesService {

  constructor(
    private dateUtileService: DateUtileService,
    private deConnecteSimulationAidesSocialesService: DeConnecteSimulationAidesSocialesService
  ) {

  }

  public addElementTableMesRessourcesEstimees(content: Array<any>, demandeurEmploi: DemandeurEmploi, simulationAidesSociales: SimulationAidesSociales): void {
    this.addTableMesRessourcesEstimees(content, demandeurEmploi, simulationAidesSociales);
    this.addTableMesRessourcesEtAidesActuelles(content, demandeurEmploi, simulationAidesSociales);
  }

  /************** méthode création table "Mes ressources et aides actuelles"  *****************/

  public addTableMesRessourcesEtAidesActuelles(content: Array<any>, demandeurEmploi: DemandeurEmploi, simulationAidesSociales: SimulationAidesSociales): void {
    const nbrColumns = simulationAidesSociales.simulationsMensuelles.length + 1;
    let body = new Array<Array<Cell>>();
    this.addHeaderTableMesRessourcesEtAidesActuelles(body, simulationAidesSociales);
    this.addRowPaie(body, demandeurEmploi, simulationAidesSociales);
    content.push(this.createTableElementMesRessourcesEtAidesActuelles(body, nbrColumns));
  }

  private addHeaderTableMesRessourcesEtAidesActuelles(body: Array<Array<Cell>>, simulationAidesSociales: SimulationAidesSociales): void {
    const nbrMoisSimule = simulationAidesSociales.simulationsMensuelles.length;
    const row = new Array<Cell>();
    row.push(this.createCellTitleMesRessourcesEtAidesActuelles(simulationAidesSociales, nbrMoisSimule));
    //on ajoute des cellules vides pour obtenir un nombre de colonnes = nbrMoisSimule + 1
    for (let i = 0; i < nbrMoisSimule; i++) {
      row.push(new Cell());
    }
    body.push(row);
  }

  private createCellTitleMesRessourcesEtAidesActuelles(simulationAidesSociales: SimulationAidesSociales, nbrMoisSimule: number): Cell {
    const cell = new Cell();
    cell.colSpan = 7;
    cell.fillColor = '#ADE8F4';
    cell.style = new Style();
    cell.style.background = '#ADE8F4';
    cell.style.bold = true;
    cell.style.color = '#1B2B67';
    cell.style.fontSize = 12;
    cell.text = 'Mes ressources et aides actuelles';
    return cell;
  }

  private addRowPaie(body: Array<Array<Cell>>, demandeurEmploi: DemandeurEmploi, simulationAidesSociales: SimulationAidesSociales): void {
    const row = new Array<Cell>();

    //création d'une cellule vide
    row.push(new Cell());
    //création des cellules pour chaque simulation mensuelle
    const nbrMoisSimule = simulationAidesSociales.simulationsMensuelles.length;
    simulationAidesSociales.simulationsMensuelles.forEach(simulationMensuelle => {
      row.push(this.createCellMontant(demandeurEmploi.futurTravail.salaireMensuelNet));
    });

    body.push(row);
  }

  private createTableElementMesRessourcesEtAidesActuelles(body: Array<Array<Cell>>, nbrColumns: number): TableElement {
    const tableElement = new TableElement();
    const layoutTable = new LayoutTable();
    layoutTable.hLineColor = 'white';
    layoutTable.vLineColor = '#ADE8F4';
    tableElement.layout = layoutTable;
    tableElement.style = 'tableStyle4';
    tableElement.table = new Table();
    tableElement.table.body = body;
    tableElement.table.widths = this.getWithsColumns(nbrColumns);
    return tableElement;
  }

  /************** méthode création table "Mes ressources estimees"  *****************/

  public addTableMesRessourcesEstimees(content: Array<any>, demandeurEmploi: DemandeurEmploi, simulationAidesSociales: SimulationAidesSociales): void {
    const nbrColumns = simulationAidesSociales.simulationsMensuelles.length + 1;
    let body = new Array<Array<Cell>>();
    this.addHeaderTableMesRessourcesEstimees(body, simulationAidesSociales);
    this.addRowMontantTotalSimulationMensuelle(body, demandeurEmploi, simulationAidesSociales, nbrColumns);
    content.push(this.createTableElementMesRessourcesEstimees(body, nbrColumns));
  }

  private addHeaderTableMesRessourcesEstimees(body: Array<Array<Cell>>, simulationAidesSociales: SimulationAidesSociales): void {
    const nbrMoisSimule = simulationAidesSociales.simulationsMensuelles.length;
    const row = new Array<Cell>();
    row.push(this.addTitleMesRessourcesEstimees(simulationAidesSociales, nbrMoisSimule));
    //on ajoute des cellules vides pour obtenir un nombre de colonnes = nbrMoisSimule + 1
    for (let i = 0; i < nbrMoisSimule; i++) {
      row.push(new Cell());
    }
    body.push(row);
  }

  private addTitleMesRessourcesEstimees(simulationAidesSociales: SimulationAidesSociales, nbrMoisSimule: number): Cell {
    const cell = new Cell();
    cell.colSpan = 7;
    cell.fillColor = '#ADE8F4';
    cell.style = new Style();
    cell.style.alignment = 'center';
    cell.style.background = '#ADE8F4';
    cell.style.bold = true;
    cell.style.color = '#23333C';
    cell.style.fontSize = 14;
    cell.text = '\nMes ressources estimées après reprise d’emploi pour les ' + nbrMoisSimule + ' mois à venir';
    return cell;
  }

  private addRowMontantTotalSimulationMensuelle(body: Array<Array<Cell>>, demandeurEmploi: DemandeurEmploi, simulationAidesSociales: SimulationAidesSociales, nbrColumns: number): void {
    const row = new Array<Cell>();

    //création d'une cellule vide
    row.push(new Cell());
    //création des cellules pour chaque simulation mensuelle
    const nbrMoisSimule = simulationAidesSociales.simulationsMensuelles.length;
    simulationAidesSociales.simulationsMensuelles.forEach(simulationMensuelle => {
      row.push(this.createCellMontantTotalSimulationMensuelle(simulationMensuelle));
    });

    body.push(row);
  }

  private createCellMontantTotalSimulationMensuelle(simulationMensuelle: SimulationMensuelle): Cell {
    const cell = new Cell();
    cell.text = new Array<any>();
    this.addLibelleDateSimulationMensuelle(cell.text, simulationMensuelle);
    this.addMontantTotalSimulationMensuelle(cell.text, simulationMensuelle);

    return cell;
  }

  private addLibelleDateSimulationMensuelle(contenu: Array<any>, simulationMensuelle: SimulationMensuelle): void {
    const libelleDate = this.dateUtileService.getDateStringFormatStyle2(simulationMensuelle.datePremierJourMoisSimule);
    const text1 = new Text();
    text1.text = libelleDate + '\n';
    text1.style = new Style();
    text1.style.alignment = 'center';
    text1.style.bold = true;
    text1.style.color = '#3853B9';
    text1.style.fontSize = 11;
    contenu.push(text1);
  }

  private addMontantTotalSimulationMensuelle(contenu: Array<any>, simulationMensuelle: SimulationMensuelle): void {
    const montantTotal = this.deConnecteSimulationAidesSocialesService.calculerMontantTotalRessourcesMois(simulationMensuelle);
    const text1 = new Text();
    text1.text = montantTotal + ' €';
    text1.style = new Style();
    text1.style.alignment = 'center';
    text1.style.bold = true;
    text1.style.fontSize = 13;
    contenu.push(text1);
  }

  private createTableElementMesRessourcesEstimees(body: Array<Array<Cell>>, nbrColumns: number): TableElement {
    const tableElement = new TableElement();
    const layoutTable = new LayoutTable();
    layoutTable.hLineColor = '#ADE8F4';
    layoutTable.vLineColor = '#ADE8F4';
    tableElement.layout = layoutTable;
    tableElement.style = 'tableStyle3';
    tableElement.table = new Table();
    tableElement.table.body = body;
    tableElement.table.heights = [50, 35];
    tableElement.table.widths = this.getWithsColumns(nbrColumns);
    return tableElement;
  }

  /*********** méthode communes ********************/

  private createCellMontant(montant: number): Cell {
    const cell = new Cell();
    cell.text = montant + ' €';
    cell.style = new Style();
    cell.style.alignment = 'center';
    cell.style.bold = true;
    return cell;
  }

  private getWithsColumns(nbrColumns: number): Array<number> {
    const widthMaxTable = 450;
    const widthColumn = widthMaxTable / nbrColumns;
    const widthsColumns = [];
    for (let i = 0; i < nbrColumns; i++) {
      widthsColumns.push(widthColumn);
    }
    return widthsColumns;
  }

}