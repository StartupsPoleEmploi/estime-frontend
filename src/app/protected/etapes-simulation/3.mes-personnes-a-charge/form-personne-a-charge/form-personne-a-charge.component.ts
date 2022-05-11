import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DateDecomposee } from '@models/date-decomposee';
import { Personne } from '@models/personne';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { RessourcesFinancieresAvantSimulation } from '@app/commun/models/ressources-financieres-avant-simulation';
import { AidesCAF } from '@models/aides-caf';
import { AidesPoleEmploi } from '@models/aides-pole-emploi';
import { AidesCPAM } from '@app/commun/models/aides-cpam';
import { DeConnecteSituationFamilialeService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-situation-familiale.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';

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


  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public dateUtileService: DateUtileService,
    private deConnecteService: DeConnecteService,
    private deConnecteSituationFamilialeService: DeConnecteSituationFamilialeService,
    private elementRef: ElementRef,
    public personneUtileService: PersonneUtileService
  ) { }

  ngOnInit(): void {
    this.gererAffichageNouvellePersonneSituationForm();
  }

  public onSubmitNouvellePersonneAChargeForm(form: FormGroup): void {
    this.isNouvellePersonnesAChargeFormSubmitted = true;
    this.checkAndSaveDateNaissanceNouvellePersonneConnecte();
    if (this.isDonneesFormulaireNouvellePersonneValides(form)) {
      this.resetNouvellePersonneAChargeForm();
      if (!this.deConnecteSituationFamilialeService.hasPersonneAChargeMoinsDe3Ans()) {
        this.deConnecteService.unsetAllocationPAJE();
      }
      if (!this.deConnecteSituationFamilialeService.has3PersonnesAChargeEntre3Et21Ans()) {
        this.deConnecteService.unsetComplementFamilial();
      }
      this.deConnecteService.setAidesFamiliales();
      this.ajoutNouvellePersonneEventEmitter.emit(true);
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement();
    }
  }

  public onClickButtonAnnuler(): void {
    this.resetNouvellePersonneAChargeForm();
    this.ajoutNouvellePersonneEventEmitter.emit(false);
  }

  public gererAffichageNouvellePersonneSituationForm(): void {
    this.isNouvellePersonneAChargeSituationFormGroupDisplay = false;
    if (this.dateUtileService.isDateValide(this.dateNaissanceNouvellePersonne)) {
      if (this.personneUtileService.isAgeLegalPourTravaillerFromDateDecomposee(this.dateNaissanceNouvellePersonne)) {
        this.isNouvellePersonneAChargeSituationFormGroupDisplay = true;
        if (!this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation) {
          this.creerRessourcesFinancieres();
        }
      } else {
        this.unsetRessourcesFinancieres();
      }
    }
  }

  public handleKeyUpOnButtonAnnuler(event: any) {
    if (event.keyCode === 13) {
      this.onClickButtonAnnuler();
    }
  }


  private resetNouvellePersonneAChargeForm(): void {
    this.isNouvellePersonneAChargeSituationFormGroupDisplay = false;
    this.isNouvellePersonnesAChargeFormSubmitted = false;
  }

  private checkAndSaveDateNaissanceNouvellePersonneConnecte(): void {
    if (this.dateUtileService.isDateDecomposeeSaisieAvecInferieurDateJourValide(this.dateNaissanceNouvellePersonne)) {
      this.nouvellePersonneACharge.informationsPersonnelles.dateNaissance = this.dateUtileService.getStringDateFromDateDecomposee(this.dateNaissanceNouvellePersonne);
    }
  }

  private isDonneesFormulaireNouvellePersonneValides(form: FormGroup): boolean {
    this.isSituationNotValide = !this.isSituationValide();
    return form.valid
      && this.dateUtileService.isDateDecomposeeSaisieAvecInferieurDateJourValide(this.dateNaissanceNouvellePersonne)
      && (!this.isNouvellePersonneAChargeSituationFormGroupDisplay
        || (this.isNouvellePersonneAChargeSituationFormGroupDisplay && !this.isSituationNotValide))
  }

  private isSituationValide(): boolean {
    return this.nouvellePersonneACharge.informationsPersonnelles.salarie
      || this.nouvellePersonneACharge.informationsPersonnelles.sansRessource
      || this.nouvellePersonneACharge.beneficiaireAides.beneficiaireAAH
      || this.nouvellePersonneACharge.beneficiaireAides.beneficiaireARE
      || this.nouvellePersonneACharge.beneficiaireAides.beneficiaireASS
      || this.nouvellePersonneACharge.beneficiaireAides.beneficiaireRSA
      || this.nouvellePersonneACharge.beneficiaireAides.beneficiairePensionInvalidite
      || this.nouvellePersonneACharge.informationsPersonnelles.travailleurIndependant
      || this.nouvellePersonneACharge.informationsPersonnelles.microEntrepreneur
      || this.nouvellePersonneACharge.informationsPersonnelles.hasPensionRetraite;
  }

  private unsetRessourcesFinancieres(): void {
    if (this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation) {
      this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation = null;
    }
    this.resetInformationsPersonnelles();
    this.resetBeneficiaireAides();
  }

  private creerRessourcesFinancieres(): void {
    this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation = new RessourcesFinancieresAvantSimulation();
    this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCAF = new AidesCAF();
    this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesPoleEmploi = new AidesPoleEmploi();
    this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCPAM = new AidesCPAM();
    this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.aidesCPAM.allocationSupplementaireInvalidite = 0;
    this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.revenusImmobilier3DerniersMois = 0;
    this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.chiffreAffairesIndependantDernierExercice = 0;
    this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.beneficesMicroEntrepriseDernierExercice = 0;
    this.nouvellePersonneACharge.ressourcesFinancieresAvantSimulation.pensionRetraite = 0;
  }

  private resetInformationsPersonnelles(): void {
    if (this.nouvellePersonneACharge.informationsPersonnelles) {
      this.nouvellePersonneACharge.informationsPersonnelles.salarie = false;
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
      this.nouvellePersonneACharge.informationsPersonnelles.travailleurIndependant = false;
      this.nouvellePersonneACharge.informationsPersonnelles.microEntrepreneur = false;
      this.nouvellePersonneACharge.informationsPersonnelles.hasRevenusImmobilier = false;
    }
  }

  private resetBeneficiaireAides(): void {
    if (this.nouvellePersonneACharge.beneficiaireAides) {
      this.nouvellePersonneACharge.beneficiaireAides.beneficiaireAAH = false;
      this.nouvellePersonneACharge.beneficiaireAides.beneficiaireARE = false;
      this.nouvellePersonneACharge.beneficiaireAides.beneficiaireASS = false;
      this.nouvellePersonneACharge.beneficiaireAides.beneficiaireRSA = false;
      this.nouvellePersonneACharge.beneficiaireAides.beneficiairePensionInvalidite = false;
    }
  }
}
