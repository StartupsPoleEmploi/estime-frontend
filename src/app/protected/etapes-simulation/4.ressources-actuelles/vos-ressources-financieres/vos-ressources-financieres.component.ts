import { Component, ElementRef, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { DateDecomposee } from '@models/date-decomposee';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { DeConnecteInfosPersonnellesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-infos-personnelles.service";
import { DeConnecteBenefiaireAidesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-benefiaire-aides.service";
import { PeriodeTravailleeAvantSimulation } from '@app/commun/models/periode-travaillee-avant-simulation';
import { MoisTravailleAvantSimulation } from '@app/commun/models/mois-travaille-avant-simulation';
import { RessourcesFinancieresUtileService } from '@app/core/services/utile/ressources-financieres-utiles.service';
import { DeConnecteRessourcesFinancieresService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { NombreMoisTravailles } from "@models/nombre-mois-travailles";
import { NumeroProchainMoisDeclarationRSA } from "@models/numero-prochain-mois-declaration-rsa";
import { ScreenService } from '@app/core/services/utile/screen.service';
import { DeConnecteSituationFamilialeService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-situation-familiale.service";
import { Salaire } from '@app/commun/models/salaire';
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';
import { SituationFamiliale } from '@models/situation-familiale';
import { SituationFamilialeUtileService } from '@app/core/services/utile/situation-familiale.service';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { InformationsPersonnelles } from '@models/informations-personnelles';

@Component({
  selector: 'app-vos-ressources-financieres',
  templateUrl: './vos-ressources-financieres.component.html',
  styleUrls: ['./vos-ressources-financieres.component.scss']
})
export class VosRessourcesFinancieresComponent implements OnInit {

  dateDernierOuvertureDroitASS: DateDecomposee;
  isRessourcesFinancieresFormSubmitted = false;
  optionsNombreMoisTravailles: Array<NombreMoisTravailles>;
  optionsProchaineDeclarationRSA: Array<NumeroProchainMoisDeclarationRSA>;
  // flag qui passe à vrai quand on a déclaré avoir toucher un salaire dans les derniers mois mais qu'on ne remplit aucun salaire
  erreurSaisieSalaires: boolean;

  informationsPersonnelles: InformationsPersonnelles;
  beneficiaireAides: BeneficiaireAides;
  situationFamiliale: SituationFamiliale;

  @Input() ressourcesFinancieres: RessourcesFinancieres;
  @Output() validationVosRessourcesEventEmitter = new EventEmitter<void>();

  @ViewChild('anneeDateDerniereOuvertureDroitASS', { read: ElementRef }) anneeDateDerniereOuvertureDroitASSInput: ElementRef;
  @ViewChild('moisDateDerniereOuvertureDroitASS', { read: ElementRef }) moisDateDerniereOuvertureDroitASSInput: ElementRef;
  @ViewChild('vosRessourcesFinancieresForm', { read: NgForm }) vosRessourcesFinancieresForm: FormGroup;


  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public dateUtileService: DateUtileService,
    public deConnecteService: DeConnecteService,
    public deConnecteBenefiaireAidesService: DeConnecteBenefiaireAidesService,
    public deConnecteInfosPersonnellesService: DeConnecteInfosPersonnellesService,
    public deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    public screenService: ScreenService,
    private elementRef: ElementRef,
    public deConnecteSituationFamilialeService: DeConnecteSituationFamilialeService,
    public ressourcesFinancieresUtileService: RessourcesFinancieresUtileService,
    private situationFamilialeUtileService: SituationFamilialeUtileService,
  ) {

  }

  ngOnInit(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.beneficiaireAides = demandeurEmploiConnecte.beneficiaireAides;
    if (this.deConnecteBenefiaireAidesService.isBeneficiaireASS()) {
      this.dateDernierOuvertureDroitASS = this.dateUtileService.getDateDecomposeeFromStringDate(this.ressourcesFinancieres.aidesPoleEmploi.allocationASS.dateDerniereOuvertureDroit, "date derniere ouverture droit ASS", "DateDerniereOuvertureDroitASS");
    }
    if (this.deConnecteBenefiaireAidesService.isBeneficiaireRSA()) {
      this.initOptionsProchaineDeclarationRSA();
    }
    if (this.ressourcesFinancieres.hasTravailleAuCoursDerniersMois) {
      this.initOptionsNombreMoisTravailles();
      this.initSalairesAvantPeriodeSimulation();
    }
    this.loadDataSituationFamiliale(demandeurEmploiConnecte);
    this.informationsPersonnelles = demandeurEmploiConnecte.informationsPersonnelles;
  }

  public isBeneficiaireRSACelibataireSansEnfants(): boolean {
    let result = false;

    if (this.deConnecteBenefiaireAidesService.isBeneficiaireRSA()
      && !this.deConnecteSituationFamilialeService.hasConjointSituationAvecRessource()
      && !this.deConnecteSituationFamilialeService.hasPersonneAChargeAvecRessourcesFinancieres()
      && !(this.deConnecteSituationFamilialeService.isEnCouple()
        && this.deConnecteSituationFamilialeService.hasPersonneACharge())) {
      result = true;
    }
    return result;
  }

  /**
   * Fonction qui permet d'initialiser les options du select de mois de prochaine déclaration RSA
   */
  private initOptionsProchaineDeclarationRSA() {
    this.optionsProchaineDeclarationRSA = new Array<NumeroProchainMoisDeclarationRSA>();
    for (let i = 0; i < 4; i++) {
      const numeroProchainMoisDeclarationRSA = new NumeroProchainMoisDeclarationRSA();
      numeroProchainMoisDeclarationRSA.value = i;
      numeroProchainMoisDeclarationRSA.label = this.dateUtileService.getLibelleMoisApresDateJour(i);
      this.optionsProchaineDeclarationRSA.push(numeroProchainMoisDeclarationRSA);
    }
  }

  /**
   * Fonction qui permet d'initialiser les options du select du nombre de mois travaillés
   * sur les 6 derniers mois dans le cas d'un demandeur AAH
   */
  private initOptionsNombreMoisTravailles(): void {
    this.optionsNombreMoisTravailles = new Array<NombreMoisTravailles>();
    const nbrMoisTravaille = 6;
    for (let i = 1; i <= nbrMoisTravaille; i++) {
      const nombreMoisTravaille = new NombreMoisTravailles();
      nombreMoisTravaille.value = i;
      nombreMoisTravaille.label = `${i} mois`;
      this.optionsNombreMoisTravailles.push(nombreMoisTravaille);
    }
  }

  public getNombreMoisTravailleAuCoursDerniersMois(): number {
    let nombreMoisTravaillesDerniersMois = 3;
    if (this.deConnecteBenefiaireAidesService.isBeneficiaireAAH()) nombreMoisTravaillesDerniersMois = 6;
    return nombreMoisTravaillesDerniersMois;
  }

  /**
   *
   * Fonction qui permet d'initialiser les salaires perçues avant la période de simulation
   * dans le cas où ceux-ci ne le seraient pas encore mais que hasTravailleAuCoursDerniersMois est déjà vrai
   * (quand on rafraichit la page ou qu'on change de situation par exemple)
   */
  private initSalairesAvantPeriodeSimulation(): void {
    if (this.ressourcesFinancieres.periodeTravailleeAvantSimulation == null
      || (this.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins1 == null
        && this.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins2 == null
        && this.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins3 == null))
      this.ressourcesFinancieres.periodeTravailleeAvantSimulation = this.creerSalairesAvantPeriodeSimulation();
  }

  public onClickButtonRadioHasTravailleAuCoursDerniersMois(hasTravailleAuCoursDerniersMois: boolean): void {
    if (hasTravailleAuCoursDerniersMois === false) {
      this.ressourcesFinancieres.nombreMoisTravaillesDerniersMois = 0;
      this.ressourcesFinancieres.periodeTravailleeAvantSimulation = null;
      this.ressourcesFinancieres.hasTravailleAuCoursDerniersMois = false;
      this.deConnecteService.unsetSalairesAvantPeriodeSimulation();
    } else {
      if (this.ressourcesFinancieres.periodeTravailleeAvantSimulation == null) {
        this.ressourcesFinancieres.periodeTravailleeAvantSimulation = this.creerSalairesAvantPeriodeSimulation();
      }
      if (this.optionsNombreMoisTravailles == null && this.deConnecteBenefiaireAidesService.isBeneficiaireAAH()) {
        this.initOptionsNombreMoisTravailles();
      }
    }
  }

  public onClickBoutonNombreMoisTravailleAuCoursDerniersMois(): void {
    if (this.deConnecteBenefiaireAidesService.isBeneficiaireASS()) {
      if (this.ressourcesFinancieres.nombreMoisTravaillesDerniersMois == 1) {
        if (this.ressourcesFinancieres.periodeTravailleeAvantSimulation) {
          this.ressourcesFinancieres.periodeTravailleeAvantSimulation = null;
        }
      } else {
        if (this.ressourcesFinancieres.periodeTravailleeAvantSimulation == null) {
          this.ressourcesFinancieres.periodeTravailleeAvantSimulation = this.creerSalairesAvantPeriodeSimulation();
        }
      }
    }
  }

  private creerSalairesAvantPeriodeSimulation(): PeriodeTravailleeAvantSimulation {
    const periodeTravailleeAvantSimulation = new PeriodeTravailleeAvantSimulation();

    const moisMoins1 = new MoisTravailleAvantSimulation();
    moisMoins1.salaire = new Salaire();
    moisMoins1.isSansSalaire = false;
    moisMoins1.salaire.montantNet = 0;
    moisMoins1.salaire.montantBrut = 0;

    const moisMoins2 = new MoisTravailleAvantSimulation();
    moisMoins2.salaire = new Salaire();
    moisMoins2.isSansSalaire = false;
    moisMoins2.salaire.montantNet = 0;
    moisMoins2.salaire.montantBrut = 0;

    const moisMoins3 = new MoisTravailleAvantSimulation();
    moisMoins3.salaire = new Salaire();
    moisMoins3.isSansSalaire = false;
    moisMoins3.salaire.montantNet = 0;
    moisMoins3.salaire.montantBrut = 0;

    periodeTravailleeAvantSimulation.moisMoins1 = moisMoins1;
    periodeTravailleeAvantSimulation.moisMoins2 = moisMoins2;
    periodeTravailleeAvantSimulation.moisMoins3 = moisMoins3;

    return periodeTravailleeAvantSimulation;
  }


  public onClickPasDeSalaire(nMoisAvantSimulation: number) {
    switch (nMoisAvantSimulation) {
      case 0:
        this.unsetSalairesBrutEtNet(this.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins1.salaire);
        break;
      case 1:
        this.unsetSalairesBrutEtNet(this.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins2.salaire);
        break;
      case 2:
        this.unsetSalairesBrutEtNet(this.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins3.salaire);
        break;
    }
  }

  private unsetSalairesBrutEtNet(salaire: Salaire): Salaire {
    salaire.montantBrut = 0;
    salaire.montantNet = 0;
    return salaire;
  }

  public handleKeyUpOnButtonRadioHasTravailleAuCoursDerniersMois(event: any, value: boolean) {
    if (event.keyCode === 13) {
      this.ressourcesFinancieres.hasTravailleAuCoursDerniersMois = value;
      this.onClickButtonRadioHasTravailleAuCoursDerniersMois(value);
    }
  }

  public handleKeyUpOnCheckBoxPasDeSalaire(event: any, nMoisAvantSimulation: number) {
    if (event.keyCode === 13) {
      switch (nMoisAvantSimulation) {
        case 0:
          this.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins1.isSansSalaire = !this.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins1.isSansSalaire;
          break;
        case 1:
          this.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins2.isSansSalaire = !this.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins2.isSansSalaire;
          break;
        case 2:
          this.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins3.isSansSalaire = !this.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins3.isSansSalaire;
          break;
      }
      this.onClickPasDeSalaire(nMoisAvantSimulation);
    }
  }

  public isAfficherSelectNombreMoisTravailles6DerniersMois(): boolean {
    return this.deConnecteBenefiaireAidesService.isBeneficiaireAAH() && this.ressourcesFinancieres.hasTravailleAuCoursDerniersMois === true
  }

  public isAfficherChampsSalaires(): boolean {
    return this.ressourcesFinancieres.hasTravailleAuCoursDerniersMois;
  }

  public onSubmitRessourcesFinancieresForm(form: FormGroup): void {
    this.isRessourcesFinancieresFormSubmitted = true;
    if (this.deConnecteBenefiaireAidesService.isBeneficiaireASS()) {
      this.checkAndSaveDateDernierOuvertureDroitASS();
    }
    if (this.isDonneesSaisiesFormulaireValides(form)) {
      this.deConnecteService.setRessourcesFinancieres(this.ressourcesFinancieres);
      this.validationVosRessourcesEventEmitter.emit();
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement(this.elementRef);
    }
  }

  private checkAndSaveDateDernierOuvertureDroitASS(): void {
    if (this.dateUtileService.isDateDecomposeeSaisieAvecInferieurDateJourValide(this.dateDernierOuvertureDroitASS)) {
      this.ressourcesFinancieres.aidesPoleEmploi.allocationASS.dateDerniereOuvertureDroit = this.dateUtileService.getStringDateFromDateDecomposee(this.dateDernierOuvertureDroitASS);
    }
  }

  private isDonneesSaisiesFormulaireValides(form: FormGroup): boolean {
    let isValide = form.valid;
    this.erreurSaisieSalaires = false;
    if (isValide) {
      isValide = this.deConnecteRessourcesFinancieresService.isDonneesRessourcesFinancieresValides(this.ressourcesFinancieres);
      // on vérifie si lorsque le formulaire est valide au niveau des données la saisie des champs salaires est valide également
      if (isValide) {
        const isBeneficiaireAAH = this.deConnecteBenefiaireAidesService.isBeneficiaireAAH();
        const isBeneficiareASSOuRSA = (this.deConnecteBenefiaireAidesService.isBeneficiaireASS() || (this.deConnecteBenefiaireAidesService.isBeneficiaireRSA() && !this.deConnecteBenefiaireAidesService.hasFoyerRSA()));
        isValide = this.ressourcesFinancieresUtileService.isChampsSalairesValides(this.ressourcesFinancieres, isBeneficiaireAAH, isBeneficiareASSOuRSA);
        if (!isValide) this.erreurSaisieSalaires = true;
      }
    }
    return isValide;
  }

  /*** gestion évènement dateDernierOuvertureDroitASS */

  public onChangeOrKeyUpDateDerniereOuvertureDroitASSJour(event): void {
    event.stopPropagation();
    const value = this.dateDernierOuvertureDroitASS.jour;
    if (value && value.length === 2) {
      this.moisDateDerniereOuvertureDroitASSInput.nativeElement.focus();
    }
    this.dateUtileService.checkFormatJour(this.dateDernierOuvertureDroitASS);
  }

  public onChangeOrKeyUpDateDerniereOuvertureDroitASSMois(event): void {
    event.stopPropagation();
    const value = this.dateDernierOuvertureDroitASS.mois;
    if (value && value.length === 2) {
      this.anneeDateDerniereOuvertureDroitASSInput.nativeElement.focus();
    }
    this.dateUtileService.checkFormatMois(this.dateDernierOuvertureDroitASS);
  }

  public onChangeOrKeyUpDateDerniereOuvertureDroitASSAnnee(event): void {
    event.stopPropagation();
    this.dateUtileService.checkFormatAnnee(this.dateDernierOuvertureDroitASS);
  }

  private loadDataSituationFamiliale(demandeurEmploiConnecte: DemandeurEmploi): void {
    if (demandeurEmploiConnecte.situationFamiliale) {
      this.situationFamiliale = demandeurEmploiConnecte.situationFamiliale;
    } else {
      this.situationFamiliale = this.situationFamilialeUtileService.creerSituationFamiliale();
    }
  }

  public handleKeyUpOnButtonProprietaireSansPretOuLogeGratuit(event: any, value: boolean): void {
    if (event.keyCode === 13) {
      this.informationsPersonnelles.isProprietaireSansPretOuLogeGratuit = value;
    }
  }
}
