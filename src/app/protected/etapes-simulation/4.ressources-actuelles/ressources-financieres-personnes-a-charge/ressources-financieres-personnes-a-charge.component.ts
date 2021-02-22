import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { SituationPersonneEnum } from '@app/commun/enumerations/situations-personne.enum';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { Personne } from '@models/personne';
import { PersonneDTO } from '@models/dto/personne-dto';
import { FormGroup, NgForm } from '@angular/forms';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';

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
    public deConnecteService : DeConnecteService,
    private elementRef: ElementRef,
    public personneUtileService: PersonneUtileService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  public onSubmitRessourcesFinancieresPersonnesChargeForm(form: FormGroup): void {
    this.isRessourcesFinancieresPersonnesChargeFormSubmitted = true;
    if(this.isDonneesSaisiesFormulaireValides(form)) {
      this.deConnecteService.setPersonnesChargeRessourcesFinancieres(this.personnesDTO);
      this.validationRessourcesPersonnesAChargeEventEmitter.emit();
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement(this.elementRef);
    }
  }

  private isDonneesSaisiesFormulaireValides(form: FormGroup): boolean {
    let isValide = form.valid;
    if(isValide) {
      this.personnesDTO.forEach((personneDTO) => {
        const personneDTOValide = this.personneUtileService.isRessourcesFinancieresValides(personneDTO.personne);
        if(!personneDTOValide) {
          isValide = false;
        }
      });
    }
    return isValide;
  }

  private loadData(): void {
    this.personnesDTO = new Array<PersonneDTO>();
    const demandeurConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
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
