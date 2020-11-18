import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { SituationPersonneEnum } from '@app/commun/enumerations/situations-personne.enum';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { Personne } from '@models/personne';
import { PersonneDTO } from '@app/commun/models/dto/personne-dto';
import { FormGroup, NgForm } from '@angular/forms';
import { DateUtileService } from '@app/core/services/utile/date-util.service';

@Component({
  selector: 'app-ressources-financieres-personnes-a-charge',
  templateUrl: './ressources-financieres-personnes-a-charge.component.html',
  styleUrls: ['./ressources-financieres-personnes-a-charge.component.scss']
})
export class RessourcesFinancieresPersonnesAChargeComponent implements OnInit {

  personnesDTO: Array<PersonneDTO>;
  isRessourcesFinancieresPersonnesChargeFormSubmitted: boolean;
  situationPersonneEnum: typeof SituationPersonneEnum = SituationPersonneEnum;

  @ViewChild('ressourcesFinancieresPersonnesChargeForm', { read: NgForm }) ressourcesFinancieresPersonnesChargeForm:FormGroup;

  @Output() validationRessourcesPersonnesAChargeEventEmitter = new EventEmitter<void>();

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public dateUtileService: DateUtileService,
    public demandeurEmploiConnecteService : DemandeurEmploiConnecteService,
    public personneUtileService: PersonneUtileService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  public onSubmitRessourcesFinancieresPersonnesChargeForm(form: FormGroup): void {
    if(form.valid) {
      this.demandeurEmploiConnecteService.modifierRessourcesFinancierePersonnesCharge(this.personnesDTO);
      this.validationRessourcesPersonnesAChargeEventEmitter.emit();
    }
  }

  public filtrerPersonnesACharge(personne: Personne): boolean {
    const test = this.personneUtileService;
    return test.hasRessourcesFinancieres(personne);
  }

  private loadData(): void {
    this.personnesDTO = new Array<PersonneDTO>();
    const demandeurConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    demandeurConnecte.situationFamiliale.personnesACharge.forEach((personne, index) => {
      if(this.personneUtileService.hasRessourcesFinancieres(personne)) {
        const personneDTO = new PersonneDTO();
        personneDTO.index = index;
        personneDTO.personne = personne;
        this.personnesDTO.push(personneDTO);
      }
    });
  }
}
