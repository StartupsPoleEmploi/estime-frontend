import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { FormGroup, NgForm } from '@angular/forms';
import { DeConnecteSituationFamilialeService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-situation-familiale.service";

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
    public deConnecteService: DeConnecteService,
    public deConnecteSituationFamilialeService: DeConnecteSituationFamilialeService,
    public dateUtileService: DateUtileService,
    private elementRef: ElementRef,
  ) {

  }

  ngOnInit(): void {
  }

  public onSubmitRessourcesFinancieresFoyerForm(form: FormGroup): void {
    if(form.valid) {
      this.deConnecteService.setRessourcesFinancieres(this.ressourcesFinancieres);
      this.validationRessourcesFoyerEventEmitter.emit();
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement(this.elementRef);
    }
  }

}
