import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Personne } from '@app/commun/models/personne';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { DateDecomposee } from '@app/commun/models/date-decomposee';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { SituationPersonneEnum } from '@app/commun/enumerations/situations-personne.enum';

@Component({
  selector: 'app-form-personne-a-charge',
  templateUrl: './form-personne-a-charge.component.html',
  styleUrls: ['./form-personne-a-charge.component.scss']
})
export class FormPersonneAChargeComponent implements OnInit {

  @Input() dateNaissanceNouvellePersonne: DateDecomposee;
  @Input() nouvellePersonneACharge: Personne;
  @Input() numeroNouvellePersonne: number;

  @Output() ajoutNouvellePersonneEventEmitter = new EventEmitter<boolean>();

  isNouvellePersonneAChargeSituationFormGroupDisplay = false;
  isNouvellePersonnesAChargeFormSubmitted = false;

  @ViewChild('moisDateNaissanceNouvellePersonne', { read: ElementRef }) moisDateNaissanceNouvellePersonneInput: ElementRef;
  @ViewChild('anneeDateNaissanceNouvellePersonne', { read: ElementRef }) anneeDateNaissanceNouvellePersonneInput: ElementRef;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    private dateUtileService: DateUtileService,
    public personneUtileService: PersonneUtileService
  ) { }

  ngOnInit(): void {
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

  private checkAndSaveDateNaissanceNouvellePersonneConnecte(): void {
    this.dateNaissanceNouvellePersonne.messageErreurFormat = this.dateUtileService.checkFormat(this.dateNaissanceNouvellePersonne);
    if (this.dateUtileService.isDateDecomposeeSaisieValide(this.dateNaissanceNouvellePersonne)) {
      this.nouvellePersonneACharge.informationsPersonnelles.dateNaissance = this.dateUtileService.getStringDateFromDateDecomposee(this.dateNaissanceNouvellePersonne);
    }
  }

  private isDonneesFormulaireNouvellePersonneValides(form: FormGroup): boolean {
    return form.valid && this.dateUtileService.isDateDecomposeeSaisieValide(this.dateNaissanceNouvellePersonne)
      && (!this.isNouvellePersonneAChargeSituationFormGroupDisplay
        || (this.isNouvellePersonneAChargeSituationFormGroupDisplay
          && this.personneUtileService.isSituationCorrect(this.nouvellePersonneACharge)))
  }

  private gererAffichageNouvellePersonneSituationForm(): void {
    if (this.dateUtileService.isFormatDateValide(this.dateNaissanceNouvellePersonne)
      && this.personneUtileService.isAgeLegalPourTravailler(this.dateNaissanceNouvellePersonne)) {
      this.isNouvellePersonneAChargeSituationFormGroupDisplay = true;
    } else {
      this.isNouvellePersonneAChargeSituationFormGroupDisplay = false;
    }
  }

  private resetNouvellePersonneAChargeForm(): void {
    this.isNouvellePersonneAChargeSituationFormGroupDisplay = false;
    this.isNouvellePersonnesAChargeFormSubmitted = false;
  }

  /** gestion évènements champ date naissance personne à charge **/

  public onChangeOrKeyUpDateNaissancePersonneAChargeJour(event): void {
    event.stopPropagation();
    const value = this.dateNaissanceNouvellePersonne.jour;
    if (value && value.length === 2) {
      this.gererAffichageNouvellePersonneSituationForm();
      this.moisDateNaissanceNouvellePersonneInput.nativeElement.focus();
    }
  }

  public onChangeOrKeyUpDateNaissancePersonneAChargeMois(event): void {
    event.stopPropagation();
    const value = this.dateNaissanceNouvellePersonne.mois;
    if (value && value.length === 2) {
      this.gererAffichageNouvellePersonneSituationForm();
      this.anneeDateNaissanceNouvellePersonneInput.nativeElement.focus();
    }
  }

  public onChangeOrKeyUpDateNaissancePersonneAChargeAnnee(): void {
    this.gererAffichageNouvellePersonneSituationForm();
  }

  public onFocusDateNaissanceNouvellePersonne(): void {
    this.dateNaissanceNouvellePersonne.messageErreurFormat = undefined;
  }

}
