
import { Injectable } from '@angular/core';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { SimulationAidesSociales } from '@models/simulation-aides-sociales';
import { Style } from '../models/style';
import { Cell } from '../models/table/cell';
import { Table } from '../models/table/table';
import { TableElement } from '../models/table/table-element';



@Injectable({ providedIn: 'root' })
export class BlockRessourcesEstimeesService {

  constructor(
  ) {

  }

  public addBlockRessourcesEstimees(content: Array<any>, demandeurEmploi: DemandeurEmploi, simulationAidesSociales: SimulationAidesSociales): any {
    let body = new Array<Array<Cell>>();

    this.addRow1(body, simulationAidesSociales);
 //   this.addRow2(body, demandeurEmploi, simulationAidesSociales);

    const tableElement = new TableElement();
    tableElement.style = 'tableStyle3';
    const table = new Table();
    table.body = body;
    table.widths = this.getWithsColumns(simulationAidesSociales);
    tableElement.table = table;
    content.push(tableElement);
  }

  private addRow1(body: Array<Array<Cell>>, simulationAidesSociales: SimulationAidesSociales): void {
    const row = new Array<Cell>();
    row.push(this.createCell1Row1(simulationAidesSociales));

    const nbrMoisSimule = simulationAidesSociales.simulationsMensuelles.length;
    for (let i = 0; i < nbrMoisSimule; i++) {
      row.push(new Cell());
    }

    body.push(row);
  }

  private createCell1Row1(simulationAidesSociales: SimulationAidesSociales): Cell {
    const nbrMoisSimule = simulationAidesSociales.simulationsMensuelles.length;

    const cell = new Cell();
    cell.text = 'Mes ressources estimées après reprise d’emploi pour les ' + nbrMoisSimule + ' mois à venir';
    cell.fillColor = '#ADE8F4';
    const style = new Style();
    style.alignment = 'center';
    style.background = '#ADE8F4';
    style.bold = true;
    style.color = '#23333C';
    style.fontSize = 14;
    cell.style = style;
    cell.colSpan = 7;

    return cell;
  }

  private addRow2(body: Array<Array<Cell>>, demandeurEmploi: DemandeurEmploi, simulationAidesSociales: SimulationAidesSociales): void {
    const row = new Array<Cell>();
    row.push(this.createCell1Row2(simulationAidesSociales));
    row.push(this.createCell1Row2(simulationAidesSociales));
    body.push(row);
  }

  private createCell1Row2(simulationAidesSociales: SimulationAidesSociales): Cell {
    const nbrMoisSimule = simulationAidesSociales.simulationsMensuelles.length;

    const cell = new Cell();
    cell.text = 'Mes ressources estimées après reprise d’emploi pour les ' + nbrMoisSimule + ' mois à venir';
    cell.fillColor = '#ADE8F4';
    const style = new Style();
    style.alignment = 'center';
    style.background = '#ADE8F4';
    style.bold = true;
    style.color = '#23333C';
    style.fontSize = 14;
    cell.style = style;

    return cell;
  }

  private getWithsColumns(simulationAidesSociales: SimulationAidesSociales): Array<number> {
    const widthMaxTable = 450;
    const nbrColumns = simulationAidesSociales.simulationsMensuelles.length + 1;
    const widthColumn =  widthMaxTable / nbrColumns;
    const widthsColumns = [];
    for (let i = 0; i < nbrColumns; i++) {
      widthsColumns.push(widthColumn);
    }
    return widthsColumns;
  }

}