import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { RessourcesFinancieres } from '@app/commun/models/ressources-financieres';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-ressources-financieres-foyer',
  templateUrl: './ressources-financieres-foyer.component.html',
  styleUrls: ['./ressources-financieres-foyer.component.scss']
})
export class RessourcesFinancieresFoyerComponent implements OnInit {

  isRessourcesFinancieresFoyerFormSubmitted = false;

  @ViewChild('ressourcesFinancieresFoyerForm', { read: NgForm }) ressourcesFinancieresFoyerForm:FormGroup;

  @Input() ressourcesFinancieres: RessourcesFinancieres;

  @Output() validationRessourcesFoyerEventEmitter = new EventEmitter<void>();

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public demandeurEmploiConnecteService: DemandeurEmploiConnecteService
  ) {

  }

  ngOnInit(): void {
  }

  public onSubmitRessourcesFinancieresFoyerForm(form: FormGroup): void {
    if(form.valid) {
      this.demandeurEmploiConnecteService.setRessourcesFinancieres(this.ressourcesFinancieres);
      this.validationRessourcesFoyerEventEmitter.emit();
    }
  }

}
