import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { Router } from '@angular/router';
import { RoutesEnum } from '@enumerations/routes.enum';
import { FormGroup } from '@angular/forms';
import { Personne } from '@models/personne';
import { DateDecomposee } from '@models/date-decomposee';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { PersonneUtileService } from "@app/core/services/utile/personne-utile.service";
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { AllocationsCAF } from '@models/allocations-caf';
import { AllocationsPoleEmploi } from '@models/allocations-pole-emploi';
import { SituationPersonneEnum } from '@enumerations/situations-personne.enum';

@Component({
  selector: 'app-mes-personnes-a-charge',
  templateUrl: './mes-personnes-a-charge.component.html',
  styleUrls: ['./mes-personnes-a-charge.component.scss']
})
export class MesPersonnesAChargeComponent implements OnInit {

  dateNaissanceNouvellePersonne: DateDecomposee;
  isModeModification = false;
  isNouvellePersonneAChargeFormDisplay = false;
  isNouvellePersonneAChargeSituationFormGroupDisplay = false;
  isNouvellePersonnesAChargeFormSubmitted = false;
  personnesACharge: Array<Personne>;
  nouvellePersonneACharge: Personne;

  situationPersonneEnum: typeof SituationPersonneEnum = SituationPersonneEnum;

  @ViewChild('moisDateNaissanceNouvellePersonne', { read: ElementRef }) moisDateNaissanceNouvellePersonneInput: ElementRef;
  @ViewChild('anneeDateNaissanceNouvellePersonne', { read: ElementRef }) anneeDateNaissanceNouvellePersonneInput: ElementRef;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    private dateUtileService: DateUtileService,
    private demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    public personneUtileService: PersonneUtileService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDataPersonnesACharge();
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.MES_INFORMATIONS_PERSONNELLES], { replaceUrl: true });
  }

  public onClickButtonSuivant(): void {
    this.router.navigate([RoutesEnum.MES_RESSOURCES_FINANCIERES], { replaceUrl: true });
  }

  public onClickButtonAjouterPersonne(): void {
    this.isNouvellePersonneAChargeFormDisplay = true;
    this.nouvellePersonneACharge = this.personneUtileService.creerPersonne();
    this.dateNaissanceNouvellePersonne = new DateDecomposee();
  }

  public onClickButtonModifierPersonneACharge(personneAModifier: Personne): void {
    this.nouvellePersonneACharge = {...personneAModifier};
    this.dateNaissanceNouvellePersonne = this.dateUtileService.getDateDecomposeeFromStringDate(this.nouvellePersonneACharge.informationsPersonnelles.dateNaissance);
    this.isNouvellePersonneAChargeFormDisplay = true;
    this.isModeModification = true;
    this.gererAffichageNouvellePersonneSituationForm();
  }

  public onClickButtonSupprimerPersonneACharge(index: number): void {
    this.personnesACharge.splice(index, 1);
    this.demandeurEmploiConnecteService.setPersonnesACharge(this.personnesACharge);
  }

  private loadDataPersonnesACharge() {
    const demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    if(demandeurEmploiConnecte.situationFamiliale.personnesACharge) {
      this.personnesACharge = demandeurEmploiConnecte.situationFamiliale.personnesACharge;
    } else {
      this.personnesACharge = new Array<Personne>();
    }
  }

  /*** gestion formulaire ajout d'une nouvelle personne à charge ***/

  public onSubmitNouvellePersonneAChargeForm(form: FormGroup): void {
    this.isNouvellePersonnesAChargeFormSubmitted = true;
    this.checkAndSaveDateNaissanceNouvellePersonneConnecte();
    if (this.isDonneesFormulaireNouvellePersonneValides(form)) {
      if(!this.isModeModification) {
        this.personnesACharge.push(this.nouvellePersonneACharge);
      }
      this.nouvellePersonneACharge.ressourcesFinancieres = this.demandeurEmploiConnecteService.replaceCommaByDotMontantsRessourcesFinancieres(this.nouvellePersonneACharge.ressourcesFinancieres);
      this.demandeurEmploiConnecteService.setPersonnesACharge(this.personnesACharge);
      this.resetNouvellePersonneAChargeForm();
    }
  }

  public onClickButonnAnnuler(): void {
    this.resetNouvellePersonneAChargeForm();
  }

  public onClickCheckBoxIsHandicape(): void {
    if(!this.nouvellePersonneACharge.informationsPersonnelles.isHandicape) {
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = null;
    }
  }

  public onClickCheckBoxIsSalarie(): void {
    this.nouvellePersonneACharge.informationsPersonnelles.isSansEmploi = false;
    this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE = null;
    this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS = null;
    this.nouvellePersonneACharge.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = null;
    if(!this.nouvellePersonneACharge.informationsPersonnelles.isSalarie) {
      this.nouvellePersonneACharge.ressourcesFinancieres.salaireNet = null;
    }
  }

  public onClickCheckBoxIsSansEmploi(): void {
    this.nouvellePersonneACharge.informationsPersonnelles.isSalarie = false;
    this.nouvellePersonneACharge.ressourcesFinancieres.salaireNet = null;
    if(!this.nouvellePersonneACharge.informationsPersonnelles.isSansEmploi) {
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE = null;
      this.nouvellePersonneACharge.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS = null;
    }
  }

  public isSituationNouvellePersonneCorrect(): boolean {
    return this.nouvellePersonneACharge.informationsPersonnelles.isSalarie
    || this.nouvellePersonneACharge.informationsPersonnelles.isSansEmploi;
  }

  private checkAndSaveDateNaissanceNouvellePersonneConnecte(): void {
    this.dateNaissanceNouvellePersonne.messageErreurFormat = this.dateUtileService.checkFormat(this.dateNaissanceNouvellePersonne);
    if (this.dateUtileService.isDateDecomposeeSaisieValide(this.dateNaissanceNouvellePersonne)) {
      this.nouvellePersonneACharge.informationsPersonnelles.dateNaissance = this.dateUtileService.getStringDateFromDateDecomposee(this.dateNaissanceNouvellePersonne);
    }
  }

  private isDonneesFormulaireNouvellePersonneValides(form: FormGroup): boolean {
    return form.valid && this.dateUtileService.isDateDecomposeeSaisieValide(this.dateNaissanceNouvellePersonne)
        && (!this.isNouvellePersonneAChargeSituationFormGroupDisplay || this.isNouvellePersonneAChargeSituationFormGroupDisplay && this.isSituationNouvellePersonneCorrect())
  }

  private gererAffichageNouvellePersonneSituationForm(): void {
    if (this.dateUtileService.isFormatDateValide(this.dateNaissanceNouvellePersonne)
      && this.personneUtileService.isAgeLegalPourTravailler(this.dateNaissanceNouvellePersonne)) {
      this.isNouvellePersonneAChargeSituationFormGroupDisplay = true;
    } else {
      this.isNouvellePersonneAChargeSituationFormGroupDisplay = false;
    }
  }



  private resetNouvellePersonneAChargeForm(): void {
    this.isModeModification = false;
    this.isNouvellePersonneAChargeFormDisplay = false;
    this.isNouvellePersonneAChargeSituationFormGroupDisplay = false;
    this.isNouvellePersonnesAChargeFormSubmitted = false;
  }
  /** gestion évènements champ date naissance personne à charge **/

  public onChangeOrKeyUpDateNaissancePersonneAChargeJour(event): void {
    event.stopPropagation();
    const value = this.dateNaissanceNouvellePersonne.jour;
    if (value && value.length === 2) {
      this.gererAffichageNouvellePersonneSituationForm();
      this.moisDateNaissanceNouvellePersonneInput.nativeElement.focus();
    }
  }

  public onChangeOrKeyUpDateNaissancePersonneAChargeMois(event): void {
    event.stopPropagation();
    const value = this.dateNaissanceNouvellePersonne.mois;
    if (value && value.length === 2) {
      this.gererAffichageNouvellePersonneSituationForm();
      this.anneeDateNaissanceNouvellePersonneInput.nativeElement.focus();
    }
  }

  public onChangeOrKeyUpDateNaissancePersonneAChargeAnnee(): void {
    this.gererAffichageNouvellePersonneSituationForm();
  }

  public onFocusDateNaissanceNouvellePersonne(): void {
    this.dateNaissanceNouvellePersonne.messageErreurFormat = undefined;
  }
}
