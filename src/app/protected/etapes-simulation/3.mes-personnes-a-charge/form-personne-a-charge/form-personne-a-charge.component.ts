import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DateDecomposee } from '@models/date-decomposee';
import { Personne } from '@models/personne';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { AllocationsCAF } from '@models/allocations-caf';
import { AllocationsPoleEmploi } from '@models/allocations-pole-emploi';
import { AllocationsCPAM } from '@app/commun/models/allocations-cpam';

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
      this.ajoutNouvellePersonneEventEmitter.emit(true);
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement(this.elementRef);
    }
  }

  public onClickButtonAnnuler(): void {
    this.resetNouvellePersonneAChargeForm();
    this.ajoutNouvellePersonneEventEmitter.emit(false);
  }

  public gererAffichageNouvellePersonneSituationForm(): void {
    this.isNouvellePersonneAChargeSituationFormGroupDisplay  = false;
    if (this.dateUtileService.isDateValide(this.dateNaissanceNouvellePersonne)) {
      if(this.personneUtileService.isAgeLegalPourTravailler(this.dateNaissanceNouvellePersonne)) {
        this.isNouvellePersonneAChargeSituationFormGroupDisplay  = true;
        if(!this.nouvellePersonneACharge.ressourcesFinancieres) {
          this.creerRessourcesFinancieres();
        }
      } else {
        this.unsetRessourcesFinancieres();
      }
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
    || this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireAAH
    || this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireARE
    || this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireASS
    || this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireRSA
    || this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiairePensionInvalidite;
  }

  private unsetRessourcesFinancieres(): void {
    if(this.nouvellePersonneACharge.ressourcesFinancieres) {
      this.nouvellePersonneACharge.ressourcesFinancieres = null;
    }
    this.resetInformationsPersonnelles();
    this.resetBeneficiaireAidesSociales();
  }

  private creerRessourcesFinancieres(): void {
    this.nouvellePersonneACharge.ressourcesFinancieres = new RessourcesFinancieres();
    this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF = new AllocationsCAF();
    this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi = new AllocationsPoleEmploi();
    this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCPAM = new AllocationsCPAM();
    this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCPAM.allocationSupplementaireInvalidite = 0;
  }

  private resetInformationsPersonnelles(): void {
    if(this.nouvellePersonneACharge.informationsPersonnelles) {
      this.nouvellePersonneACharge.informationsPersonnelles.salarie = false;
      this.nouvellePersonneACharge.informationsPersonnelles.sansRessource = false;
      this.nouvellePersonneACharge.informationsPersonnelles.createurEntreprise = false;
      this.nouvellePersonneACharge.informationsPersonnelles.hasRevenusImmobilier = false;
     }
  }

  private resetBeneficiaireAidesSociales(): void {
    if(this.nouvellePersonneACharge.beneficiaireAidesSociales) {
      this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireAAH = false;
      this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireARE = false;
      this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireASS = false;
      this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiaireRSA = false;
      this.nouvellePersonneACharge.beneficiaireAidesSociales.beneficiairePensionInvalidite = false;
    }
  }
}
