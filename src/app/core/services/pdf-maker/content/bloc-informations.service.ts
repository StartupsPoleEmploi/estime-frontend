
import { Injectable } from '@angular/core';
import { Cell } from "../models/table/cell";
import { Style } from "../models/style";
import { Table } from "../models/table/table";
import { TableElement } from "../models/table/table-element";
import { Rectangle } from "../models/figure/elements/rectangle";
import { Figure } from "../models/figure/figure";
import { DateUtileService } from '../../utile/date-util.service';
import { ImagesBase64Enum } from '@app/commun/enumerations/images-base64.enum';
import { Text } from '../models/text';

@Injectable({ providedIn: 'root' })
export class BlockInformationsService {

  informationData;

  constructor(
    private dateUtileService: DateUtileService
  ) {

  }
  public addBlockInformations(content: Array<any>): any {

    this.informationData = this.getInformationData();
    this.addSeparator(content);
    this.addTableInformations(content);
    this.addSeparator(content);
  }

  private getInformationData(): Object {
    return {
      localisation: {
        image: ImagesBase64Enum.ICONE_LOCALISATION,
        title: 'Basée sur une reprise d\'emploi',
        text: `en ${this.dateUtileService.getLibelleMoisApresDateJour(1).toLowerCase()} et un versement des salaires en fin de mois`
      },
      calendrier: {
        image: ImagesBase64Enum.ICONE_CALENDRIER,
        title: 'Visibilité sur 6 mois maximum',
        text: 'Vous pourriez bénéficier d’aides et d’allocations au-delà en fonction de votre situation'
      },
      euro: {
        image: ImagesBase64Enum.ICONE_EURO,
        title: 'Montants nets',
        text: 'avant éventuel impôt sur le revenu'
      },
      information: {
        image: ImagesBase64Enum.ICONE_INFO,
        title: 'Simulation à titre d’information',
        text: 'aucune valeur contractuelle'
      }
    };
  }


  private addTableInformations(content: Array<any>): any {
    let body = new Array<Array<Array<Cell>>>();
    body.push(this.createRow1());
    body.push(this.createEmptyRow());
    body.push(this.createRow2());
    content.push(this.createTableElement(body));
  }

  private createTableElement(body: Array<Array<Array<Cell>>>): TableElement {
    const tableElement = new TableElement();
    tableElement.style = 'tableStyle6';
    tableElement.layout = 'noBorders';

    const table = new Table();
    table.widths = ['auto', '*', 'auto', '*'];
    table.body = body;
    tableElement.table = table;

    return tableElement;
  }

  private createRow1() {
    const row = new Array<Array<Cell>>();

    row.push(this.createColImage(this.informationData.localisation.image));
    row.push(this.createColText(this.informationData.localisation.title, this.informationData.localisation.text));

    row.push(this.createColImage(this.informationData.calendrier.image));
    row.push(this.createColText(this.informationData.calendrier.title, this.informationData.calendrier.text));

    return row;
  }

  private createEmptyRow() {
    const row = new Array<Array<Cell>>();

    const col = Array<Cell>();
    const cell = new Cell();
    cell.text = new Text();
    cell.text.text = ' ';
    col.push(cell);

    row.push(col);
    row.push(col);
    row.push(col);
    row.push(col);

    return row;
  }

  private createRow2() {
    const row = new Array<Array<Cell>>();

    row.push(this.createColImage(this.informationData.euro.image));
    row.push(this.createColText(this.informationData.euro.title, this.informationData.euro.text));

    row.push(this.createColImage(this.informationData.information.image));
    row.push(this.createColText(this.informationData.information.title, this.informationData.information.text));

    return row;
  }

  private createColImage(image: string) {
    const col = new Array<Cell>();
    const cell = new Cell();
    cell.image = `data:image/png;base64,${image}`;
    cell.width = 23;
    cell.height = 23;
    col.push(cell);
    return col;
  }

  private createColText(title: string, text: string) {
    const col = new Array<any>();

    const titleCell = new Text();
    titleCell.text = title;
    const titleStyle = new Style();
    titleStyle.color = '#FF5950';
    titleStyle.fontSize = 14;
    titleCell.style = titleStyle;

    const textCell = new Text();
    textCell.text = text;
    const textStyle = new Style();
    textStyle.color = '#737679';
    textStyle.fontSize = 12;
    textCell.style = textStyle;

    col.push(titleCell);
    col.push(textCell);

    return col;
  }

  private addSeparator(content: Array<any>): any {
    const figure = new Figure(new Array<any>());
    const rectangle = new Rectangle(
      0,
      0,
      515,
      0.25,
      5,
      '#D8D8D8'
    );
    figure.canvas.push(rectangle);
    content.push(figure);
  }
}