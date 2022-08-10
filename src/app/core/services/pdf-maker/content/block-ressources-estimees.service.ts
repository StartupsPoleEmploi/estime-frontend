
import { Injectable } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { Simulation } from '@app/commun/models/simulation';
import { AidesService } from '../../utile/aides.service';
import { DateUtileService } from '../../utile/date-util.service';
import { Style } from '../models/style';
import { Cell } from '../models/table/cell';
import { LayoutTable } from '../models/table/layout-table';
import { Table } from '../models/table/table';
import { TableElement } from '../models/table/table-element';
import { Text } from '../models/text';
import { ImagesBase64Enum } from "@app/commun/enumerations/images-base64.enum";
import { LibellesAidesEnum } from '@app/commun/enumerations/libelles-aides.enum';
import { SimulationService } from '../../utile/simulation.service';
import { RessourcesFinancieresService } from '../../utile/ressources-financieres.service';

@Injectable({ providedIn: 'root' })
export class BlockRessourcesEstimeesService {

  constructor(
    private aidesService: AidesService,
    private dateUtileService: DateUtileService,
    private ressourcesFinancieresService: RessourcesFinancieresService,
    private simulationService: SimulationService
  ) {

  }

  public addElementTableMesRessourcesEstimees(content: Array<any>, simulation: Simulation): void {
    this.addTableMesRessourcesEstimees(content, simulation);
    this.addTableMesRessourcesEtAides(content, simulation);
  }

  /************** méthode création table "Mes futures ressources et aides"  *****************/

  public addTableMesRessourcesEtAides(content: Array<any>, simulation: Simulation): void {

    let body = new Array<Array<Cell>>();
    let nbrRows = 2;

    this.addHeaderTable(body, simulation.simulationsMensuelles.length, 'Mes futures ressources et aides');
    this.addRowPaie(body, simulation);
    nbrRows += this.addTableAidesPoleEmploi(body, simulation);
    nbrRows += this.addTableAidesCAF(body, simulation);
    nbrRows += this.addTableAidesCPAM(body, simulation);
    nbrRows += this.addTableRevenus(body, simulation);

    content.push(this.createTableElement(body, simulation.simulationsMensuelles.length, nbrRows));
  }

