import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { Router } from '@angular/router';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { FormGroup } from '@angular/forms';
import { Personne } from '@models/personne';
import { DateDecomposee } from '@models/date-decomposee';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { PersonneUtileService } from "@app/core/services/utile/personne-utile.service";
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { AllocationsCAF } from '@models/allocations-caf';
import { AllocationsPoleEmploi } from '@models/allocations-pole-emploi';

@Component({
  selector: 'app-mes-personnes-a-charge',
  templateUrl: './mes-personnes-a-charge.component.html',
  styleUrls: ['./mes-personnes-a-charge.component.scss']
})
export class MesPersonnesAChargeComponent implements OnInit {

  dateNaissanceNouvellePersonne: DateDecomposee;
  demandeurEmploiConnecte: DemandeurEmploi;
  isModeModification = false;
  isNouvellePersonneFormDisplay = false;
  isNouvellePersonneSituationFormDisplay = false;
  isPersonnesAChargeFormSubmitted = false;
  personneAChargeAAjouter: Personne;

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
    this.demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
  }

  redirectVersPagePrecedente() {
    this.router.navigate([RoutesEnum.MES_INFORMATIONS_PERSONNELLES], { replaceUrl: true });
  }

  redirectVersPageSuivante() {
    console.log(this.demandeurEmploiConnecte);
    this.router.navigate([RoutesEnum.MES_RESSOURCES_FINANCIERES], { replaceUrl: true });
  }

  /** gestion ajouter personne à charge */

  supprimerPersonneACharge(index: number): void {
    this.demandeurEmploiConnecte.situationFamiliale.personnesACharge.splice(index, 1);
  }

  ajouterPersonneACharge() {
    this.isNouvellePersonneFormDisplay = true;
    this.personneAChargeAAjouter = new Personne();
    this.personneAChargeAAjouter.informationsPersonnelles = new InformationsPersonnelles();
    const ressourcesFinancieres = new RessourcesFinancieres();
    ressourcesFinancieres.allocationsCAF = new AllocationsCAF();
    ressourcesFinancieres.allocationsPoleEmploi = new AllocationsPoleEmploi();
    this.personneAChargeAAjouter.ressourcesFinancieres = ressourcesFinancieres;

    this.dateNaissanceNouvellePersonne = new DateDecomposee();
  }

  annulerAjoutPersonneACharge() {
    this.isNouvellePersonneFormDisplay = false;
    this.isNouvellePersonneSituationFormDisplay = false;
    this.isPersonnesAChargeFormSubmitted = false;
    this.isModeModification = false;
  }

  validerAjoutPersonneACharge(form: FormGroup) {
    this.isPersonnesAChargeFormSubmitted = true;
    this.checkAndSaveDateNaissanceNouvellePersonneConnecte();
    if (form.valid && this.dateUtileService.isDateDecomposeeSaisieValide(this.dateNaissanceNouvellePersonne)
        && (!this.isNouvellePersonneSituationFormDisplay
            || this.isNouvellePersonneSituationFormDisplay && !this.isSituationNouvellePersonneIncorrect())) {
      if(!this.isModeModification) {
        if(!this.demandeurEmploiConnecte.situationFamiliale.personnesACharge) {
          this.demandeurEmploiConnecte.situationFamiliale.personnesACharge = new Array<Personne>();
        }
        this.demandeurEmploiConnecte.situationFamiliale.personnesACharge.push(this.personneAChargeAAjouter);
        this.demandeurEmploiConnecteService.setDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
      } else {
        this.isModeModification = false;
      }
      this.isNouvellePersonneFormDisplay = false;
      this.isPersonnesAChargeFormSubmitted = false;
    }
  }

  isSituationNouvellePersonneIncorrect(): boolean {
    return !this.personneAChargeAAjouter.informationsPersonnelles.isSalarie
    && !this.personneAChargeAAjouter.informationsPersonnelles.isSansEmploi;
  }

  isSalarieClicked(): void {
    this.personneAChargeAAjouter.informationsPersonnelles.isSansEmploi = false;
    this.personneAChargeAAjouter.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE = null;
    this.personneAChargeAAjouter.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS = null;
    this.personneAChargeAAjouter.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = null;
    if(!this.personneAChargeAAjouter.informationsPersonnelles.isSalarie) {
      this.personneAChargeAAjouter.ressourcesFinancieres.salaireNet = null;
    }
  }

  isSansEmploiClicked(): void {
    this.personneAChargeAAjouter.informationsPersonnelles.isSalarie = false;
    this.personneAChargeAAjouter.ressourcesFinancieres.salaireNet = null;
    if(!this.personneAChargeAAjouter.informationsPersonnelles.isSansEmploi) {
      this.personneAChargeAAjouter.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE = null;
      this.personneAChargeAAjouter.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS = null;
    }
  }

  isHandicapeClicked(): void {
    if(!this.personneAChargeAAjouter.informationsPersonnelles.isHandicape) {
      this.personneAChargeAAjouter.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = null;
    }
  }

  gererAffichageNouvellePersonneSituationForm() {
    if (this.dateUtileService.isFormatDateValide(this.dateNaissanceNouvellePersonne)
      && this.personneUtileService.isAgeLegalPourTravailler(this.dateNaissanceNouvellePersonne)) {
      this.isNouvellePersonneSituationFormDisplay = true;
    } else {
      this.isNouvellePersonneSituationFormDisplay = false;
    }
  }

  modifierPersonneACharge(personneAModifier: Personne) {
    this.personneAChargeAAjouter = {...personneAModifier};
    this.dateNaissanceNouvellePersonne = this.dateUtileService.getDateDecomposeeFromStringDate(this.personneAChargeAAjouter.informationsPersonnelles.dateNaissance);
    this.isNouvellePersonneFormDisplay = true;
    this.isModeModification = true;
  }

  /** gestion saisie date naissance personne à charge **/

  onChangeOrKeyUpDateNaissancePersonneAChargeJour(event) {
    event.stopPropagation();
    const value = this.dateNaissanceNouvellePersonne.jour;
    if (value && value.length === 2) {
      this.gererAffichageNouvellePersonneSituationForm();
      this.moisDateNaissanceNouvellePersonneInput.nativeElement.focus();
    }
  }

  onChangeOrKeyUpDateNaissancePersonneAChargeMois(event) {
    event.stopPropagation();
    const value = this.dateNaissanceNouvellePersonne.mois;
    if (value && value.length === 2) {
      this.gererAffichageNouvellePersonneSituationForm();
      this.anneeDateNaissanceNouvellePersonneInput.nativeElement.focus();
    }
  }

  onChangeOrKeyUpDateNaissancePersonneAChargeAnnee() {
    this.gererAffichageNouvellePersonneSituationForm();
  }

  onFocusDateNaissanceNouvellePersonne() {
    this.dateNaissanceNouvellePersonne.messageErreurFormat = undefined;
  }

  checkAndSaveDateNaissanceNouvellePersonneConnecte() {
    this.dateNaissanceNouvellePersonne.messageErreurFormat = this.dateUtileService.checkFormat(this.dateNaissanceNouvellePersonne);
    if (this.dateUtileService.isDateDecomposeeSaisieValide(this.dateNaissanceNouvellePersonne)) {
      this.personneAChargeAAjouter.informationsPersonnelles.dateNaissance = this.dateUtileService.getStringDateFromDateDecomposee(this.dateNaissanceNouvellePersonne);
    }
  }

}
