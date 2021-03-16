
import { Injectable } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { SimulationAidesSociales } from '@models/simulation-aides-sociales';
import { DeConnecteRessourcesFinancieresService } from '../../demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { DeConnecteSimulationAidesSocialesService } from "../../demandeur-emploi-connecte/de-connecte-simulation-aides-sociales.service";
import { AidesService } from '../../utile/aides.service';
import { DateUtileService } from '../../utile/date-util.service';
import { Style } from '../models/style';
import { Cell } from '../models/table/cell';
import { LayoutTable } from '../models/table/layout-table';
import { Table } from '../models/table/table';
import { TableElement } from '../models/table/table-element';
import { Text } from '../models/text';
import { ImagesBase64Enum } from "@app/commun/enumerations/images-base64.enum";

@Injectable({ providedIn: 'root' })
export class BlockRessourcesEstimeesService {

  constructor(
    private aidesService: AidesService,
    private dateUtileService: DateUtileService,
    private deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    private deConnecteSimulationAidesSocialesService: DeConnecteSimulationAidesSocialesService
  ) {

  }

  public addElementTableMesRessourcesEstimees(content: Array<any>, demandeurEmploi: DemandeurEmploi, simulationAidesSociales: SimulationAidesSociales): void {
    this.addTableMesRessourcesEstimees(content, simulationAidesSociales);
    this.addTableMesRessourcesEtAidesActuelles(content, demandeurEmploi, simulationAidesSociales);
    if(this.aidesService.hasAidesObtenirSimulationAidesSociales(simulationAidesSociales)) {
      this.addTablAidesObtenir(content, simulationAidesSociales);
    }
  }


  /******* méthode création table "Les aides que vous pourriez obtenir" */

  public addTablAidesObtenir(content: Array<any>, simulationAidesSociales: SimulationAidesSociales): void {
    let body = new Array<Array<Cell>>();

    this.addHeaderTable(body, simulationAidesSociales.simulationsMensuelles.length, 'Les aides que vous pourriez obtenir');

    if(this.aidesService.hasAide(simulationAidesSociales, CodesAidesEnum.AGEPI)) {
      const imageBase64 = ImagesBase64Enum.AGEPI;
      this.addRowAideObtenir(body, simulationAidesSociales, CodesAidesEnum.AGEPI, imageBase64);
    }
    if(this.aidesService.hasAide(simulationAidesSociales, CodesAidesEnum.AIDE_MOBILITE)) {
      const imageBase64 = ImagesBase64Enum.AIDE_MOBILITE;
      this.addRowAideObtenir(body, simulationAidesSociales, CodesAidesEnum.AIDE_MOBILITE, imageBase64);
    }
    if(this.aidesService.hasAide(simulationAidesSociales, CodesAidesEnum.PRIME_ACTIVITE)) {
      const imageBase64 = ImagesBase64Enum.PRIME_ACTIVITE;
      this.addRowAideObtenir(body, simulationAidesSociales, CodesAidesEnum.PRIME_ACTIVITE, imageBase64);
    }

    content.push(this.createTableElement(body, simulationAidesSociales.simulationsMensuelles.length));
  }

  private addRowAideObtenir(body: Array<Array<Cell>>, simulationAidesSociales: SimulationAidesSociales, codeAideToAdd: string, imageAideBase64: string): void {
    const row = new Array<Cell>();
    row.push(this.createCellImageRessource(imageAideBase64));
    //création des cellules pour chaque simulation mensuelle
    simulationAidesSociales.simulationsMensuelles.forEach(simulationMensuelle => {
      let montant = 0;
      for (let [codeAide, aide] of Object.entries(simulationMensuelle.mesAides)) {
        if(aide && codeAide === codeAideToAdd) {
          montant = aide.montant;
        }
      }
      row.push(this.createCellMontant(montant));
    });
    body.push(row);
  }


  /************** méthode création table "Mes ressources et aides actuelles"  *****************/

  public addTableMesRessourcesEtAidesActuelles(content: Array<any>, demandeurEmploi: DemandeurEmploi, simulationAidesSociales: SimulationAidesSociales): void {

    let body = new Array<Array<Cell>>();

    this.addHeaderTable(body, simulationAidesSociales.simulationsMensuelles.length, 'Mes ressources et aides actuelles');

    this.addRowPaie(body, demandeurEmploi, simulationAidesSociales);
    if(demandeurEmploi.beneficiaireAidesSociales.beneficiaireASS) {
      this.addRowASS(body, simulationAidesSociales);
    }
    if(demandeurEmploi.beneficiaireAidesSociales.beneficiaireRSA) {
      this.addRowRSA(body, simulationAidesSociales);
    }
    if(demandeurEmploi.beneficiaireAidesSociales.beneficiaireAAH) {
      this.addRowAAHPourBeneficiaireAAH(body, simulationAidesSociales);
    }
    if(demandeurEmploi.ressourcesFinancieres.allocationsCAF) {
      if(!demandeurEmploi.beneficiaireAidesSociales.beneficiaireAAH
        && demandeurEmploi.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH > 0) {
        this.addRowAAH(body, demandeurEmploi, simulationAidesSociales);
      }
    }
    if(demandeurEmploi.beneficiaireAidesSociales.beneficiairePensionInvalidite) {
      this.addRowPensionInvalidite(body, demandeurEmploi, simulationAidesSociales);
    }
    if(demandeurEmploi.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0) {
      this.addRowIMMO(body, simulationAidesSociales);
    }
    if(demandeurEmploi.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois > 0) {
      this.addRowINDP(body, simulationAidesSociales);
    }

    content.push(this.createTableElement(body, simulationAidesSociales.simulationsMensuelles.length));
  }

