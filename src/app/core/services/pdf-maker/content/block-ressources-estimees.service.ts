
import { Injectable } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { SimulationAides } from '@models/simulation-aides';
import { DeConnecteRessourcesFinancieresService } from '../../demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { DeConnecteSimulationAidesService } from "../../demandeur-emploi-connecte/de-connecte-simulation-aides.service";
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
import { LibellesRessourcesFinancieresEnum } from '@app/commun/enumerations/libelles-ressources-financieres.enum';

@Injectable({ providedIn: 'root' })
export class BlockRessourcesEstimeesService {

  constructor(
    private aidesService: AidesService,
    private dateUtileService: DateUtileService,
    private deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    private deConnecteSimulationAidesService: DeConnecteSimulationAidesService
  ) {

  }

  public addElementTableMesRessourcesEstimees(content: Array<any>, demandeurEmploi: DemandeurEmploi, simulationAides: SimulationAides): void {
    this.addTableMesRessourcesEstimees(content, simulationAides);
    this.addTableMesRessourcesEtAidesActuelles(content, demandeurEmploi, simulationAides);
    if (this.aidesService.hasAidesObtenirSimulationAides(simulationAides)) {
      this.addTableAidesObtenir(content, simulationAides);
    }
  }


  /******* méthode création table "Les aides que vous pourriez obtenir" */

  public addTableAidesObtenir(content: Array<any>, simulationAides: SimulationAides): void {
    let body = new Array<Array<Cell>>();
    let nbrRows = 1;

    this.addHeaderTable(body, simulationAides.simulationsMensuelles.length, 'Les aides que vous pourriez obtenir');

    if (this.aidesService.hasAide(simulationAides, CodesAidesEnum.AGEPI)) {
      const imageBase64 = ImagesBase64Enum.AGEPI;
      const libelle = LibellesAidesEnum.AGEPI;
      this.addRowAideObtenir(body, simulationAides, CodesAidesEnum.AGEPI, imageBase64, libelle);
      nbrRows++;
    }
    if (this.aidesService.hasAide(simulationAides, CodesAidesEnum.AIDE_MOBILITE)) {
      const imageBase64 = ImagesBase64Enum.AIDE_MOBILITE;
      const libelle = '\n' + LibellesAidesEnum.AIDE_MOBILITE;
      this.addRowAideObtenir(body, simulationAides, CodesAidesEnum.AIDE_MOBILITE, imageBase64, libelle);
      nbrRows++;
    }
    if (this.aidesService.hasAide(simulationAides, CodesAidesEnum.PRIME_ACTIVITE)) {
      const imageBase64 = ImagesBase64Enum.PRIME_ACTIVITE;
      const libelle = '\n' + LibellesAidesEnum.PRIME_ACTIVITE;
      this.addRowAideObtenir(body, simulationAides, CodesAidesEnum.PRIME_ACTIVITE, imageBase64, libelle);
      nbrRows++;
    }

    content.push(this.createTableElement(body, simulationAides.simulationsMensuelles.length, nbrRows));
  }

  private addRowAideObtenir(body: Array<Array<Cell>>, simulationAides: SimulationAides, codeAideToAdd: string, imageAideBase64: string, libelle: string): void {
    const row = new Array<Cell>();
    row.push(this.createCellImageRessource(imageAideBase64));
    row.push(this.createCellLibelleRessource(libelle));
    //création des cellules pour chaque simulation mensuelle
    simulationAides.simulationsMensuelles.forEach(simulationMensuelle => {
      let montant = 0;
      for (let [codeAide, aide] of Object.entries(simulationMensuelle.mesAides)) {
        if (aide && codeAide === codeAideToAdd) {
          montant = aide.montant;
        }
      }
      row.push(this.createCellMontant(montant));
    });
    body.push(row);
  }


  /************** méthode création table "Mes ressources et aides actuelles"  *****************/

