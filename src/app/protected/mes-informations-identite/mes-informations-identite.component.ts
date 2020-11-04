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

@Component({
  selector: 'app-mes-informations-identite',
  templateUrl: './mes-informations-identite.component.html',
  styleUrls: ['./mes-informations-identite.component.scss']
})
export class MesInformationsIdentiteComponent implements OnInit {

  demandeurEmploiConnecte: DemandeurEmploi;
  isInformationsIdentiteFormSubmitted = false;
  moisSelectOptions  = [
    { value: "01" },
    { value: "02" },
    { value: "03" },
    { value: "04" },
    { value: "05" },
    { value: "06" },
    { value: "07" },
    { value: "08" },
    { value: "09" },
    { value: "10" },
    { value: "11" },
    { value: "12" }
  ];
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
    if(form.valid && !this.dateNaissance.messageErreurFormat) {
      this.demandeurEmploiConnecteService.setDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
      this.router.navigate([RoutesEnum.MES_RESSOURCES_FINANCIERES], { replaceUrl: true });
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