  public addTableAidesPoleEmploi(body: Array<Array<Cell>>, simulation: Simulation): number {
    let nbrRows = 0;
    if (this.aidesService.hasAide(simulation, CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE)) {
      this.addRowAide(body, simulation, CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE, LibellesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE, ImagesBase64Enum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
      nbrRows++;
    }
    if (this.aidesService.hasAide(simulation, CodesAidesEnum.AIDE_RETOUR_EMPLOI)) {
      this.addRowAide(body, simulation, CodesAidesEnum.AIDE_RETOUR_EMPLOI, LibellesAidesEnum.AIDE_RETOUR_EMPLOI, ImagesBase64Enum.AIDE_RETOUR_EMPLOI);

      nbrRows++;
    }
    return nbrRows;
  }

  public addTableAidesCAF(body: Array<Array<Cell>>, simulation: Simulation): number {
    let nbrRows = 0;
    if (this.aidesService.hasAide(simulation, CodesAidesEnum.RSA)) {
      this.addRowAide(body, simulation, CodesAidesEnum.RSA, LibellesAidesEnum.RSA, ImagesBase64Enum.RSA);
      nbrRows++;
    }
    if (this.aidesService.hasAide(simulation, CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES)) {
      this.addRowAide(body, simulation, CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES, LibellesAidesEnum.ALLOCATION_ADULTES_HANDICAPES, ImagesBase64Enum.ALLOCATION_ADULTES_HANDICAPES);
      nbrRows++;
    }
    if (this.aidesService.hasAide(simulation, CodesAidesEnum.ALLOCATION_SOUTIEN_FAMILIAL)) {
      this.addRowAide(body, simulation, CodesAidesEnum.ALLOCATION_SOUTIEN_FAMILIAL, LibellesAidesEnum.ALLOCATION_SOUTIEN_FAMILIAL, ImagesBase64Enum.ALLOCATION_SOUTIEN_FAMILIAL);
      nbrRows++;
    }
    if (this.aidesService.hasAide(simulation, CodesAidesEnum.ALLOCATIONS_FAMILIALES)) {
      this.addRowAide(body, simulation, CodesAidesEnum.ALLOCATIONS_FAMILIALES, LibellesAidesEnum.ALLOCATIONS_FAMILIALES, ImagesBase64Enum.ALLOCATIONS_FAMILIALES);
      nbrRows++;
    }
    if (this.aidesService.hasAide(simulation, CodesAidesEnum.COMPLEMENT_FAMILIAL)) {
      this.addRowAide(body, simulation, CodesAidesEnum.COMPLEMENT_FAMILIAL, LibellesAidesEnum.COMPLEMENT_FAMILIAL, ImagesBase64Enum.COMPLEMENT_FAMILIAL);
      nbrRows++;
    }
    if (this.aidesService.hasAide(simulation, CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT)) {
      this.addRowAide(body, simulation, CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT, LibellesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT, ImagesBase64Enum.AIDE_PERSONNALISEE_LOGEMENT);
      nbrRows++;
    }
    if (this.aidesService.hasAide(simulation, CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE)) {
      this.addRowAide(body, simulation, CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, LibellesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, ImagesBase64Enum.ALLOCATION_LOGEMENT_FAMILIALE);
      nbrRows++;
    }
    if (this.aidesService.hasAide(simulation, CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE)) {
      this.addRowAide(body, simulation, CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, LibellesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, ImagesBase64Enum.ALLOCATION_LOGEMENT_SOCIALE);
      nbrRows++;
    }
    if (this.aidesService.hasAide(simulation, CodesAidesEnum.PRESTATION_ACCUEIL_JEUNE_ENFANT)) {
      this.addRowAide(body, simulation, CodesAidesEnum.PRESTATION_ACCUEIL_JEUNE_ENFANT, LibellesAidesEnum.PRESTATION_ACCUEIL_JEUNE_ENFANT, ImagesBase64Enum.PRESTATION_ACCUEIL_JEUNE_ENFANT);
      nbrRows++;
    }
    if (this.aidesService.hasAide(simulation, CodesAidesEnum.PENSIONS_ALIMENTAIRES)) {
      this.addRowAide(body, simulation, CodesAidesEnum.PENSIONS_ALIMENTAIRES, LibellesAidesEnum.PENSIONS_ALIMENTAIRES, ImagesBase64Enum.PENSIONS_ALIMENTAIRES);
      nbrRows++;
    }
    if (this.aidesService.hasAide(simulation, CodesAidesEnum.PRIME_ACTIVITE)) {
      this.addRowAide(body, simulation, CodesAidesEnum.PRIME_ACTIVITE, '\n' + LibellesAidesEnum.PRIME_ACTIVITE, ImagesBase64Enum.PRIME_ACTIVITE);
      nbrRows++;
    }
    return nbrRows;
  }

  public addTableAidesCPAM(body: Array<Array<Cell>>, simulation: Simulation): number {
    let nbrRows = 0;
    if (this.aidesService.hasAide(simulation, CodesAidesEnum.PENSION_INVALIDITE)) {
      this.addRowAide(body, simulation, CodesAidesEnum.PENSION_INVALIDITE, LibellesAidesEnum.PENSION_INVALIDITE, ImagesBase64Enum.PENSION_INVALIDITE);
      nbrRows++;
    }
    return nbrRows;
  }

  public addTableRevenus(body: Array<Array<Cell>>, simulation: Simulation): number {
    let nbrRows = 0;
    if (this.ressourcesFinancieresService.hasRessourceFinanciere(simulation, CodesAidesEnum.IMMOBILIER)) {
      this.addRowRessourceFinanciere(body, simulation, CodesAidesEnum.IMMOBILIER, LibellesAidesEnum.IMMOBILIER, ImagesBase64Enum.IMMOBILIER);
      nbrRows++;
    }
    if (this.ressourcesFinancieresService.hasRessourceFinanciere(simulation, CodesAidesEnum.MICRO_ENTREPRENEUR)) {
      this.addRowRessourceFinanciere(body, simulation, CodesAidesEnum.MICRO_ENTREPRENEUR, LibellesAidesEnum.MICRO_ENTREPRENEUR, ImagesBase64Enum.MICRO_ENTREPRENEUR);
      nbrRows++;
    }
    if (this.ressourcesFinancieresService.hasRessourceFinanciere(simulation, CodesAidesEnum.TRAVAILLEUR_INDEPENDANT)) {
      this.addRowRessourceFinanciere(body, simulation, CodesAidesEnum.TRAVAILLEUR_INDEPENDANT, LibellesAidesEnum.TRAVAILLEUR_INDEPENDANT, ImagesBase64Enum.TRAVAILLEUR_INDEPENDANT);
      nbrRows++;
    }
    return nbrRows;
  }

  private addRowPaie(body: Array<Array<Cell>>, simulation: Simulation): void {
    this.addRowRessourceFinanciere(body, simulation, CodesAidesEnum.SALAIRE, '\n' + LibellesAidesEnum.SALAIRE, ImagesBase64Enum.SALAIRE);
  }

  private addRowAide(body: Array<Array<Cell>>, simulation: Simulation, code: string, libelle: string, imageBase64: string) {
    const row = new Array<Cell>();
    row.push(this.createCellImageRessource(imageBase64));
    row.push(this.createCellLibelleRessource(libelle));
    //création des cellules pour chaque simulation mensuelle
    simulation.simulationsMensuelles.forEach(simulationMensuelle => {
      const montant = this.aidesService.getMontantAideByCode(simulationMensuelle, code);
      row.push(this.createCellMontant(montant));
    });
    body.push(row);
  }

  private addRowRessourceFinanciere(body: Array<Array<Cell>>, simulation: Simulation, code: string, libelle: string, imageBase64: string) {
    const row = new Array<Cell>();
    row.push(this.createCellImageRessource(imageBase64));
    row.push(this.createCellLibelleRessource(libelle));
    //création des cellules pour chaque simulation mensuelle
    simulation.simulationsMensuelles.forEach(simulationMensuelle => {
      const montantPAF = this.ressourcesFinancieresService.getMontantRessourceFinanciereByCode(simulationMensuelle, code);
      row.push(this.createCellMontant(montantPAF));
    });
    body.push(row);
  }

  public addTableMesRessourcesEstimees(content: Array<any>, simulation: Simulation): void {
    let body = new Array<Array<Cell>>();
    this.addHeaderTableMesRessourcesEstimees(body, simulation);
    this.addRowMontantTotalSimulationMensuelle(body, simulation);
    content.push(this.createTableElementMesRessourcesEstimees(body, simulation.simulationsMensuelles.length));
  }

  private addHeaderTableMesRessourcesEstimees(body: Array<Array<Cell>>, simulation: Simulation): void {
    const nbrMoisSimule = simulation.simulationsMensuelles.length;
    const row = new Array<Cell>();

    //add cellule1
    const titleCell2 = '\nDétail des ressources estimées après reprise d’emploi pour les ' + nbrMoisSimule + ' mois à venir';
    row.push(this.addTitleMesRessourcesEstimees(titleCell2, '#E6E7E8', nbrMoisSimule + 2, 'left'));
    //add cellules vides pour obtenir un nombre de colonnes = nbrMoisSimule + 2
    for (let i = 0; i < nbrMoisSimule + 1; i++) {
      row.push(new Cell());
    }
    body.push(row);
  }

  private addTitleMesRessourcesEstimees(titleCell2: string, fillColor: string, colspan: number, alignment: string): Cell {
    const cell = new Cell();
    cell.colSpan = colspan;
    cell.fillColor = fillColor;
    cell.style = new Style();
    cell.style.alignment = alignment;
    cell.style.background = fillColor;
    cell.style.bold = true;
    cell.style.color = '#23333C';
    cell.style.fontSize = 12;
    cell.text = titleCell2;
    return cell;
  }
  private addRowMontantTotalSimulationMensuelle(body: Array<Array<Cell>>, simulation: Simulation): void {
    const row = new Array<Cell>();
    row.push(this.createCellTitle(' ', '#FFFFFF', 2));
    row.push(new Cell());
    //add des cellules pour chaque simulation mensuelle
    simulation.simulationsMensuelles.forEach(simulationMensuelle => {
      const libelleDate = this.dateUtileService.getLibelleDateStringFormatCourt(simulationMensuelle.datePremierJourMoisSimule);
      const montantTotal = this.simulationService.calculerMontantTotalRessourcesMois(simulationMensuelle);
      row.push(this.createCellMontantTotalSimulationMensuelle(libelleDate, montantTotal));
    });

    body.push(row);
  }

  private createCellMontantTotalSimulationMensuelle(libelle: string, montantTotal: number): Cell {
    const cell = new Cell();
    cell.text = new Array<any>();
    this.addLibelleDateSimulationMensuelle(cell.text, libelle);
    this.addMontantTotalSimulationMensuelle(cell.text, montantTotal);
    return cell;
  }

  private addLibelleDateSimulationMensuelle(contenu: Array<any>, libelle: string): void {
    const text1 = new Text();
    text1.text = libelle + '\n';
    text1.style = new Style();
    text1.style.alignment = 'center';
    text1.style.bold = true;
    text1.style.color = '#FF5950';
    text1.style.fontSize = 10;
    contenu.push(text1);
  }

  private addMontantTotalSimulationMensuelle(contenu: Array<any>, montant: number): void {
    const text1 = new Text();
    text1.text = montant + ' €';
    text1.style = new Style();
    text1.style.alignment = 'center';
    text1.style.bold = true;
    text1.style.fontSize = 13;
    contenu.push(text1);
  }

  private createTableElementMesRessourcesEstimees(body: Array<Array<Cell>>, nbrColumns: number): TableElement {
    const tableElement = new TableElement();
    const layoutTable = new LayoutTable();
    layoutTable.hLineColor = '#E6E7E8';
    layoutTable.vLineColor = '#E6E7E8';
    tableElement.layout = layoutTable;
    tableElement.style = 'tableStyle3';
    tableElement.table = new Table();
    tableElement.table.body = body;
    tableElement.table.heights = [40, 35];
    tableElement.table.widths = this.getWidthsColumns(nbrColumns);
    return tableElement;
  }

  /*********** méthode communes ********************/

  private addHeaderTable(body: Array<Array<Cell>>, nbrMoisSimule: number, title: string): void {
    const row = new Array<Cell>();
    row.push(this.createCellTitle(title, '#E6E7E8', nbrMoisSimule + 2));
    //on ajoute des cellules vides pour obtenir un nombre de colonnes = nbrMoisSimule + 2
    for (let i = 0; i < nbrMoisSimule + 1; i++) {
      row.push(new Cell());
    }
    body.push(row);
  }

  private createTableElement(body: Array<Array<Cell>>, nbrColumns: number, nbrRows: number): TableElement {
    const tableElement = new TableElement();
    const layoutTable = new LayoutTable();
    layoutTable.hLineColor = '#E6E7E8';
    layoutTable.vLineColor = 'white';
    tableElement.layout = layoutTable;
    tableElement.style = 'tableStyle4';
    tableElement.table = new Table();
    tableElement.table.body = body;
    tableElement.table.heights = this.getHeightsRows(nbrRows);
    tableElement.table.widths = this.getWidthsColumns(nbrColumns);
    return tableElement;
  }


  private createCellImageRessource(imageBase64: string): Cell {
    const cell = new Cell();
    cell.image = 'data:image/png;base64,' + imageBase64;
    cell.width = 30;
    cell.style = new Style();
    cell.style.alignment = 'center';
    return cell;
  }

  private createCellLibelleRessource(libelle: string): Cell {
    const cell = new Cell();
    cell.style = new Style();
    cell.style.alignment = 'left';
    cell.style.bold = true;
    cell.style.fontSize = 9;

    cell.text = new Text();
    cell.text.text = libelle;
    cell.text.style = new Style();
    cell.text.style.margin = [30, 100, 30, 30];
    return cell;
  }

  private createCellMontant(montant: number): Cell {
    const cell = new Cell();
    cell.text = '\n' + montant + ' €';
    cell.style = new Style();
    cell.style.alignment = 'center';
    cell.style.bold = true;
    return cell;
  }

  private createCellTitle(title: string, fillColor: string, colSpan: number): Cell {
    const cell = new Cell();
    cell.colSpan = colSpan;
    cell.fillColor = fillColor;
    cell.style = new Style();
    cell.style.background = fillColor;
    cell.style.color = '#E6E7E8';
    cell.style.fontSize = 11;
    cell.text = title;
    return cell;
  }


  private getWidthsColumns(nbrColumns: number): Array<number> {
    const widthMaxTable = 350;
    const widthColumn = Math.floor(widthMaxTable / nbrColumns);
    const widthsColumns = [30, 70];
    for (let i = 0; i < nbrColumns; i++) {
      widthsColumns.push(widthColumn);
    }
    return widthsColumns;
  }

  private getHeightsRows(nbrRows: number): Array<number> {
    const heightRow = 35;
    const heightRows = [15];
    for (let i = 0; i < nbrRows; i++) {
      heightRows.push(heightRow);
    }
    return heightRows;
  }
}