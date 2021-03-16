
import { Injectable } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { AideSociale } from '@app/commun/models/aide-sociale';
import { SimulationAidesSociales } from '@app/commun/models/simulation-aides-sociales';
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

  public addPagesDetailAides(content: Array<any>, simulationAidesSociales: SimulationAidesSociales): void {
    if(this.aidesService.hasAide(simulationAidesSociales, CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE)) {
      this.addAideASS(content, simulationAidesSociales);
    }
    if (this.aidesService.hasAide(simulationAidesSociales, CodesAidesEnum.AGEPI)) {
      this.addAideAGEPI(content, simulationAidesSociales);
    }
    if(this.aidesService.hasAide(simulationAidesSociales, CodesAidesEnum.AIDE_MOBILITE)) {
      this.addAideMobilite(content, simulationAidesSociales);
    }
    if(this.aidesService.hasAide(simulationAidesSociales, CodesAidesEnum.PRIME_ACTIVITE)) {
      this.addPrimeActivite(content, simulationAidesSociales);
    }
    if(this.aidesService.hasAide(simulationAidesSociales, CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES)) {
      this.addAideAAH(content, simulationAidesSociales);
    }
  }

  private addAideASS(content: Array<any>, simulationAidesSociales: SimulationAidesSociales): void {
    this.addPageBreak(content);
    const aide = this.aidesService.getAideByCode(simulationAidesSociales, CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
    const imageBase64 = ImagesBase64Enum.ALLOCATION_SOLIDARITE_SPECIFIQUE;
    this.addTableTitle(content, aide, imageBase64, '#F8CF8D');
    this.addContentAideASS(content, aide);
  }

  private addAideAGEPI(content: Array<any>, simulationAidesSociales: SimulationAidesSociales): void {
    this.addPageBreak(content);
    const aide = this.aidesService.getAideByCode(simulationAidesSociales, CodesAidesEnum.AGEPI);
    const imageBase64 = ImagesBase64Enum.AGEPI;
    this.addTableTitle(content, aide, imageBase64, '#FFC6FF');
    this.addContentAideAGEPI(content, aide);
  }

  private addAideMobilite(content: Array<any>, simulationAidesSociales: SimulationAidesSociales): void {
    this.addPageBreak(content);
    const aide = this.aidesService.getAideByCode(simulationAidesSociales, CodesAidesEnum.AIDE_MOBILITE);
    const imageBase64 = ImagesBase64Enum.AIDE_MOBILITE;
    this.addTableTitle(content, aide, imageBase64, '#F1A378');
    this.addContentAideMobilite(content, aide);
  }

  private addPrimeActivite(content: Array<any>, simulationAidesSociales: SimulationAidesSociales): void {
    this.addPageBreak(content);
    const aide = this.aidesService.getAideByCode(simulationAidesSociales, CodesAidesEnum.PRIME_ACTIVITE);
    const imageBase64 = ImagesBase64Enum.PRIME_ACTIVITE;
    this.addTableTitle(content, aide, imageBase64, '#BDB2FF');
    this.addContentPrimeActivite(content, aide);
  }

  private addAideAAH(content: Array<any>, simulationAidesSociales: SimulationAidesSociales): void {
    this.addPageBreak(content);
    const aide = this.aidesService.getAideByCode(simulationAidesSociales, CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES);
    const imageBase64 = ImagesBase64Enum.ALLOCATION_ADULTES_HANDICAPES;
    this.addTableTitle(content, aide, imageBase64, '#C7F0BD');
    this.addContentAideAAH(content, aide);
  }

  private addTableTitle(content: Array<any>, aideSociale: AideSociale, imageBase64: string, colorLineTitle: string): void {
    let body = new Array<Array<Cell>>();
    const row = new Array<Cell>();
    row.push(this.createCell1(imageBase64));
    row.push(this.createCell2(aideSociale));
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

  private createCell2(aideSociale: AideSociale): Cell {
    const cell = new Cell();
    cell.text = `\n${aideSociale.nom} (${aideSociale.organisme})`;

    const style = new Style();
    style.color = '#23333C';
    style.fontSize = 16;
    style.bold = true;
    cell.style = style;


    return cell;
  }

  private addContentAideAAH(content: Array<any>, aideAAH: AideSociale): void {
    const contentDetailAide = htmlToPdfmake(aideAAH.detail);
    content.push(contentDetailAide);
  }

  private addContentAideAGEPI(content: Array<any>, aideAGEPI: AideSociale): void {
    const contentDetailAide = htmlToPdfmake(aideAGEPI.detail);
    contentDetailAide[1].text = '\n' + contentDetailAide[1].text + '\n';
    contentDetailAide[3].text = '\n' + contentDetailAide[3].text + '\n';
    contentDetailAide[5].text = '\n' + contentDetailAide[5].text + '\n';
    content.push(contentDetailAide);
  }

  private addContentAideASS(content: Array<any>, aideASS: AideSociale): void {
    const contentDetailAide = htmlToPdfmake(aideASS.detail);
    content.push(contentDetailAide);
  }



  private addContentAideMobilite(content: Array<any>, aideAGEPI: AideSociale): void {
    const contentDetailAide = htmlToPdfmake(aideAGEPI.detail);
    contentDetailAide[1].text = '\n' + contentDetailAide[1].text + '\n';
    contentDetailAide[3].text = '\n' + contentDetailAide[3].text + '\n';
    contentDetailAide[5].text = '\n' + contentDetailAide[5].text + '\n';
    contentDetailAide[8].text = '\n' + contentDetailAide[8].text + '\n';
    contentDetailAide[10].text = '\n' + contentDetailAide[10].text + '\n';
    content.push(contentDetailAide);
  }

  private addContentPrimeActivite(content: Array<any>, aideAGEPI: AideSociale): void {
    const contentDetailAide = htmlToPdfmake(aideAGEPI.detail);
    contentDetailAide[1].text = '\n' + contentDetailAide[1].text + '\n';
    contentDetailAide[3].text = '\n' + contentDetailAide[3].text + '\n';
    contentDetailAide[7].text = '\n' + contentDetailAide[7].text + '\n';
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