  private addRowPaie(body: Array<Array<Cell>>, demandeurEmploi: DemandeurEmploi, simulationAidesSociales: SimulationAidesSociales): void {
    const montant = demandeurEmploi.futurTravail.salaireMensuelNet;
    const imageBase64 = ImagesBase64Enum.PAIE;
    const row = this.createRowMontant(body, montant , imageBase64, simulationAidesSociales.simulationsMensuelles.length);
    body.push(row);
  }

  private addRowASS(body: Array<Array<Cell>>, simulationAidesSociales: SimulationAidesSociales): void {
    const row = new Array<Cell>();
    const imageBase64 = ImagesBase64Enum.ALLOCATION_SOLIDARITE_SPECIFIQUE;
    row.push(this.createCellImageRessource(imageBase64));
    //création des cellules pour chaque simulation mensuelle
    simulationAidesSociales.simulationsMensuelles.forEach(simulationMensuelle => {
      const montantAss = this.aidesService.getMontantASS(simulationMensuelle);
      row.push(this.createCellMontant(montantAss));
    });
    body.push(row);
  }

  private addRowRSA(body: Array<Array<Cell>>, simulationAidesSociales: SimulationAidesSociales): void {
    const row = new Array<Cell>();
    const imageBase64 = ImagesBase64Enum.RSA;
    row.push(this.createCellImageRessource(imageBase64));
    //création des cellules pour chaque simulation mensuelle
    simulationAidesSociales.simulationsMensuelles.forEach(simulationMensuelle => {
      const montantRSA = this.aidesService.getMontantRSA(simulationMensuelle);
      row.push(this.createCellMontant(montantRSA));
    });
    body.push(row);
  }

  private addRowAAH(body: Array<Array<Cell>>, demandeurEmploi: DemandeurEmploi, simulationAidesSociales: SimulationAidesSociales): void {
    const imageBase64 = ImagesBase64Enum.ALLOCATION_ADULTES_HANDICAPES;
    const montant = demandeurEmploi.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH;
    const row = this.createRowMontant(body, montant, imageBase64, simulationAidesSociales.simulationsMensuelles.length);
    body.push(row);
  }

  private addRowAAHPourBeneficiaireAAH(body: Array<Array<Cell>>, simulationAidesSociales: SimulationAidesSociales): void {
    const row = new Array<Cell>();
    const imageBase64 = ImagesBase64Enum.ALLOCATION_ADULTES_HANDICAPES;
    row.push(this.createCellImageRessource(imageBase64));
    //création des cellules pour chaque simulation mensuelle
    simulationAidesSociales.simulationsMensuelles.forEach(simulationMensuelle => {
      const montantAah = this.aidesService.getMontantAAH(simulationMensuelle);
      row.push(this.createCellMontant(montantAah));
    });
    body.push(row);
  }

  private addRowPensionInvalidite(body: Array<Array<Cell>>, demandeurEmploi: DemandeurEmploi, simulationAidesSociales: SimulationAidesSociales): void {
    const imageBase64 = ImagesBase64Enum.PENSION_INVALIDITE;
    const montant = demandeurEmploi.ressourcesFinancieres.allocationsCPAM.pensionInvalidite;
    const row = this.createRowMontant(body, montant, imageBase64, simulationAidesSociales.simulationsMensuelles.length);
    body.push(row);
  }



  private addRowIMMO(body: Array<Array<Cell>>, simulationAidesSociales: SimulationAidesSociales): void {
    const montant = this.deConnecteRessourcesFinancieresService.getRevenusImmobilierSur1Mois();
    const imageBase64 = ImagesBase64Enum.IMMOBILIER;
    const row = this.createRowMontant(body, montant, imageBase64, simulationAidesSociales.simulationsMensuelles.length);
    body.push(row);
  }

  private addRowINDP(body: Array<Array<Cell>>, simulationAidesSociales: SimulationAidesSociales): void {
    const montant = this.deConnecteRessourcesFinancieresService.getRevenusTravailleurIndependantSur1Mois();
    const imageBase64 = ImagesBase64Enum.TRAVAILLEUR_INDEPENDANT;
    const row = this.createRowMontant(body, montant, imageBase64, simulationAidesSociales.simulationsMensuelles.length);
    body.push(row);
  }


  /************** méthode création table "Mes ressources estimees"  *****************/

