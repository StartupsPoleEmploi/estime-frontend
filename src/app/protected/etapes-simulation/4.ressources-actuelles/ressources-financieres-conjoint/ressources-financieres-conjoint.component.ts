import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Personne } from '@models/personne';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-ressources-financieres-conjoint',
  templateUrl: './ressources-financieres-conjoint.component.html',
  styleUrls: ['./ressources-financieres-conjoint.component.scss']
})
export class RessourcesFinancieresConjointComponent implements OnInit {

  conjoint: Personne;
  isRessourcesFinancieresConjointFormSubmitted = false;

  @ViewChild('ressourcesFinancieresConjointForm', { read: NgForm }) ressourcesFinancieresConjointForm:FormGroup;

  @Output() validationRessourcesConjointEventEmitter = new EventEmitter<void>();

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public screenService: ScreenService,
    private deConnecteService: DeConnecteService,
    private elementRef: ElementRef,
    private personneUtileService: PersonneUtileService
  ) { }

  ngOnInit(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.conjoint = demandeurEmploiConnecte.situationFamiliale.conjoint;
  }

  public onSubmitRessourcesFinancieresConjointForm(form: FormGroup): void {
    this.isRessourcesFinancieresConjointFormSubmitted = true;
    if(this.isDonneesSaisiesFormulaireValides(form)) {
      this.deConnecteService.setConjointRessourcesFinancieres(this.conjoint);
      this.validationRessourcesConjointEventEmitter.emit();
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement(this.elementRef);
    }
  }

  private isDonneesSaisiesFormulaireValides(form: FormGroup): boolean {
    let isValide = form.valid;
    if(isValide) {
      isValide = this.personneUtileService.isRessourcesFinancieresValides(this.conjoint);
    }
    return isValide;
  }
}
