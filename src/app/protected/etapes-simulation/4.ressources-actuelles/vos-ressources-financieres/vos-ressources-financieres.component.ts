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
  @Output() validationVosRessourcesEventEmitter = new EventEmitter<DateDecomposee>();

  @ViewChild('anneeDateDerniereOuvertureDroitASS', { read: ElementRef }) anneeDateDerniereOuvertureDroitASSInput: ElementRef;
  @ViewChild('moisDateDerniereOuvertureDroitASS', { read: ElementRef }) moisDateDerniereOuvertureDroitASSInput: ElementRef;
  @ViewChild('vosRessourcesFinancieresForm', { read: NgForm }) vosRessourcesFinancieresForm: FormGroup;

  nombreMoisCumulAssSalaireSelectOptions = [
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
      this.validationVosRessourcesEventEmitter.emit(this.dateDernierOuvertureDroitASS);
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement(this.elementRef);
    }
  }

  public onClickButtonRadioHasCumuleAssEtSalaire(hasCumuleAssEtSalaire: boolean): void {
    if (hasCumuleAssEtSalaire === false) {
      this.ressourcesFinancieres.allocationsPoleEmploi.nombreMoisCumulesAssEtSalaire = 0;
    }
  }

  public handleKeyUpOnButtonHasCumuleAssEtSalaire(event: any, value: boolean) {
    if (event.keyCode === 13) {
      this.ressourcesFinancieres.allocationsPoleEmploi.hasCumuleAssEtSalaire = value;
      this.onClickButtonRadioHasCumuleAssEtSalaire(value);
    }
  }

  public onClickButtonRadioNombreMoisCumulAssSalaire(): void {
    if (this.ressourcesFinancieres.allocationsPoleEmploi.nombreMoisCumulesAssEtSalaire >= 2) {
      this.ressourcesFinancieres.salairesAvantPeriodeSimulation = new SalairesAvantPeriodeSimulation();
      this.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisDemandeSimulation = 0;
      this.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisMoins1MoisDemandeSimulation = 0;
    } else {
      this.ressourcesFinancieres.salairesAvantPeriodeSimulation = null;
      this.deConnecteService.unsetSalairesAvantPeriodeSimulation();
    }
  }


  public onClickButtonRadioHasTravailleAuCours6DerniersMois(hasTravailleAuCours6DerniersMois: boolean): void {
    if (hasTravailleAuCours6DerniersMois === false) {
      this.ressourcesFinancieres.nombreMoisTravailles6DerniersMois = 0;
      this.ressourcesFinancieres.salairesAvantPeriodeSimulation = null;
      this.deConnecteService.unsetSalairesAvantPeriodeSimulation();
    } else {
      if (this.ressourcesFinancieres.salairesAvantPeriodeSimulation == null) {
        this.ressourcesFinancieres.salairesAvantPeriodeSimulation = new SalairesAvantPeriodeSimulation();
        this.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisDemandeSimulation = 0;
        this.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisMoins1MoisDemandeSimulation = 0;
      }
    }
  }


  public handleKeyUpOnButtonRadioHasTravailleAuCours6DerniersMois(event: any, value: boolean) {
    if (event.keyCode === 13) {
      this.ressourcesFinancieres.hasTravailleAuCours6DerniersMois = value;
      this.onClickButtonRadioHasTravailleAuCours6DerniersMois(value);
    }
  }



  private checkAndSaveDateDernierOuvertureDroitASS(): void {
    if (this.dateUtileService.isDateDecomposeeSaisieAvecInferieurDateJourValide(this.dateDernierOuvertureDroitASS)) {
      this.ressourcesFinancieres.allocationsPoleEmploi.dateDerniereOuvertureDroitASS = this.dateUtileService.getStringDateFromDateDecomposee(this.dateDernierOuvertureDroitASS);
    }
  }

  private isDonneesSaisiesFormulaireValides(form: FormGroup): boolean {
    let isValide = form.valid;
    if(isValide) {
      if(this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireASS() ) {
        isValide = this.isDonneesASSSaisiesValide();
      }
      if(this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireAAH() ) {
        isValide = this.isDonneesAAHSaisiesValides();
      }
    }
    return isValide;
  }


  public afficherSalaireM0(): boolean {
    if (this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireASS()
      && this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireAAH()) {
      return this.isSalaireM0DisplayPourASS() || this.isSalaireM0DisplayPourAAH();
    } else {
      if (this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireASS()) {
        return this.isSalaireM0DisplayPourASS();
      }
      if (this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireAAH()) {
        return this.isSalaireM0DisplayPourAAH();
      }
    }

  }

  public afficherSalaireM1(): boolean {
    if (this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireASS()
      && this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireAAH()) {
        return this.isSalaireM1DisplayPourASS() || this.isSalaireM1DisplayPourAAH();
    } else {
      if (this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireASS()) {
        return this.isSalaireM1DisplayPourASS();
      }
      if (this.deConnecteBenefiaireAidesSocialesService.isBeneficiaireAAH()) {
        return this.isSalaireM1DisplayPourAAH();
      }
    }

  }

  private isSalaireM0DisplayPourASS(): boolean {
    return this.ressourcesFinancieres.salairesAvantPeriodeSimulation
      && (this.ressourcesFinancieres.allocationsPoleEmploi.nombreMoisCumulesAssEtSalaire == 3
        || this.ressourcesFinancieres.allocationsPoleEmploi.nombreMoisCumulesAssEtSalaire == 2);
  }

  private isSalaireM0DisplayPourAAH(): boolean {
    return this.ressourcesFinancieres.salairesAvantPeriodeSimulation
      && this.ressourcesFinancieres.hasTravailleAuCours6DerniersMois
      && this.ressourcesFinancieres.nombreMoisTravailles6DerniersMois > 0
  }

  private isSalaireM1DisplayPourAAH(): boolean {
    return this.ressourcesFinancieres.salairesAvantPeriodeSimulation
      && this.ressourcesFinancieres.hasTravailleAuCours6DerniersMois
      && this.ressourcesFinancieres.nombreMoisTravailles6DerniersMois > 0
  }

  private isSalaireM1DisplayPourASS(): boolean {
    return this.ressourcesFinancieres.salairesAvantPeriodeSimulation
      && this.ressourcesFinancieres.allocationsPoleEmploi.nombreMoisCumulesAssEtSalaire == 3
  }

  private isDonneesASSSaisiesValide(): boolean {
    return this.dateUtileService.isDateDecomposeeSaisieAvecInferieurDateJourValide(this.dateDernierOuvertureDroitASS)
    && this.ressourcesFinancieresUtileService.isNombreMoisCumulAssSalaireSelectedValide(this.ressourcesFinancieres)
    && !this.ressourcesFinancieresUtileService.isMontantJournalierAssInvalide(this.ressourcesFinancieres);
  }

  private isDonneesAAHSaisiesValides(): boolean {
    return this.ressourcesFinancieresUtileService.isNombreMoisTravailleAuCours6DerniersMoisSelectedValide(this.ressourcesFinancieres);
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