  public addTableMesRessourcesEtAidesActuelles(content: Array<any>, demandeurEmploi: DemandeurEmploi, simulationAides: SimulationAides): void {

    let body = new Array<Array<Cell>>();
    let nbrRows = 1;

    this.addHeaderTable(body, simulationAides.simulationsMensuelles.length, 'Mes ressources et aides actuelles');

    this.addRowPaie(body, demandeurEmploi, simulationAides);
    if (demandeurEmploi.beneficiaireAides.beneficiaireASS) {
      this.addRowASS(body, simulationAides);
      nbrRows++;
    }
    if (demandeurEmploi.beneficiaireAides.beneficiaireRSA) {
      this.addRowRSA(body, simulationAides);
      nbrRows++;
    }
    if (demandeurEmploi.beneficiaireAides.beneficiaireAAH) {
      this.addRowAAHPourBeneficiaireAAH(body, simulationAides);
      nbrRows++;
    }
    if (demandeurEmploi.ressourcesFinancieres.aidesCAF) {
      if (!demandeurEmploi.beneficiaireAides.beneficiaireAAH
        && demandeurEmploi.ressourcesFinancieres.aidesCAF.allocationAAH > 0) {
        this.addRowAAH(body, demandeurEmploi, simulationAides);
        nbrRows++;
      }
    }
    if (demandeurEmploi.beneficiaireAides.beneficiairePensionInvalidite) {
      this.addRowPensionInvalidite(body, demandeurEmploi, simulationAides);
      nbrRows++;
    }
    if (demandeurEmploi.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0) {
      this.addRowIMMO(body, simulationAides);
      nbrRows++;
    }
    if (demandeurEmploi.ressourcesFinancieres.beneficesMicroEntrepriseDernierExercice > 0) {
      this.addRowMICR(body, simulationAides);
      nbrRows++;
    }
    if (demandeurEmploi.ressourcesFinancieres.chiffreAffairesIndependantDernierExercice) {
      this.addRowINDP(body, simulationAides);
      nbrRows++;
    }
    if (demandeurEmploi.beneficiaireAides.beneficiaireALF) {
      this.addRowALF(body, simulationAides);
      nbrRows++;
    }
    if (demandeurEmploi.beneficiaireAides.beneficiaireALS) {
      this.addRowALS(body, simulationAides);
      nbrRows++;
    }
    if (demandeurEmploi.beneficiaireAides.beneficiaireAPL) {
      this.addRowAPL(body, simulationAides);
      nbrRows++;
    }
    if (demandeurEmploi.ressourcesFinancieres.aidesCAF.aidesFamiliales.allocationSoutienFamilial) {
      this.addRowASF(body, simulationAides);
      nbrRows++;
    }
    if (demandeurEmploi.ressourcesFinancieres.aidesCAF.aidesFamiliales.allocationsFamiliales) {
      this.addRowAF(body, simulationAides);
      nbrRows++;
    }
    if (demandeurEmploi.ressourcesFinancieres.aidesCAF.aidesFamiliales.complementFamilial) {
      this.addRowCF(body, simulationAides);
      nbrRows++;
    }
    if (demandeurEmploi.ressourcesFinancieres.aidesCAF.aidesFamiliales.prestationAccueilJeuneEnfant) {
      this.addRowPAJE(body, simulationAides);
      nbrRows++;
    }
    if (demandeurEmploi.ressourcesFinancieres.aidesCAF.aidesFamiliales.pensionsAlimentairesFoyer) {
      this.addRowPAF(body, simulationAides);
      nbrRows++;
    }

    content.push(this.createTableElement(body, simulationAides.simulationsMensuelles.length, nbrRows));
  }

  private addRowPaie(body: Array<Array<Cell>>, demandeurEmploi: DemandeurEmploi, simulationAides: SimulationAides): void {
    const montant = demandeurEmploi.futurTravail.salaire.montantNet;
    const imageBase64 = ImagesBase64Enum.PAIE;
    const libelle = '\n' + LibellesRessourcesFinancieresEnum.SALAIRE;
    const row = this.createRowMontant(body, montant, imageBase64, libelle, simulationAides.simulationsMensuelles.length);
    body.push(row);
  }

  private addRowASS(body: Array<Array<Cell>>, simulationAides: SimulationAides): void {
    const row = new Array<Cell>();
    const imageBase64 = ImagesBase64Enum.ALLOCATION_SOLIDARITE_SPECIFIQUE;
    const libelle = LibellesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE;
    row.push(this.createCellImageRessource(imageBase64));
    row.push(this.createCellLibelleRessource(libelle));
    //création des cellules pour chaque simulation mensuelle
    simulationAides.simulationsMensuelles.forEach(simulationMensuelle => {
      const montantAss = this.aidesService.getMontantASS(simulationMensuelle);
      row.push(this.createCellMontant(montantAss));
    });
    body.push(row);
  }

