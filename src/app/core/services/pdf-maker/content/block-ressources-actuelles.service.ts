
import { Injectable } from '@angular/core';
import { SimulationAidesSociales } from '@models/simulation-aides-sociales';
import { Figure } from '../models/figure/figure';
import { Line } from "../models/figure/elements/line";
import { Rectangle } from '../models/figure/elements/rectangle';
import { TableElement } from "../models/table/table-element";
import { Table } from '../models/table/table';
import { Row } from '../models/table/row';
import { Cell } from '../models/table/cell';
import { Style } from '../models/style';


@Injectable({ providedIn: 'root' })
export class BlockRessourcesActuellesService {

  constructor(
  ) {

  }

  public addBlockRessourcesActuelles(content: Array<any>, simulationAidesSociales: SimulationAidesSociales): void {
    this.addTableRessourcesActuelles(content, simulationAidesSociales);
    this.addRectangle(content);
    this.addVerticalLine(content);
  }

  private addTableRessourcesActuelles(content: Array<any>, simulationAidesSociales: SimulationAidesSociales): void {
    let body = new Array<Array<Cell>>();
    this.addRow1(body);
    this.addRow2(body, simulationAidesSociales);
    content.push(this.createTableElement(body));
  }

  private addRectangle(content: Array<any>): any {
    const figure = new Figure(new Array<any>());
    const rectangle = new Rectangle(
      0,
      -75,
      360,
      70,
      5,
      '#D6D9E4'
    );
    figure.canvas.push(rectangle);
    content.push(figure);
  }

  private addVerticalLine(content: Array<any>): void {
    const figure = new Figure(new Array<any>());
    const line = new Line(
      210,
      -65,
      210,
      -15,
      1,
      '#D6D9E4'
    );
    figure.canvas.push(line);
    content.push(figure);
  }


  /**************** méthode utiles création TableRessourcesActuelles ****************************/

  private addRow1(body: Array<Array<Cell>>): void {
    const row = new Array<Cell>();
    row.push(this.createCell1Row1());
    row.push(this.createCell2Row1());
    body.push(row);
  }

  private createCell1Row1(): Cell {
    const cell = new Cell();
    cell.text = 'Mes ressources actuelles \n avant reprise d’emploi';
    cell.rowSpan = 2;

    const style = new Style();
    style.bold = true;
    style.color = '#23333C';
    style.fontSize = 14;
    cell.style = style;

    return cell;
  }

  private createCell2Row1(): Cell {
    const cell = new Cell();
    cell.text = 'Revenus et aides';

    const style = new Style();
    style.alignment = 'center';
    style.bold = true;
    style.color = '#3853B9';
    style.fontSize = 14;
    cell.style = style;

    return cell;
  }

  private addRow2(body: Array<Array<Cell>>, simulationAidesSociales: SimulationAidesSociales): void {
    const row = new Array<Cell>();
    const cell1 = new Cell();
    row.push(cell1);
    row.push(this.createCell2Row2(simulationAidesSociales));
    body.push(row);
  }

  private createCell2Row2(simulationAidesSociales: SimulationAidesSociales): Cell {
    const cell = new Cell();
    cell.text = simulationAidesSociales.montantRessourcesFinancieresMoisAvantSimulation + ' €';

    const styleTextCell2 = new Style();
    styleTextCell2.alignment = 'center';
    styleTextCell2.bold = true;
    styleTextCell2.color = '#23333C';
    styleTextCell2.fontSize = 18;
    cell.style = styleTextCell2;

    return cell;
  }

  private createTableElement(body: Array<Array<Cell>>): TableElement {
    const tableElement = new TableElement();
    tableElement.layout = 'noBorders';
    tableElement.style = 'tableStyle2';
    const table = new Table();
    table.body = body;
    table.widths = [200, 'auto'];
    tableElement.table = table;
    return tableElement;
  }

}