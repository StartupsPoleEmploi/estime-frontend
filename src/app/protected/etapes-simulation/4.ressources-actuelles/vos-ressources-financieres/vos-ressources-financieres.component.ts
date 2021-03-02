import { Component, ElementRef, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { BeneficiaireAidesSociales } from '@models/beneficiaire-aides-sociales';
import { DateDecomposee } from '@models/date-decomposee';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { DeConnecteInfosPersonnellesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-infos-personnelles.service";
import { DeConnecteBenefiaireAidesSocialesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-benefiaire-aides-sociales.service";
import { SalairesAvantPeriodeSimulation } from '@app/commun/models/salaires-avant-periode-simulation';
import { RessourcesFinancieresUtileService } from '@app/core/services/utile/ressources-financieres-utiles.service';
import { DeConnecteRessourcesFinancieresService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';


@Component({
  selector: 'app-vos-ressources-financieres',
  templateUrl: './vos-ressources-financieres.component.html',
  styleUrls: ['./vos-ressources-financieres.component.scss']
})
export class VosRessourcesFinancieresComponent implements OnInit {

  beneficiaireAidesSociales: BeneficiaireAidesSociales;
  dateDernierOuvertureDroitASS: DateDecomposee;
  isRessourcesFinancieresFormSubmitted = false;

  @Input() ressourcesFinancieres: RessourcesFinancieres;
  @Output() validationVosRessourcesEventEmitter = new EventEmitter<void>();

  @ViewChild('anneeDateDerniereOuvertureDroitASS', { read: ElementRef }) anneeDateDerniereOuvertureDroitASSInput: ElementRef;
  @ViewChild('moisDateDerniereOuvertureDroitASS', { read: ElementRef }) moisDateDerniereOuvertureDroitASSInput: ElementRef;
  @ViewChild('vosRessourcesFinancieresForm', { read: NgForm }) vosRessourcesFinancieresForm: FormGroup;


  nombreMoisTravailleAuCours3DerniersMoisSelectOptions = [
    { label: "1 mois", value: 1, default: true },
    { label: "2 mois", value: 2, default: false },
    { label: "3 mois", value: 3, default: false }
  ];

  nombreMoisTravailleAuCours6DerniersMoisSelectOptions = [
    { label: "1 mois", value: 1, default: true },
    { label: "2 mois", value: 2, default: false },
    { label: "3 mois", value: 3, default: false },
    { label: "4 mois", value: 4, default: false },
    { label: "5 mois", value: 5, default: false },
    { label: "6 mois", value: 6, default: false }
  ];


  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public dateUtileService: DateUtileService,
    public deConnecteService: DeConnecteService,
    public deConnecteBenefiaireAidesSocialesService: DeConnecteBenefiaireAidesSocialesService,
    public deConnecteInfosPersonnellesService: DeConnecteInfosPersonnellesService,
    public deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    private elementRef: ElementRef,
    public ressourcesFinancieresUtileService: RessourcesFinancieresUtileService

  ) { }

  ngOnInit(): void {
    this.dateDernierOuvertureDroitASS = this.dateUtileService.getDateDecomposeeFromStringDate(this.ressourcesFinancieres.allocationsPoleEmploi.dateDerniereOuvertureDroitASS);
  }

  public onSubmitRessourcesFinancieresForm(form: FormGroup): void {
    this.isRessourcesFinancieresFormSubmitted = true;
    if (this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireASS()) {
      this.checkAndSaveDateDernierOuvertureDroitASS();
    }
    if (this.isDonneesSaisiesFormulaireValides(form)) {
      this.deConnecteService.setRessourcesFinancieres(this.ressourcesFinancieres);
      this.validationVosRessourcesEventEmitter.emit();
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement(this.elementRef);
    }
  }

  public onClickButtonRadioHasTravailleAuCoursDerniersMois(hasTravailleAuCoursDerniersMois: boolean): void {
    if (hasTravailleAuCoursDerniersMois === false) {
      this.ressourcesFinancieres.nombreMoisTravaillesDerniersMois = 0;
      this.ressourcesFinancieres.salairesAvantPeriodeSimulation = null;
      this.deConnecteService.unsetSalairesAvantPeriodeSimulation();
    } else {
      if (this.ressourcesFinancieres.salairesAvantPeriodeSimulation == null) {
        this.ressourcesFinancieres.salairesAvantPeriodeSimulation = this.creerSalairesAvantPeriodeSimulation();
      }
    }
  }

  public onClickBoutonNombreMoisTravailleAuCoursDerniersMois(): void {
    if(this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireASS()) {
      if(this.ressourcesFinancieres.nombreMoisTravaillesDerniersMois == 1) {
        if(this.ressourcesFinancieres.salairesAvantPeriodeSimulation) {
          this.ressourcesFinancieres.salairesAvantPeriodeSimulation = null;
        }
      } else {
        if(this.ressourcesFinancieres.salairesAvantPeriodeSimulation == null) {
          this.ressourcesFinancieres.salairesAvantPeriodeSimulation = this.creerSalairesAvantPeriodeSimulation();
        }
      }
    }
  }

  public handleKeyUpOnButtonRadioHasTravailleAuCoursDerniersMois(event: any, value: boolean) {
    if (event.keyCode === 13) {
      this.ressourcesFinancieres.hasTravailleAuCoursDerniersMois = value;
      this.onClickButtonRadioHasTravailleAuCoursDerniersMois(value);
    }
  }

  public isAfficherSalaireMoisMoinsNAvantSimulation(nMoisAvantSimulation: number): boolean {
    if (this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireASS()
      && this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireAAH()) {
      return this.isAfficherSalaireMoisMoinsNAvantSimulationPourASS(nMoisAvantSimulation) || this.isAfficherSalaireMoisMoinsNAvantSimulationPourAAH(nMoisAvantSimulation);
    }
    if (this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireASS()) {
      return this.isAfficherSalaireMoisMoinsNAvantSimulationPourASS(nMoisAvantSimulation);
    }
    if (this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireAAH()
      || (this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireAAH() && this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireRSA())) {
      return this.isAfficherSalaireMoisMoinsNAvantSimulationPourAAH(nMoisAvantSimulation);
    }
    if (this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireRSA()) {
      return this.ressourcesFinancieres.salairesAvantPeriodeSimulation
        && this.ressourcesFinancieres.hasTravailleAuCoursDerniersMois;
    }
  }

  public getNombreMoisTravailleAuCoursDerniersMois(): number {
    let nombreMoisTravailleAuCoursDerniersMois = 3;
    if (this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireAAH()) {
      nombreMoisTravailleAuCoursDerniersMois = 6;
    }
    return nombreMoisTravailleAuCoursDerniersMois;
  }

  public getOptionsNombreMoisTravailles() : any {
    if (this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireAAH()) {
      return this.nombreMoisTravailleAuCours6DerniersMoisSelectOptions;
    } else {
      return this.nombreMoisTravailleAuCours3DerniersMoisSelectOptions;
    }
  }

  private checkAndSaveDateDernierOuvertureDroitASS(): void {
    if (this.dateUtileService.isDateDecomposeeSaisieAvecInferieurDateJourValide(this.dateDernierOuvertureDroitASS)) {
      this.ressourcesFinancieres.allocationsPoleEmploi.dateDerniereOuvertureDroitASS = this.dateUtileService.getStringDateFromDateDecomposee(this.dateDernierOuvertureDroitASS);
    }
  }

  private isDonneesSaisiesFormulaireValides(form: FormGroup): boolean {
    let isValide = form.valid;
    if (isValide) {
      isValide = this.deConnecteRessourcesFinancieresService.isDonneesRessourcesFinancieresValides(this.ressourcesFinancieres);
    }
    return isValide;
  }

  private isAfficherSalaireMoisMoinsNAvantSimulationPourAAH(nMoisAvantSimulation: number): boolean {
    return this.ressourcesFinancieres.salairesAvantPeriodeSimulation && nMoisAvantSimulation <= 1
      && this.ressourcesFinancieres.hasTravailleAuCoursDerniersMois
      && this.ressourcesFinancieres.nombreMoisTravaillesDerniersMois > 0;
  }

  private isAfficherSalaireMoisMoinsNAvantSimulationPourASS(nMoisAvantSimulation: number): boolean {
    let isSalaireMoisMoinsNAvantSimulationDisplayPourASS = false;
    if (this.ressourcesFinancieres.salairesAvantPeriodeSimulation) {
      if (nMoisAvantSimulation == 0
        && (this.ressourcesFinancieres.nombreMoisTravaillesDerniersMois == 3
          || this.ressourcesFinancieres.nombreMoisTravaillesDerniersMois == 2)) {
        isSalaireMoisMoinsNAvantSimulationDisplayPourASS = true;
      }
      if (nMoisAvantSimulation == 1
        && this.ressourcesFinancieres.nombreMoisTravaillesDerniersMois == 3) {
        isSalaireMoisMoinsNAvantSimulationDisplayPourASS = true;
      }
    }
    return isSalaireMoisMoinsNAvantSimulationDisplayPourASS;
  }

  private creerSalairesAvantPeriodeSimulation():SalairesAvantPeriodeSimulation {
    const salairesAvantPeriodeSimulation = new SalairesAvantPeriodeSimulation();
    salairesAvantPeriodeSimulation.salaireMoisDemandeSimulation = 0;
    salairesAvantPeriodeSimulation.salaireMoisMoins1MoisDemandeSimulation = 0;
    salairesAvantPeriodeSimulation.salaireMoisMoins2MoisDemandeSimulation = 0;
    return salairesAvantPeriodeSimulation;
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