  private addRowRSA(body: Array<Array<Cell>>, simulationAides: SimulationAides): void {
    const row = new Array<Cell>();
    const imageBase64 = ImagesBase64Enum.RSA;
    const libelle = LibellesAidesEnum.RSA;
    row.push(this.createCellImageRessource(imageBase64));
    row.push(this.createCellLibelleRessource(libelle));
    //création des cellules pour chaque simulation mensuelle
    simulationAides.simulationsMensuelles.forEach(simulationMensuelle => {
      const montantRSA = this.aidesService.getMontantRSA(simulationMensuelle);
      row.push(this.createCellMontant(montantRSA));
    });
    body.push(row);
  }

  private addRowAAH(body: Array<Array<Cell>>, demandeurEmploi: DemandeurEmploi, simulationAides: SimulationAides): void {
    const imageBase64 = ImagesBase64Enum.ALLOCATION_ADULTES_HANDICAPES;
    const montant = demandeurEmploi.ressourcesFinancieres.aidesCAF.allocationAAH;
    const libelle = LibellesAidesEnum.ALLOCATION_ADULTES_HANDICAPES;
    const row = this.createRowMontant(body, montant, imageBase64, libelle, simulationAides.simulationsMensuelles.length);
    body.push(row);
  }

  private addRowAAHPourBeneficiaireAAH(body: Array<Array<Cell>>, simulationAides: SimulationAides): void {
    const row = new Array<Cell>();
    const imageBase64 = ImagesBase64Enum.ALLOCATION_ADULTES_HANDICAPES;
    const libelle = LibellesAidesEnum.ALLOCATION_ADULTES_HANDICAPES;
    row.push(this.createCellImageRessource(imageBase64));
    row.push(this.createCellLibelleRessource(libelle));
    //création des cellules pour chaque simulation mensuelle
    simulationAides.simulationsMensuelles.forEach(simulationMensuelle => {
      const montantAah = this.aidesService.getMontantAAH(simulationMensuelle);
      row.push(this.createCellMontant(montantAah));
    });
    body.push(row);
  }

  private addRowPensionInvalidite(body: Array<Array<Cell>>, demandeurEmploi: DemandeurEmploi, simulationAides: SimulationAides): void {
    const imageBase64 = ImagesBase64Enum.PENSION_INVALIDITE;
    const montant = demandeurEmploi.ressourcesFinancieres.aidesCPAM.pensionInvalidite;
    const libelle = LibellesAidesEnum.PENSION_INVALIDITE;
    const row = this.createRowMontant(body, montant, imageBase64, libelle, simulationAides.simulationsMensuelles.length);
    body.push(row);
  }

  private addRowIMMO(body: Array<Array<Cell>>, simulationAides: SimulationAides): void {
    const montant = this.deConnecteRessourcesFinancieresService.getRevenusImmobilierSur1Mois();
    const imageBase64 = ImagesBase64Enum.IMMOBILIER;
    const libelle = LibellesRessourcesFinancieresEnum.IMMOBILIER;
    const row = this.createRowMontant(body, montant, imageBase64, libelle, simulationAides.simulationsMensuelles.length);
    body.push(row);
  }

  private addRowMICR(body: Array<Array<Cell>>, simulationAides: SimulationAides): void {
    const montant = this.deConnecteRessourcesFinancieresService.getBeneficesMicroEntrepriseSur1Mois();
    const imageBase64 = ImagesBase64Enum.MICRO_ENTREPRENEUR;
    const libelle = LibellesRessourcesFinancieresEnum.MICRO_ENTREPRENEUR;
    const row = this.createRowMontant(body, montant, imageBase64, libelle, simulationAides.simulationsMensuelles.length);
    body.push(row);
  }

  private addRowINDP(body: Array<Array<Cell>>, simulationAides: SimulationAides): void {
    const montant = this.deConnecteRessourcesFinancieresService.getChiffreAffairesIndependantSur1Mois();
    const imageBase64 = ImagesBase64Enum.TRAVAILLEUR_INDEPENDANT;
    const libelle = LibellesRessourcesFinancieresEnum.TRAVAILLEUR_INDEPENDANT;
    const row = this.createRowMontant(body, montant, imageBase64, libelle, simulationAides.simulationsMensuelles.length);
    body.push(row);
  }

  private addRowAPL(body: Array<Array<Cell>>, simulationAides: SimulationAides): void {
    const row = new Array<Cell>();
    const imageBase64 = ImagesBase64Enum.AIDE_PERSONNALISEE_LOGEMENT;
    const libelle = LibellesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT;
    row.push(this.createCellImageRessource(imageBase64));
    row.push(this.createCellLibelleRessource(libelle));
    //création des cellules pour chaque simulation mensuelle
    simulationAides.simulationsMensuelles.forEach(simulationMensuelle => {
      const montantAah = this.aidesService.getMontantAidePersonnaliseeLogement(simulationMensuelle);
      row.push(this.createCellMontant(montantAah));
    });
    body.push(row);
  }

