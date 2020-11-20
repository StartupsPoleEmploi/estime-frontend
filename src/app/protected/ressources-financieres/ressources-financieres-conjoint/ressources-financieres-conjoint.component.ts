import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Personne } from '@app/commun/models/personne';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';

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
    private deConnecteService: DeConnecteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.conjoint = demandeurEmploiConnecte.situationFamiliale.conjoint;
  }


  onSubmitRessourcesFinancieresConjointForm(form: FormGroup) {
    this.isRessourcesFinancieresConjointFormSubmitted = true;
    if(form.valid) {
      this.deConnecteService.setConjointRessourcesFinancieres(this.conjoint);
      this.validationRessourcesConjointEventEmitter.emit();
    }
  }
}
