
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

    const widthsColumns = [200, 'auto'];

    let body = new Array<Array<Cell>>();

    this.addRow1(body);
    this.addRow2(body, simulationAidesSociales);

    const table = new Table(widthsColumns, body);
    const tableElement = new TableElement(table, 'tableStyle2', 'headerLineOnly');

    content.push(tableElement);
  }

  private addRow1(body: Array<Array<Cell>>): void {
    const row = new Array<Cell>();

    const cell1 = new Cell();
    cell1.text = 'Mes ressources actuelles \n avant reprise d’emploi';
    cell1.rowSpan = 2;
    const styleTextCell1 = new Style();
    styleTextCell1.bold = true;
    styleTextCell1.color = '#23333C';
    styleTextCell1.fontSize = 14;
    cell1.style = styleTextCell1;
    row.push(cell1);

    const cell2 = new Cell();
    cell2.text = 'Revenus et aides';
    const styleTextCell2 = new Style();
    styleTextCell2.alignment = 'center';
    styleTextCell2.bold = true;
    styleTextCell2.color = '#3853B9';
    styleTextCell2.fontSize = 14;
    cell2.style = styleTextCell2;
    row.push(cell2);

    body.push(row);
  }

  private addRow2(body: Array<Array<Cell>>, simulationAidesSociales: SimulationAidesSociales): void {
    const row = new Array<Cell>();

    const cell1 = new Cell();
    row.push(cell1);

    const cell2 = new Cell();
    cell2.text = simulationAidesSociales.montantRessourcesFinancieresMoisAvantSimulation + ' €';
    const styleTextCell2 = new Style();
    styleTextCell2.alignment = 'center';
    styleTextCell2.bold = true;
    styleTextCell2.color = '#23333C';
    styleTextCell2.fontSize = 18;
    cell2.style = styleTextCell2;
    row.push(cell2);

    body.push(row);
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
}