  private addRowALF(body: Array<Array<Cell>>, simulationAides: SimulationAides): void {
    const row = new Array<Cell>();
    const imageBase64 = ImagesBase64Enum.ALLOCATION_LOGEMENT_FAMILIALE;
    const libelle = LibellesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE;
    row.push(this.createCellImageRessource(imageBase64));
    row.push(this.createCellLibelleRessource(libelle));
    //création des cellules pour chaque simulation mensuelle
    simulationAides.simulationsMensuelles.forEach(simulationMensuelle => {
      const montantAah = this.aidesService.getMontantAllocationLogementFamilial(simulationMensuelle);
      row.push(this.createCellMontant(montantAah));
    });
    body.push(row);
  }

  private addRowALS(body: Array<Array<Cell>>, simulationAides: SimulationAides): void {
    const row = new Array<Cell>();
    const imageBase64 = ImagesBase64Enum.ALLOCATION_LOGEMENT_SOCIALE;
    const libelle = LibellesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE;
    row.push(this.createCellImageRessource(imageBase64));
    row.push(this.createCellLibelleRessource(libelle));
    //création des cellules pour chaque simulation mensuelle
    simulationAides.simulationsMensuelles.forEach(simulationMensuelle => {
      const montantAah = this.aidesService.getMontantAllocationLogementSocial(simulationMensuelle);
      row.push(this.createCellMontant(montantAah));
    });
    body.push(row);
  }

  private addRowASF(body: Array<Array<Cell>>, simulationAides: SimulationAides): void {
    const row = new Array<Cell>();
    const imageBase64 = ImagesBase64Enum.ALLOCATION_SOUTIEN_FAMILIAL;
    const libelle = LibellesAidesEnum.ALLOCATION_SOUTIEN_FAMILIAL;
    row.push(this.createCellImageRessource(imageBase64));
    row.push(this.createCellLibelleRessource(libelle));
    //création des cellules pour chaque simulation mensuelle
    simulationAides.simulationsMensuelles.forEach(simulationMensuelle => {
      const montantASF = this.aidesService.getMontantAllocationSoutienFamilial(simulationMensuelle);
      row.push(this.createCellMontant(montantASF));
    });
    body.push(row);
  }

  private addRowAF(body: Array<Array<Cell>>, simulationAides: SimulationAides): void {
    const row = new Array<Cell>();
    const imageBase64 = ImagesBase64Enum.ALLOCATIONS_FAMILIALES;
    const libelle = LibellesAidesEnum.ALLOCATIONS_FAMILIALES;
    row.push(this.createCellImageRessource(imageBase64));
    row.push(this.createCellLibelleRessource(libelle));
    //création des cellules pour chaque simulation mensuelle
    simulationAides.simulationsMensuelles.forEach(simulationMensuelle => {
      const montantAF = this.aidesService.getMontantAllocationsFamiliales(simulationMensuelle);
      row.push(this.createCellMontant(montantAF));
    });
    body.push(row);
  }

  private addRowCF(body: Array<Array<Cell>>, simulationAides: SimulationAides): void {
    const row = new Array<Cell>();
    const imageBase64 = ImagesBase64Enum.COMPLEMENT_FAMILIAL;
    const libelle = LibellesAidesEnum.COMPLEMENT_FAMILIAL;
    row.push(this.createCellImageRessource(imageBase64));
    row.push(this.createCellLibelleRessource(libelle));
    //création des cellules pour chaque simulation mensuelle
    simulationAides.simulationsMensuelles.forEach(simulationMensuelle => {
      const montantCF = this.aidesService.getMontantComplementFamilial(simulationMensuelle);
      row.push(this.createCellMontant(montantCF));
    });
    body.push(row);
  }

  private addRowPAJE(body: Array<Array<Cell>>, simulationAides: SimulationAides): void {
    const row = new Array<Cell>();
    const imageBase64 = ImagesBase64Enum.PRESTATION_ACCUEIL_JEUNE_ENFANT;
    const libelle = LibellesAidesEnum.PRESTATION_ACCUEIL_JEUNE_ENFANT;
    row.push(this.createCellImageRessource(imageBase64));
    row.push(this.createCellLibelleRessource(libelle));
    //création des cellules pour chaque simulation mensuelle
    simulationAides.simulationsMensuelles.forEach(simulationMensuelle => {
      const montantPAJE = this.aidesService.getMontantPrestationAccueilJeuneEnfant(simulationMensuelle);
      row.push(this.createCellMontant(montantPAJE));
    });
    body.push(row);
  }

