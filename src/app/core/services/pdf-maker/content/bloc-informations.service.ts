
import { Injectable } from '@angular/core';
import { Cell } from "../models/table/cell";
import { Style } from "../models/style";
import { Table } from "../models/table/table";
import { TableElement } from "../models/table/table-element";
import { Rectangle } from "../models/figure/elements/rectangle";
import { Figure } from "../models/figure/figure";

@Injectable({ providedIn: 'root' })
export class BlockInformationsService {

  public addBlockInformations(content: Array<any>): any {
    this.addTableInformations(content);
    this.addRectangle(content);
  }


  private addTableInformations(content: Array<any>): any {
    let body = new Array<Array<Cell>>();

    const row = new Array<Cell>();
    row.push(this.createCell1());
    row.push(this.createCell2());
    body.push(row);
    content.push(this.createTableElement(body));
  }

  private createTableElement(body: Array<Array<Cell>>): TableElement {
    const tableElement = new TableElement();
    tableElement.style = 'tableStyle1';
    tableElement.layout = 'noBorders';

    const table = new Table();
    table.widths = ['auto', '*'];
    table.body = body;
    tableElement.table = table;

    return tableElement;
  }

  private createCell1(): Cell {
    const cell = new Cell();
    cell.image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAlCAYAAADFniADAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANBSURBVHgB7VjdcdpAEP5OSQF0EDkNmA5yKAWYDiy/5c24AnAFwRUYd0Ae8xBzdIArsDoIFZzyre5khKxfBjLJDN+MQOL2dj/t7e3tApzxH0OhJ7TWA34NAwRXKZQG0pDPAz+85fNGQW0s1NqYX0scgM6khAyJ3KbApEDCE8kuQVialtDAwsI+GWMSHJMUCV0rBPMdmdTQS0+ANWVjlA2BQFNG02PXOTm+zL0xz4sO5tpJRTr67r0jwg986xmJbNEBjqCa5eQ4f/5snu/a5qkWQo8kFPOt+abpjbgFB4DkxGuPNBfKcpLYTZP8B9QTEg9984RG5LPBgUiIMAx/kNCYxPTn8GLwmrz+rJOv9JTWUcyBxwKhpE6BLBHjbSX3KWwHWbUSj1E2puxTlVxQPRFTZyRbsgSNCGK4XRf6+1qILtEp97JxfHppJ8WfJCj5Jlh0iyG7EI+6S+6bITqp+4G3kmImVTLvlm+ko1dHyl70yS19IB6ip37zduvt7O3mj/vCX8eSob2XErQqj2LsJUzbaZ6QoC2jmMv4OJSfaknBCYnyNTrAbYbCbBcNM3RCKkGuuYTjFlLqUlSXhWrVAhK03BjpFecO0QvWSEgz8L+UR/YCncozxV1jSY4NXjOSe0FPeBtbSQ9oIgV3tiX4e9hi/3DPEOAfRJlUJfMTIsSu7HlDiZRK+DGIougTTgxXQQjSTSMp7oQsFViLEU6OQMsnz8KXRlKks3SC6TVODBrOUoHNUsO7sT2IK2Wb6rrD8hiQpcvrNKaGZSMpSf/+sORAMMWJkOtWWUldNf4OVmpxITcRd+HIEJ25l2xNVVFT5GkWeYGca0ld4UaZW7UrPQb+8p2N2jIulyx770tz8oJQqhCp1RZV9iuTpwj7ZcyU7LZvcWKg8VbcveW2gXtOh9zJ4zpC0oDUERI0Ng4jPVrAdSKJfzNTNJJv62rs2i/XOGSeD6U6WJlVjAa0tlismeYUuvXC0ljedz2wfQM7LbZoXNJJ27yOzag0Euk0P9EdOaybmlGX66StzyAV5l3TkvUmVTAWe2NhaTjx33nAY0dGYtPOuzawvUiVCI5dPKlLX4MV/+Bg/Km1Px02fcicccap8Ae5xHokpVMqkgAAAABJRU5ErkJggg==';
    cell.width = 23;
    cell.height = 23;
    return cell;
  }

  private createCell2(): Cell {
    const cell = new Cell();
    cell.text = 'Montants nets, avant éventuel impôt sur le revenu. \nSimulation à titre d’information, aucune valeur contractuelle.';

    const style = new Style();
    style.color = '#2B2E30';
    style.fontSize = 11;
    cell.style = style;

    return cell;
  }

  private addRectangle(content: Array<any>): any {
    const figure = new Figure(new Array<any>());
    const rectangle = new Rectangle(
      0,
      -50,
      515,
      50,
      5,
      '#FF5950'
    );
    figure.canvas.push(rectangle);
    content.push(figure);
  }
}