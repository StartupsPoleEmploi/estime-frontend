import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DateDecomposee } from '@models/date-decomposee';
import { Personne } from '@models/personne';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { AllocationsCAF } from '@models/allocations-caf';
import { AllocationsPoleEmploi } from '@models/allocations-pole-emploi';

@Component({
  selector: 'app-form-personne-a-charge',
  templateUrl: './form-personne-a-charge.component.html',
  styleUrls: ['./form-personne-a-charge.component.scss']
})
export class FormPersonneAChargeComponent implements OnInit {

  isNouvellePersonneAChargeSituationFormGroupDisplay = false;
  isNouvellePersonnesAChargeFormSubmitted = false;
  isSituationNotValide = false;

  @Input() dateNaissanceNouvellePersonne: DateDecomposee;
  @Input() isModeModification: boolean;
  @Input() nouvellePersonneACharge: Personne;
  @Input() numeroNouvellePersonne: number;

  @Output() ajoutNouvellePersonneEventEmitter = new EventEmitter<boolean>();

  //récupération d'éléments HTML
  @ViewChild('moisDateNaissanceNouvellePersonne', { read: ElementRef }) moisDateNaissanceNouvellePersonneInput: ElementRef;
  @ViewChild('anneeDateNaissanceNouvellePersonne', { read: ElementRef }) anneeDateNaissanceNouvellePersonneInput: ElementRef;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    private dateUtileService: DateUtileService,
    public personneUtileService: PersonneUtileService
  ) { }

  ngOnInit(): void {
    this.isNouvellePersonneAChargeSituationFormGroupDisplay = this.isNouvellePersonneSituationFormDisplay();
  }

  public onSubmitNouvellePersonneAChargeForm(form: FormGroup): void {
    this.isNouvellePersonnesAChargeFormSubmitted = true;
    this.checkAndSaveDateNaissanceNouvellePersonneConnecte();
    if (this.isDonneesFormulaireNouvellePersonneValides(form)) {
      this.resetNouvellePersonneAChargeForm();
      this.ajoutNouvellePersonneEventEmitter.emit(true);
    }
  }

  public onClickButtonAnnuler(): void {
    this.resetNouvellePersonneAChargeForm();
    this.ajoutNouvellePersonneEventEmitter.emit(false);
  }

  public isNouvellePersonneSituationFormDisplay(): boolean {
    let isNouvellePersonneSituationFormDisplay = false;
    if (this.dateUtileService.isFormatDateValide(this.dateNaissanceNouvellePersonne)) {
      if(this.personneUtileService.isAgeLegalPourTravailler(this.dateNaissanceNouvellePersonne)) {
        isNouvellePersonneSituationFormDisplay = true;
        if(!this.nouvellePersonneACharge.ressourcesFinancieres) {
          this.creerRessourcesFinancieres();
        }
      } else {
        this.unsetRessourcesFinancieres();
      }
    }
    return isNouvellePersonneSituationFormDisplay;
  }

  private resetNouvellePersonneAChargeForm(): void {
    this.isNouvellePersonneAChargeSituationFormGroupDisplay = false;
    this.isNouvellePersonnesAChargeFormSubmitted = false;
  }

  private checkAndSaveDateNaissanceNouvellePersonneConnecte(): void {
    this.dateNaissanceNouvellePersonne.messageErreurFormat = this.dateUtileService.checkFormat(this.dateNaissanceNouvellePersonne);
    if (this.dateUtileService.isDateDecomposeeSaisieValide(this.dateNaissanceNouvellePersonne)) {
      this.nouvellePersonneACharge.informationsPersonnelles.dateNaissance = this.dateUtileService.getStringDateFromDateDecomposee(this.dateNaissanceNouvellePersonne);
    }
  }

  private isDonneesFormulaireNouvellePersonneValides(form: FormGroup): boolean {
    this.isSituationNotValide = !this.isSituationValide();
    return form.valid
    && this.dateUtileService.isDateDecomposeeSaisieValide(this.dateNaissanceNouvellePersonne)
    && (!this.isNouvellePersonneAChargeSituationFormGroupDisplay
      || (this.isNouvellePersonneAChargeSituationFormGroupDisplay && !this.isSituationNotValide))
  }

  private isSituationValide(): boolean {
    return this.nouvellePersonneACharge.informationsPersonnelles.salarie
    || this.nouvellePersonneACharge.informationsPersonnelles.sansRessource
    || this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireAAH
    || this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireARE
    || this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireASS
    || this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireRSA;
  }

  private unsetRessourcesFinancieres(): void {
    this.nouvellePersonneACharge.ressourcesFinancieres = null;
    this.nouvellePersonneACharge.informationsPersonnelles.salarie = false;
    this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
    this.nouvellePersonneACharge.informationsPersonnelles.createurEntreprise = false;
    this.nouvellePersonneACharge.informationsPersonnelles.hasRevenusImmobilier = false;
  }

  private creerRessourcesFinancieres(): void {
    this.nouvellePersonneACharge.ressourcesFinancieres = new RessourcesFinancieres();
    this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF = new AllocationsCAF();
    this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi = new AllocationsPoleEmploi();
  }

  /** gestion évènements champ date naissance personne à charge **/

  public onChangeOrKeyUpDateNaissancePersonneAChargeJour(event): void {
    event.stopPropagation();
    const value = this.dateNaissanceNouvellePersonne.jour;
    if (value && value.length === 2) {
      this.isNouvellePersonneAChargeSituationFormGroupDisplay = this.isNouvellePersonneSituationFormDisplay();
      this.moisDateNaissanceNouvellePersonneInput.nativeElement.focus();
    }
  }

  public onChangeOrKeyUpDateNaissancePersonneAChargeMois(event): void {
    event.stopPropagation();
    const value = this.dateNaissanceNouvellePersonne.mois;
    if (value && value.length === 2) {
      this.isNouvellePersonneAChargeSituationFormGroupDisplay = this.isNouvellePersonneSituationFormDisplay();
      this.anneeDateNaissanceNouvellePersonneInput.nativeElement.focus();
    }
  }

  public onChangeOrKeyUpDateNaissancePersonneAChargeAnnee(): void {
    this.isNouvellePersonneAChargeSituationFormGroupDisplay = this.isNouvellePersonneSituationFormDisplay();
  }

  public onFocusDateNaissanceNouvellePersonne(): void {
    this.dateNaissanceNouvellePersonne.messageErreurFormat = undefined;
  }

}
