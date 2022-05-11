import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { SituationPersonneEnum } from '@app/commun/enumerations/situations-personne.enum';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { PersonneDTO } from '@models/dto/personne-dto';
import { FormGroup, NgForm } from '@angular/forms';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { NombreMoisTravailles } from '@app/commun/models/nombre-mois-travailles';
import { RessourcesFinancieresAvantSimulationUtileService } from '@app/core/services/utile/ressources-financieres-avant-simulation-utile.service';
import { Personne } from '@app/commun/models/personne';
import { DeConnecteRessourcesFinancieresAvantSimulationService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';

@Component({
  selector: 'app-ressources-financieres-personnes-a-charge',
  templateUrl: './ressources-financieres-personnes-a-charge.component.html',
  styleUrls: ['./ressources-financieres-personnes-a-charge.component.scss']
})
export class RessourcesFinancieresPersonnesAChargeComponent implements OnInit {

  personnesDTO: Array<PersonneDTO>;
  isRessourcesFinancieresPersonnesChargeFormSubmitted: boolean;
  situationPersonneEnum: typeof SituationPersonneEnum = SituationPersonneEnum;

  erreurSaisieSalaires: boolean;

  optionsNombreMoisTravailles: Array<NombreMoisTravailles>;

  @ViewChild('ressourcesFinancieresPersonnesChargeForm', { read: NgForm }) ressourcesFinancieresPersonnesChargeForm: FormGroup;

  @Output() validationRessourcesPersonnesAChargeEventEmitter = new EventEmitter<void>();

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public dateUtileService: DateUtileService,
    private deConnecteRessourcesFinancieresAvantSimulationService: DeConnecteRessourcesFinancieresAvantSimulationService,
    public deConnecteService: DeConnecteService,
    public screenService: ScreenService,
    private elementRef: ElementRef,
    public personneUtileService: PersonneUtileService,
    private ressourcesFinancieresAvantSimulationUtileService: RessourcesFinancieresAvantSimulationUtileService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  public personneRecoitRSASeulement(personneDTO: PersonneDTO): boolean {
    let result = false;
    const personne = personneDTO.personne;
    if (personne.beneficiaireAides.beneficiaireRSA
      && !personne.informationsPersonnelles.salarie
      && !personne.beneficiaireAides.beneficiaireAAH
      && !personne.beneficiaireAides.beneficiaireARE
      && !personne.beneficiaireAides.beneficiaireASS
      && !personne.beneficiaireAides.beneficiairePensionInvalidite
      && personne.ressourcesFinancieresAvantSimulation.aidesCPAM.allocationSupplementaireInvalidite === 0
      && !personne.informationsPersonnelles.microEntrepreneur
      && !personne.informationsPersonnelles.travailleurIndependant
      && !personne.informationsPersonnelles.hasPensionRetraite) {
      result = true;
    }
    return result;
  }

  public onSubmitRessourcesFinancieresPersonnesChargeForm(form: FormGroup): void {
    this.isRessourcesFinancieresPersonnesChargeFormSubmitted = true;
    if (this.isDonneesSaisiesFormulaireValides(form)) {
      this.deConnecteService.setPersonnesChargeRessourcesFinancieres(this.personnesDTO);
      this.validationRessourcesPersonnesAChargeEventEmitter.emit();
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement();
    }
  }

  private isDonneesSaisiesFormulaireValides(form: FormGroup): boolean {
    let isValide = form.valid;
    if (isValide) {
      this.personnesDTO.forEach((personneDTO) => {
        let personneDTOValide = this.personneUtileService.isRessourcesFinancieresAvantSimulationValides(personneDTO.personne);
        // on vérifie si lorsque le formulaire est valide au niveau des données la saisie des champs salaires est valide également
        if (personneDTOValide) {
          personneDTOValide = this.deConnecteRessourcesFinancieresAvantSimulationService.isChampsSalairesValides(personneDTO.personne.ressourcesFinancieresAvantSimulation);
          this.erreurSaisieSalaires = !personneDTOValide;
        }
        if (!personneDTOValide) {
          isValide = false;
        }
      });
    }
    return isValide;
  }

  private loadData(): void {
    this.optionsNombreMoisTravailles = this.ressourcesFinancieresAvantSimulationUtileService.initOptionsNombreMoisTravailles();
    this.personnesDTO = new Array<PersonneDTO>();
    const demandeurConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    demandeurConnecte.situationFamiliale.personnesACharge.forEach((personne, index) => {
      if (this.personneUtileService.isAgeLegalPourTravaillerFromPersonne(personne)) {
        const personneDTO = new PersonneDTO();
        personneDTO.index = index;
        personneDTO.personne = personne;
        this.personnesDTO.push(personneDTO);
      }
    });
  }

  public onClickButtonRadioHasTravailleAuCoursDerniersMoisPersonne(personne: Personne, hasTravailleAuCoursDerniersMois: boolean): void {
    if (hasTravailleAuCoursDerniersMois === false) {
      personne.ressourcesFinancieresAvantSimulation.nombreMoisTravaillesDerniersMois = 0;
      personne.ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation = null;
      personne.ressourcesFinancieresAvantSimulation.hasTravailleAuCoursDerniersMois = false;
      this.personneUtileService.unsetSalairesAvantPeriodeSimulation(personne);
    } else {
      if (personne.ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation == null) {
        personne.ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation = this.ressourcesFinancieresAvantSimulationUtileService.creerSalairesAvantPeriodeSimulationPersonne(personne);
      }
      if (this.optionsNombreMoisTravailles == null) {
        this.optionsNombreMoisTravailles = this.ressourcesFinancieresAvantSimulationUtileService.initOptionsNombreMoisTravailles();
      }
    }
  }

  public isAfficherChampsSalairesPersonne(personne: Personne): boolean {
    return personne.ressourcesFinancieresAvantSimulation.hasTravailleAuCoursDerniersMois;
  }

  public hasDouzeMoisSansSalaire(personne: Personne): boolean {
    const isNull = (mois) => mois == null;
    return (personne.ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation == null
      || personne.ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation.mois.every(isNull));
  }

  public handleKeyUpOnButtonRadioHasTravailleAuCoursDerniersMoisPersonne(personne: Personne, event: any, value: boolean) {
    if (event.keyCode === 13) {
      personne.ressourcesFinancieresAvantSimulation.hasTravailleAuCoursDerniersMois = value;
      this.onClickButtonRadioHasTravailleAuCoursDerniersMoisPersonne(personne, value);
    }
  }
}
