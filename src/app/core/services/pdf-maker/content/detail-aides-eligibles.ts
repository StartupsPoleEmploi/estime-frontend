
import { Injectable } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { Aide } from '@app/commun/models/aide';
import { SimulationAides } from '@app/commun/models/simulation-aides';
import { AidesService } from '../../utile/aides.service';
import { Style } from '../models/style';
import { Cell } from '../models/table/cell';
import { Table } from '../models/table/table';
import { TableElement } from '../models/table/table-element';
import htmlToPdfmake from 'html-to-pdfmake';
import { Text } from '../models/text';
import { Figure } from '../models/figure/figure';
import { Line } from "../models/figure/elements/line";
import { ImagesBase64Enum } from "@app/commun/enumerations/images-base64.enum";

@Injectable({ providedIn: 'root' })
export class DetailAidesEligiblesService {

  constructor(
    private aidesService: AidesService
  ) {

  }

  public addPagesDetailAides(content: Array<any>, simulationAides: SimulationAides): void {
    if (this.aidesService.hasAide(simulationAides, CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE)) {
      this.addAideASS(content, simulationAides);
    }
    if (this.aidesService.hasAide(simulationAides, CodesAidesEnum.AGEPI)) {
      this.addAideAGEPI(content, simulationAides);
    }
    if (this.aidesService.hasAide(simulationAides, CodesAidesEnum.AIDE_MOBILITE)) {
      this.addAideMobilite(content, simulationAides);
    }
    if (this.aidesService.hasAide(simulationAides, CodesAidesEnum.PRIME_ACTIVITE)) {
      this.addPrimeActivite(content, simulationAides);
    }
    if (this.aidesService.hasAide(simulationAides, CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES)) {
      this.addAideAAH(content, simulationAides);
    }
  }

  private addAideASS(content: Array<any>, simulationAides: SimulationAides): void {
    this.addPageBreak(content);
    const aide = this.aidesService.getAideByCode(simulationAides, CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
    const imageBase64 = ImagesBase64Enum.ALLOCATION_SOLIDARITE_SPECIFIQUE;
    this.addTableTitle(content, aide, imageBase64, '#F8CF8D');
    this.addContentAideASS(content, aide);
  }

  private addAideAGEPI(content: Array<any>, simulationAides: SimulationAides): void {
    this.addPageBreak(content);
    const aide = this.aidesService.getAideByCode(simulationAides, CodesAidesEnum.AGEPI);
    const imageBase64 = ImagesBase64Enum.AGEPI;
    this.addTableTitle(content, aide, imageBase64, '#FFC6FF');
    this.addContentAideAGEPI(content, aide);
  }

  private addAideMobilite(content: Array<any>, simulationAides: SimulationAides): void {
    this.addPageBreak(content);
    const aide = this.aidesService.getAideByCode(simulationAides, CodesAidesEnum.AIDE_MOBILITE);
    const imageBase64 = ImagesBase64Enum.AIDE_MOBILITE;
    this.addTableTitle(content, aide, imageBase64, '#F1A378');
    this.addContentAideMobilite(content, aide);
  }

  private addPrimeActivite(content: Array<any>, simulationAides: SimulationAides): void {
    this.addPageBreak(content);
    const aide = this.aidesService.getAideByCode(simulationAides, CodesAidesEnum.PRIME_ACTIVITE);
    const imageBase64 = ImagesBase64Enum.PRIME_ACTIVITE;
    this.addTableTitle(content, aide, imageBase64, '#BDB2FF');
    this.addContentPrimeActivite(content, aide);
  }

  private addAideAAH(content: Array<any>, simulationAides: SimulationAides): void {
    this.addPageBreak(content);
    const aide = this.aidesService.getAideByCode(simulationAides, CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES);
    const imageBase64 = ImagesBase64Enum.ALLOCATION_ADULTES_HANDICAPES;
    this.addTableTitle(content, aide, imageBase64, '#C7F0BD');
    this.addContentAideAAH(content, aide);
  }

  private addTableTitle(content: Array<any>, aide: Aide, imageBase64: string, colorLineTitle: string): void {
    let body = new Array<Array<Cell>>();
    const row = new Array<Cell>();
    row.push(this.createCell1(imageBase64));
    row.push(this.createCell2(aide));
    body.push(row);
    content.push(this.createTableElement(body));
    this.createLineTitle(content, colorLineTitle);
  }

  private createTableElement(body: Array<Array<Cell>>): TableElement {
    const tableElement = new TableElement();
    tableElement.style = 'tableStyle2';
    tableElement.layout = 'noBorders';

    const table = new Table();
    table.widths = ['auto', '*'];
    table.body = body;
    tableElement.table = table;

    return tableElement;
  }

  private createCell1(imageBAse64: string): Cell {
    const cell = new Cell();
    cell.image = `data:image/jpeg;base64,${imageBAse64}`;
    cell.width = 60;
    cell.height = 60;
    return cell;
  }

  private createCell2(aide: Aide): Cell {
    const cell = new Cell();
    cell.text = `\n${aide.nom} (${aide.organisme})`;

    const style = new Style();
    style.color = '#23333C';
    style.fontSize = 15;
    style.bold = true;
    cell.style = style;


    return cell;
  }

  private addContentAideAAH(content: Array<any>, aideAAH: Aide): void {
    const contentDetailAide = htmlToPdfmake(aideAAH.detail);
    content.push(contentDetailAide);
  }

  private addContentAideAGEPI(content: Array<any>, aideAGEPI: Aide): void {
    const contentDetailAide = htmlToPdfmake(aideAGEPI.detail);
    content.push(contentDetailAide);
  }

  private addContentAideASS(content: Array<any>, aideASS: Aide): void {
    const contentDetailAide = htmlToPdfmake(aideASS.detail);
    content.push(contentDetailAide);
  }

  private addContentAideMobilite(content: Array<any>, aideAGEPI: Aide): void {
    const contentDetailAide = htmlToPdfmake(aideAGEPI.detail);
    content.push(contentDetailAide);
  }

  private addContentPrimeActivite(content: Array<any>, aideAGEPI: Aide): void {
    const contentDetailAide = htmlToPdfmake(aideAGEPI.detail);
    content.push(contentDetailAide);
  }

  private addPageBreak(content: Array<any>): void {
    const text = new Text();
    text.text = '';
    text.pageBreak = 'after';
    content.push(text);
  }

  private createLineTitle(content: Array<any>, colorLine: string): void {
    const figure = new Figure(new Array<any>());
    const line = new Line(
      62,
      -25,
      515,
      -25,
      5,
      colorLine

    );
    figure.canvas.push(line);
    content.push(figure);
  }

}