  private addRowPAF(body: Array<Array<Cell>>, simulationAides: SimulationAides): void {
    const row = new Array<Cell>();
    const imageBase64 = ImagesBase64Enum.PENSIONS_ALIMENTAIRES;
    const libelle = LibellesAidesEnum.PENSIONS_ALIMENTAIRES;
    row.push(this.createCellImageRessource(imageBase64));
    row.push(this.createCellLibelleRessource(libelle));
    //création des cellules pour chaque simulation mensuelle
    simulationAides.simulationsMensuelles.forEach(simulationMensuelle => {
      const montantPAF = this.aidesService.getMontantPensionsAlimentaires(simulationMensuelle);
      row.push(this.createCellMontant(montantPAF));
    });
    body.push(row);
  }


  /************** méthode création table "Mes ressources estimees"  *****************/

  public addTableMesRessourcesEstimees(content: Array<any>, simulationAides: SimulationAides): void {
    let body = new Array<Array<Cell>>();
    this.addHeaderTableMesRessourcesEstimees(body, simulationAides);
    this.addRowMontantTotalSimulationMensuelle(body, simulationAides, simulationAides.simulationsMensuelles.length);
    content.push(this.createTableElementMesRessourcesEstimees(body, simulationAides.simulationsMensuelles.length));
  }

  private addHeaderTableMesRessourcesEstimees(body: Array<Array<Cell>>, simulationAides: SimulationAides): void {
    const nbrMoisSimule = simulationAides.simulationsMensuelles.length;
    const row = new Array<Cell>();

    //add cellule1
    const titleCell2 = '\nDétail des ressources estimées après reprise d’emploi pour les ' + nbrMoisSimule + ' mois à venir';
    row.push(this.addTitleMesRessourcesEstimees(titleCell2, '#DEEEFF', 8, 'left'));
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

  private addRowMontantTotalSimulationMensuelle(body: Array<Array<Cell>>, simulationAides: SimulationAides, nbrColumns: number): void {
    const row = new Array<Cell>();
    row.push(this.createCellTitle(' ', '#FFFFFF', 2));
    row.push(new Cell());
    //add des cellules pour chaque simulation mensuelle
    simulationAides.simulationsMensuelles.forEach(simulationMensuelle => {
      const libelleDate = this.dateUtileService.getLibelleDateStringFormatCourt(simulationMensuelle.datePremierJourMoisSimule);
      const montantTotal = this.deConnecteSimulationAidesService.calculerMontantTotalRessourcesMois(simulationMensuelle);
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
    tableElement.table.widths = this.getWidthsColumns(nbrColumns);
    return tableElement;
  }

  /*********** méthode communes ********************/

  private addHeaderTable(body: Array<Array<Cell>>, nbrMoisSimule: number, title: string): void {
    const row = new Array<Cell>();
    row.push(this.createCellTitle(title, '#DEEEFF', 8));
    //on ajoute des cellules vides pour obtenir un nombre de colonnes = nbrMoisSimule + 2
    for (let i = 0; i < nbrMoisSimule + 1; i++) {
      row.push(new Cell());
    }
    body.push(row);
  }

  private createRowMontant(body: Array<Array<Cell>>, montant: number, imageBase64: string, libelle: string, nbrMoisSimule: number): Array<Cell> {
    const row = new Array<Cell>();
    row.push(this.createCellImageRessource(imageBase64));
    row.push(this.createCellLibelleRessource(libelle));
    //création des cellules pour chaque simulation mensuelle
    for (let i = 0; i < nbrMoisSimule; i++) {
      row.push(this.createCellMontant(montant));
    }
    return row;
  }

  private createTableElement(body: Array<Array<Cell>>, nbrColumns: number, nbrRows: number): TableElement {
    const tableElement = new TableElement();
    const layoutTable = new LayoutTable();
    layoutTable.hLineColor = '#DEEEFF';
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
    cell.style.color = '#1B2B67';
    cell.style.fontSize = 11;
    cell.text = title;
    return cell;
  }


  private getWidthsColumns(nbrColumns: number): Array<number> {
    const widthMaxTable = 350;
    const widthColumn = widthMaxTable / nbrColumns;
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