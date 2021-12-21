import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Personne } from '@models/personne';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { RessourcesFinancieresUtileService } from '@app/core/services/utile/ressources-financieres-utiles.service';
import { NombreMoisTravailles } from '@app/commun/models/nombre-mois-travailles';
import { DeConnecteRessourcesFinancieresService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';

@Component({
  selector: 'app-ressources-financieres-conjoint',
  templateUrl: './ressources-financieres-conjoint.component.html',
  styleUrls: ['./ressources-financieres-conjoint.component.scss']
})
export class RessourcesFinancieresConjointComponent implements OnInit {

  conjoint: Personne;
  isRessourcesFinancieresConjointFormSubmitted = false;
  optionsNombreMoisTravailles: Array<NombreMoisTravailles>;

  erreurSaisieSalaires: boolean;

  @ViewChild('ressourcesFinancieresConjointForm', { read: NgForm }) ressourcesFinancieresConjointForm: FormGroup;

  @Output() validationRessourcesConjointEventEmitter = new EventEmitter<void>();

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public screenService: ScreenService,
    private deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    private deConnecteService: DeConnecteService,
    private elementRef: ElementRef,
    private personneUtileService: PersonneUtileService,
    public ressourcesFinancieresUtileService: RessourcesFinancieresUtileService
  ) { }

  ngOnInit(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.conjoint = demandeurEmploiConnecte.situationFamiliale.conjoint;
    this.optionsNombreMoisTravailles = this.ressourcesFinancieresUtileService.initOptionsNombreMoisTravailles();
  }

  public onSubmitRessourcesFinancieresConjointForm(form: FormGroup): void {
    this.isRessourcesFinancieresConjointFormSubmitted = true;
    if (this.isDonneesSaisiesFormulaireValides(form)) {
      this.deConnecteService.setConjointRessourcesFinancieres(this.conjoint);
      this.validationRessourcesConjointEventEmitter.emit();
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement(this.elementRef);
    }
  }

  private isDonneesSaisiesFormulaireValides(form: FormGroup): boolean {
    let isValide = form.valid;
    if (isValide) {
      isValide = this.personneUtileService.isRessourcesFinancieresValides(this.conjoint);
      // on vérifie si lorsque le formulaire est valide au niveau des données la saisie des champs salaires est valide également
      if (isValide) {
        isValide = this.deConnecteRessourcesFinancieresService.isChampsSalairesValides(this.conjoint.ressourcesFinancieres);
        if (!isValide) this.erreurSaisieSalaires = true;
      }
    }
    return isValide;
  }


  public onClickButtonRadioHasTravailleAuCoursDerniersMoisConjoint(hasTravailleAuCoursDerniersMois: boolean): void {
    if (hasTravailleAuCoursDerniersMois === false) {
      this.conjoint.ressourcesFinancieres.nombreMoisTravaillesDerniersMois = 0;
      this.conjoint.ressourcesFinancieres.periodeTravailleeAvantSimulation = null;
      this.conjoint.ressourcesFinancieres.hasTravailleAuCoursDerniersMois = false;
      this.personneUtileService.unsetSalairesAvantPeriodeSimulation(this.conjoint);
    } else {
      if (this.conjoint.ressourcesFinancieres.periodeTravailleeAvantSimulation == null) {
        this.conjoint.ressourcesFinancieres.periodeTravailleeAvantSimulation = this.ressourcesFinancieresUtileService.creerSalairesAvantPeriodeSimulationPersonne(this.conjoint);
      }
      if (this.optionsNombreMoisTravailles == null) {
        this.optionsNombreMoisTravailles = this.ressourcesFinancieresUtileService.initOptionsNombreMoisTravailles();
      }
    }
  }

  public isAfficherChampsSalairesConjoint(): boolean {
    return this.conjoint.ressourcesFinancieres.hasTravailleAuCoursDerniersMois;
  }

  public hasDouzeMoisSansSalaireConjoint(): boolean {
    const isNull = (mois) => mois == null;
    return (this.conjoint.ressourcesFinancieres.periodeTravailleeAvantSimulation == null
      || this.conjoint.ressourcesFinancieres.periodeTravailleeAvantSimulation.mois.every(isNull));
  }

  public handleKeyUpOnButtonRadioHasTravailleAuCoursDerniersMoisConjoint(event: any, value: boolean) {
    if (event.keyCode === 13) {
      this.conjoint.ressourcesFinancieres.hasTravailleAuCoursDerniersMois = value;
      this.onClickButtonRadioHasTravailleAuCoursDerniersMoisConjoint(value);
    }
  }
}
