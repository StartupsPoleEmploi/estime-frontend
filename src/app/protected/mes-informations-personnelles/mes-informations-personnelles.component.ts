import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { Personne } from '@models/personne';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { FormGroup } from '@angular/forms';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateDecomposee } from "@models/date-decomposee";
import { DateUtileService } from "@app/core/services/utile/date-util.service";
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { AllocationsCAF } from '@models/allocations-caf';
import { AllocationsPoleEmploi } from '@models/allocations-pole-emploi';

@Component({
  selector: 'app-mes-informations-personnelles',
  templateUrl: './mes-informations-personnelles.component.html',
  styleUrls: ['./mes-informations-personnelles.component.scss']
})
export class MesInformationsPersonnellesComponent implements OnInit {

  demandeurEmploiConnecte: DemandeurEmploi;
  isInformationsPersonnellesFormSubmitted = false;
  dateNaissance: DateDecomposee;

  @ViewChild('moisDateNaissance', { read: ElementRef }) moisDateNaissanceInput:ElementRef;
  @ViewChild('anneeDateNaissance', { read: ElementRef }) anneeDateNaissanceInput:ElementRef;

  nationaliteSelectOptions = [
    { label: "française"},
    { label: "ressortissant européen ou suisse"},
    { label: "autre"}
  ];

  constructor(
    private dateUtileService: DateUtileService,
    private demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    public controleChampFormulaireService: ControleChampFormulaireService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    this.dateNaissance = this.dateUtileService.getDateDecomposeeFromStringDate(this.demandeurEmploiConnecte.informationsPersonnelles.dateNaissance);
  }


  redirectVersPagePrecedente() {
    this.checkAndSaveDateNaissanceDemandeurEmploiConnecte();
    this.router.navigate([RoutesEnum.MON_FUTUR_DE_TRAVAIL], { replaceUrl: true });
  }

  redirectVersPageSuivante(form: FormGroup) {
    this.isInformationsPersonnellesFormSubmitted = true;
    this.checkAndSaveDateNaissanceDemandeurEmploiConnecte();
    if(form.valid
      && this.dateUtileService.isDateDecomposeeSaisieValide(this.dateNaissance)
      && (!this.demandeurEmploiConnecte.situationFamiliale.isEnCouple || (this.demandeurEmploiConnecte.situationFamiliale.isEnCouple && !this.isSituationConjointIncorrect()))) {
      this.demandeurEmploiConnecteService.setDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
      this.router.navigate([RoutesEnum.MES_PERSONNES_A_CHARGE], { replaceUrl: true });
    }
  }

  unsetTitreSejourEnFranceValide(nationalite: string) {
    if(nationalite !== 'autre') {
      this.demandeurEmploiConnecte.informationsPersonnelles.titreSejourEnFranceValide = null;
    }
  }

  isHandicapeClicked(): void {
    if(!this.demandeurEmploiConnecte.informationsPersonnelles.isHandicape) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = null;
    }
  }

  isCreateurEntrepriseClicked(): void {
    if(!this.demandeurEmploiConnecte.informationsPersonnelles.isCreateurEntreprise) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise = null;
    }
  }

  hasRevenusImmobilierClicked(): void {
    if(!this.demandeurEmploiConnecte.informationsPersonnelles.hasRevenusImmobilier) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier = null;
    }
  }

  /*** gestion du conjoint ***/

  removeConjoint(): void {
    this.demandeurEmploiConnecte.situationFamiliale.conjoint = null;
  }

  addConjoint(): void {
    const conjoint = new Personne();
    conjoint.ressourcesFinancieres = new RessourcesFinancieres();
    conjoint.ressourcesFinancieres.allocationsCAF = new AllocationsCAF();
    conjoint.ressourcesFinancieres.allocationsPoleEmploi = new AllocationsPoleEmploi();
    conjoint.informationsPersonnelles = new InformationsPersonnelles();
    this.demandeurEmploiConnecte.situationFamiliale.conjoint = conjoint;
  }

  isSituationConjointIncorrect(): boolean {
    return !this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isSalarie
    && !this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isSansEmploi;
  }

  isConjointSalarieClicked(): void {
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isSansEmploi = false;
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE = null;
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS = null;
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = null;
    if(!this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isSalarie) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.salaireNet = null;
    }
  }

  isConjointSansEmploiClicked(): void {
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isSalarie = false;
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.salaireNet = null;
    if(!this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isSansEmploi) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE = null;
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS = null;
    }
  }

  isConjointHandicapeClicked(): void {
    if(!this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isHandicape) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = null;
    }
  }

  /** gestion saisie date naissance **/

  onChangeOrKeyUpDateNaissanceJour(event) {
    event.stopPropagation();
    const value = this.dateNaissance.jour;
    if(value && value.length === 2) {
      this.moisDateNaissanceInput.nativeElement.focus();
    }
  }

  onChangeOrKeyUpDateNaissanceMois(event) {
    event.stopPropagation();
    const value = this.dateNaissance.mois;
    if(value && value.length === 2) {
      this.anneeDateNaissanceInput.nativeElement.focus();
    }
  }

  onFocusDateNaissance() {
    this.dateNaissance.messageErreurFormat = undefined;
  }

  checkAndSaveDateNaissanceDemandeurEmploiConnecte() {
    this.dateNaissance.messageErreurFormat = this.dateUtileService.checkFormat(this.dateNaissance);
    if(this.dateUtileService.isDateDecomposeeSaisieValide(this.dateNaissance)) {
      this.demandeurEmploiConnecte.informationsPersonnelles.dateNaissance = this.dateUtileService.getStringDateFromDateDecomposee(this.dateNaissance);
    }
  }
}