  public addTableMesRessourcesEstimees(content: Array<any>, simulationAidesSociales: SimulationAidesSociales): void {
    let body = new Array<Array<Cell>>();
    this.addHeaderTableMesRessourcesEstimees(body, simulationAidesSociales);
    this.addRowMontantTotalSimulationMensuelle(body, simulationAidesSociales, simulationAidesSociales.simulationsMensuelles.length);
    content.push(this.createTableElementMesRessourcesEstimees(body, simulationAidesSociales.simulationsMensuelles.length));
  }

  private addHeaderTableMesRessourcesEstimees(body: Array<Array<Cell>>, simulationAidesSociales: SimulationAidesSociales): void {
    const nbrMoisSimule = simulationAidesSociales.simulationsMensuelles.length;
    const row = new Array<Cell>();

    //add cellule1
    row.push(this.addTitleMesRessourcesEstimees('\n Avant reprise', '#D6D9E4', 1, 'center'));
    //add cellule2
    const titleCell2 = '\nDétail des ressources estimées après reprise d’emploi pour les ' + nbrMoisSimule + ' mois à venir';
    row.push(this.addTitleMesRessourcesEstimees(titleCell2, '#DEEEFF', 6, 'left'));
    //add cellules vides pour obtenir un nombre de colonnes = nbrMoisSimule + 1
    for (let i = 0; i < nbrMoisSimule - 1; i++) {
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

  private addRowMontantTotalSimulationMensuelle(body: Array<Array<Cell>>, simulationAidesSociales: SimulationAidesSociales, nbrColumns: number): void {
    const row = new Array<Cell>();

    //add cellule montant total ressources actuelles

    const montantTotalRessourcesActuelles = simulationAidesSociales.montantRessourcesFinancieresMoisAvantSimulation;
    row.push(this.createCellMontantTotalSimulationMensuelle('Revenus & Aides', montantTotalRessourcesActuelles));
    //add des cellules pour chaque simulation mensuelle
    simulationAidesSociales.simulationsMensuelles.forEach(simulationMensuelle => {
      const libelleDate = this.dateUtileService.getLibelleDateStringFormatCourt(simulationMensuelle.datePremierJourMoisSimule);
      const montantTotal = this.deConnecteSimulationAidesSocialesService.calculerMontantTotalRessourcesMois(simulationMensuelle);
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
    text1.style.color = '#3853B9';
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
    layoutTable.hLineColor = '#DEEEFF';
    layoutTable.vLineColor = '#DEEEFF';
    tableElement.layout = layoutTable;
    tableElement.style = 'tableStyle3';
    tableElement.table = new Table();
    tableElement.table.body = body;
    tableElement.table.heights = [40, 35];
    tableElement.table.widths = this.getWithsColumns(nbrColumns);
    return tableElement;
  }

  /*********** méthode communes ********************/

  private addHeaderTable(body: Array<Array<Cell>>, nbrMoisSimule: number, title: string): void {
    const row = new Array<Cell>();
    row.push(this.createCellTitle('', '#DEEEFF', 1));
    row.push(this.createCellTitle(title, '#DEEEFF', 6));
    //on ajoute des cellules vides pour obtenir un nombre de colonnes = nbrMoisSimule + 1
    for (let i = 0; i < nbrMoisSimule - 1; i++) {
      row.push(new Cell());
    }
    body.push(row);
  }

  private createRowMontant(body: Array<Array<Cell>>, montant: number, imageBase64: string, nbrMoisSimule :number):  Array<Cell> {
    const row = new Array<Cell>();
    row.push(this.createCellImageRessource(imageBase64));
    //création des cellules pour chaque simulation mensuelle
    for (let i = 0; i < nbrMoisSimule; i++) {
      row.push(this.createCellMontant(montant));
    }
    return row;
  }

  private createTableElement(body: Array<Array<Cell>>, nbrColumns: number): TableElement {
    const tableElement = new TableElement();
    const layoutTable = new LayoutTable();
    layoutTable.hLineColor = '#DEEEFF';
    layoutTable.vLineColor = 'white';
    tableElement.layout = layoutTable;
    tableElement.style = 'tableStyle4';
    tableElement.table = new Table();
    tableElement.table.body = body;
    tableElement.table.widths = this.getWithsColumns(nbrColumns);
    return tableElement;
  }


  private createCellImageRessource(imageBase64: string): Cell {
    const cell = new Cell();
    cell.image = 'data:image/png;base64,' + imageBase64;
    cell.width = 40;
    cell.height = 40;
    cell.style = new Style();
    cell.style.alignment = 'center';
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
    cell.style.color = '#1B2B67';
    cell.style.fontSize = 11;
    cell.text = title;
    return cell;
  }


  private getWithsColumns(nbrColumns: number): Array<number> {
    const widthMaxTable = 350;
    const widthColumn = widthMaxTable / nbrColumns;
    const widthsColumns = [100];
    for (let i = 0; i < nbrColumns; i++) {
      widthsColumns.push(widthColumn);
    }
    return widthsColumns;
  }

}