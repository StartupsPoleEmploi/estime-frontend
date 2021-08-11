import { Component, ElementRef, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { DateDecomposee } from '@models/date-decomposee';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { DeConnecteInfosPersonnellesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-infos-personnelles.service";
import { DeConnecteBenefiaireAidesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-benefiaire-aides.service";
import { SalairesAvantPeriodeSimulation } from '@app/commun/models/salaires-avant-periode-simulation';
import { SalaireAvantPeriodeSimulation } from '@app/commun/models/salaire-avant-periode-simulation';
import { RessourcesFinancieresUtileService } from '@app/core/services/utile/ressources-financieres-utiles.service';
import { DeConnecteRessourcesFinancieresService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { NombreMoisTravailles } from "@models/nombre-mois-travailles";
import { NumeroProchainMoisDeclarationRSA } from "@models/numero-prochain-mois-declaration-rsa";
import { ScreenService } from '@app/core/services/utile/screen.service';
import { Salaire } from '@app/commun/models/salaire';

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
  hasTroisMoisSansSalaire: boolean;
  nombreMoisManquant: number;

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
    public ressourcesFinancieresUtileService: RessourcesFinancieresUtileService
  ) {

  }

  ngOnInit(): void {
    this.dateDernierOuvertureDroitASS = this.dateUtileService.getDateDecomposeeFromStringDate(this.ressourcesFinancieres.aidesPoleEmploi.allocationASS.dateDerniereOuvertureDroit, "date derniere ouverture droit ASS", "DateDerniereOuvertureDroitASS");
    if (this.deConnecteBenefiaireAidesService.isBeneficiaireRSA()) {
      this.initOptionsProchaineDeclarationRSA();
    }
    if (this.ressourcesFinancieres.hasTravailleAuCoursDerniersMois) {
      this.initOptionsNombreMoisTravailles();
      this.initSalairesAvantPeriodeSimulation();
    }
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
    if(this.ressourcesFinancieres.salairesAvantPeriodeSimulation == null
      ||(this.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisDemandeSimulation == null
        && this.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisMoins1MoisDemandeSimulation == null
        && this.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisMoins2MoisDemandeSimulation == null))
        this.ressourcesFinancieres.salairesAvantPeriodeSimulation = this.creerSalairesAvantPeriodeSimulation();
  }

  public onClickButtonRadioHasTravailleAuCoursDerniersMois(hasTravailleAuCoursDerniersMois: boolean): void {
    if (hasTravailleAuCoursDerniersMois === false) {
      this.ressourcesFinancieres.nombreMoisTravaillesDerniersMois = 0;
      this.ressourcesFinancieres.salairesAvantPeriodeSimulation = null;
      this.ressourcesFinancieres.hasTravailleAuCoursDerniersMois = false;
      this.deConnecteService.unsetSalairesAvantPeriodeSimulation();
    } else {
      if (this.ressourcesFinancieres.salairesAvantPeriodeSimulation == null) {
        this.ressourcesFinancieres.salairesAvantPeriodeSimulation = this.creerSalairesAvantPeriodeSimulation();
      }
      if (this.optionsNombreMoisTravailles == null && this.deConnecteBenefiaireAidesService.isBeneficiaireAAH()) {
        this.initOptionsNombreMoisTravailles();
      }
    }
  }

  public onClickBoutonNombreMoisTravailleAuCoursDerniersMois(): void {
    if (this.deConnecteBenefiaireAidesService.isBeneficiaireASS()) {
      if (this.ressourcesFinancieres.nombreMoisTravaillesDerniersMois == 1) {
        if (this.ressourcesFinancieres.salairesAvantPeriodeSimulation) {
          this.ressourcesFinancieres.salairesAvantPeriodeSimulation = null;
        }
      } else {
        if (this.ressourcesFinancieres.salairesAvantPeriodeSimulation == null) {
          this.ressourcesFinancieres.salairesAvantPeriodeSimulation = this.creerSalairesAvantPeriodeSimulation();
        }
      }
    }
  }

  private creerSalairesAvantPeriodeSimulation(): SalairesAvantPeriodeSimulation {
    const salairesAvantPeriodeSimulation = new SalairesAvantPeriodeSimulation();

    const salaireMoisDemandeSimulation = new SalaireAvantPeriodeSimulation();
    salaireMoisDemandeSimulation.salaire = new Salaire();
    salaireMoisDemandeSimulation.isSansSalaire = false;
    salaireMoisDemandeSimulation.salaire.montantNet = 0;
    salaireMoisDemandeSimulation.salaire.montantBrut = 0;

    const salaireMoisMoins1MoisDemandeSimulation = new SalaireAvantPeriodeSimulation();
    salaireMoisMoins1MoisDemandeSimulation.salaire = new Salaire();
    salaireMoisMoins1MoisDemandeSimulation.isSansSalaire = false;
    salaireMoisMoins1MoisDemandeSimulation.salaire.montantNet = 0;
    salaireMoisMoins1MoisDemandeSimulation.salaire.montantBrut = 0;

    const salaireMoisMoins2MoisDemandeSimulation = new SalaireAvantPeriodeSimulation();
    salaireMoisMoins2MoisDemandeSimulation.salaire = new Salaire();
    salaireMoisMoins2MoisDemandeSimulation.isSansSalaire = false;
    salaireMoisMoins2MoisDemandeSimulation.salaire.montantNet = 0;
    salaireMoisMoins2MoisDemandeSimulation.salaire.montantBrut = 0;

    salairesAvantPeriodeSimulation.salaireMoisDemandeSimulation = salaireMoisDemandeSimulation;
    salairesAvantPeriodeSimulation.salaireMoisMoins1MoisDemandeSimulation = salaireMoisMoins1MoisDemandeSimulation;
    salairesAvantPeriodeSimulation.salaireMoisMoins2MoisDemandeSimulation = salaireMoisMoins2MoisDemandeSimulation;

    return salairesAvantPeriodeSimulation;
  }


  public onClickPasDeSalaire(nMoisAvantSimulation: number) {
    switch (nMoisAvantSimulation) {
      case 0:
        this.unsetSalairesBrutEtNet(this.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisDemandeSimulation.salaire);
        break;
      case 1:
        this.unsetSalairesBrutEtNet(this.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisMoins1MoisDemandeSimulation.salaire);
        break;
      case 2:
        this.unsetSalairesBrutEtNet(this.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisMoins2MoisDemandeSimulation.salaire);
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
          this.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisDemandeSimulation.isSansSalaire = !this.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisDemandeSimulation.isSansSalaire;
          break;
        case 1:
          this.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisMoins1MoisDemandeSimulation.isSansSalaire = !this.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisMoins1MoisDemandeSimulation.isSansSalaire;
          break;
        case 2:
          this.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisMoins2MoisDemandeSimulation.isSansSalaire = !this.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisMoins2MoisDemandeSimulation.isSansSalaire;
          break;
      }
      this.onClickPasDeSalaire(nMoisAvantSimulation);
    }
  }

  public isAfficherSelectNombreMoisTravailles6DerniersMois(): boolean {
    return this.deConnecteBenefiaireAidesService.isBeneficiaireAAH() && this.ressourcesFinancieres.hasTravailleAuCoursDerniersMois === true
  }

  public isAfficherChampsSalaires():boolean {
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
    this.hasTroisMoisSansSalaire = false;
    if (isValide) {
      isValide = this.deConnecteRessourcesFinancieresService.isDonneesRessourcesFinancieresValides(this.ressourcesFinancieres);
      // on vérifie si lorsque le formulaire n'est pas valide c'est parce que la saisie des champs salaires est invalide
      if(!isValide) {
        const isBeneficiaireAAH = this.deConnecteBenefiaireAidesService.isBeneficiaireAAH();
        const isBeneficiareASSOuRSA = (this.deConnecteBenefiaireAidesService.isBeneficiaireASS() || this.deConnecteBenefiaireAidesService.isBeneficiaireRSA());
        this.hasTroisMoisSansSalaire = !this.ressourcesFinancieresUtileService.isChampsSalairesValides(this.ressourcesFinancieres, isBeneficiaireAAH, isBeneficiareASSOuRSA);
        this.nombreMoisManquant = isBeneficiaireAAH?this.ressourcesFinancieres.nombreMoisTravaillesDerniersMois-3:1;
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
}
