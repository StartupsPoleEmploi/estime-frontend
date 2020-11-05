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
import { InformationsIdentite } from '@app/commun/models/informations-identite';
import { AllocationsCAF } from '@app/commun/models/allocations-caf';
import { AllocationsPoleEmploi } from '@app/commun/models/allocations-pole-emploi';

@Component({
  selector: 'app-mes-informations-identite',
  templateUrl: './mes-informations-identite.component.html',
  styleUrls: ['./mes-informations-identite.component.scss']
})
export class MesInformationsIdentiteComponent implements OnInit {

  demandeurEmploiConnecte: DemandeurEmploi;
  isInformationsIdentiteFormSubmitted = false;
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
    this.dateNaissance = this.dateUtileService.getDateDecomposeeFromDate(this.demandeurEmploiConnecte.informationsIdentite.dateNaissance);
  }


  redirectVersPagePrecedente() {
    this.checkAndSaveDateNaissanceDemandeurEmploiConnecte();
    this.router.navigate([RoutesEnum.MON_FUTUR_DE_TRAVAIL], { replaceUrl: true });
  }

  redirectVersPageSuivante(form: FormGroup) {
    this.isInformationsIdentiteFormSubmitted = true;
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
      this.demandeurEmploiConnecte.informationsIdentite.titreSejourEnFranceValide = null;
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
    conjoint.informationsIdentite = new InformationsIdentite();
    this.demandeurEmploiConnecte.situationFamiliale.conjoint = conjoint;
  }

  isSituationConjointIncorrect(): boolean {
    return !this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsIdentite.isSalarie
    && !this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsIdentite.isSansEmploi;
  }

  isConjointIsSansEmploiSelectionne() {
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsIdentite.isSalarie = false;
  }

  isConjointIsSalarieSelectionne() {
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsIdentite.isSansEmploi = false;
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
      this.demandeurEmploiConnecte.informationsIdentite.dateNaissance = this.dateUtileService.getDateFromDateDecomposee(this.dateNaissance);
    }
  }
}
