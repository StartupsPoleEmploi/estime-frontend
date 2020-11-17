import { Component, OnInit, Input } from '@angular/core';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { RessourcesFinancieres } from '@app/commun/models/ressources-financieres';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ressources-financieres-foyer',
  templateUrl: './ressources-financieres-foyer.component.html',
  styleUrls: ['./ressources-financieres-foyer.component.scss']
})
export class RessourcesFinancieresFoyerComponent implements OnInit {

  isRessourcesFinancieresFoyerFormSubmitted = false;

  @Input() ressourcesFinancieres: RessourcesFinancieres;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public demandeurEmploiConnecteService: DemandeurEmploiConnecteService
  ) {

  }

  ngOnInit(): void {
  }

  public onSubmitRessourcesFinancieresFoyerForm(form: FormGroup): void {

  }

}
