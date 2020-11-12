import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from '@enumerations/routes.enum';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { Personne } from '@models/personne';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { FormGroup } from '@angular/forms';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateDecomposee } from "@models/date-decomposee";
import { DateUtileService } from "@app/core/services/utile/date-util.service";
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { SituationPersonne } from '@app/commun/models/situation-personne';
import { NationalitesEnum } from "@enumerations/nationalites.enum";
import { SituationPersonneEnum } from '@enumerations/situations-personne.enum';
import { SituationsFamilialesEnum } from "@enumerations/situations-familiales.enum";

@Component({
  selector: 'app-mes-informations-personnelles',
  templateUrl: './mes-informations-personnelles.component.html',
  styleUrls: ['./mes-informations-personnelles.component.scss']
})
export class MesInformationsPersonnellesComponent implements OnInit {

  dateNaissance: DateDecomposee;
  informationsPersonnelles: InformationsPersonnelles;
  isInformationsPersonnellesFormSubmitted = false;
  isEnCouple: boolean;
  situationConjoint: SituationPersonne;

  situationPersonneEnum: typeof SituationPersonneEnum = SituationPersonneEnum;
  situationsFamilialesEnum: typeof SituationsFamilialesEnum = SituationsFamilialesEnum;

  @ViewChild('moisDateNaissance', { read: ElementRef }) moisDateNaissanceInput: ElementRef;
  @ViewChild('anneeDateNaissance', { read: ElementRef }) anneeDateNaissanceInput: ElementRef;

  nationaliteSelectOptions = [
    { label: NationalitesEnum.FRANCAISE },
    { label: NationalitesEnum.RESSORTISSANT_EUROPEEN_OU_SUISSE },
    { label: NationalitesEnum.AUTRE }
  ];

  constructor(
    private dateUtileService: DateUtileService,
    public demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    public controleChampFormulaireService: ControleChampFormulaireService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    this.loadDataInformationsPersonnelles(demandeurEmploiConnecte);
    this.loadDataSituationFamiliale(demandeurEmploiConnecte);
    this.dateNaissance = this.dateUtileService.getDateDecomposeeFromStringDate(this.informationsPersonnelles.dateNaissance);
  }

  public onClickButtonRetour(): void {
    this.checkAndSaveDateNaissanceDemandeurEmploiConnecte();
    this.router.navigate([RoutesEnum.MON_FUTUR_DE_TRAVAIL], { replaceUrl: true });
  }

  public onClickSituationFamiliale(): void {
    if(this.isEnCouple) {
      this.situationConjoint = new SituationPersonne(false, false, false);
    } else {
      this.demandeurEmploiConnecteService.unsetConjoint();
    }
  }

  public onSubmitInformationsPersonnellesForm(form: FormGroup): void {
    this.isInformationsPersonnellesFormSubmitted = true;
    this.checkAndSaveDateNaissanceDemandeurEmploiConnecte();
    if (this.isDonneesSaisiesFormulaireValides(form)) {
      this.demandeurEmploiConnecteService.setInformationsPersonnelles(this.informationsPersonnelles);
      this.demandeurEmploiConnecteService.setSituationFamiliale(this.isEnCouple, this.situationConjoint);
      this.router.navigate([RoutesEnum.MES_PERSONNES_A_CHARGE], { replaceUrl: true });
    }
  }

  public unsetTitreSejourEnFranceValide(nationalite: string): void {
    if (nationalite !== NationalitesEnum.AUTRE) {
      this.informationsPersonnelles.titreSejourEnFranceValide = null;
    }
  }

  public isHandicapeClicked(): void {
    if (!this.informationsPersonnelles.isHandicape) {
      this.demandeurEmploiConnecteService.unsetAllocationMensuelleNetAAH();
    }
  }

  public isCreateurEntrepriseClicked(): void {
    if (!this.informationsPersonnelles.isCreateurEntreprise) {
      this.demandeurEmploiConnecteService.unsetRevenusCreateurEntreprise();
    }
  }

  public hasRevenusImmobilierClicked(): void {
    if (!this.informationsPersonnelles.hasRevenusImmobilier) {
      this.demandeurEmploiConnecteService.unsetRevenusImmobilier();
    }
  }

  private checkAndSaveDateNaissanceDemandeurEmploiConnecte(): void {
    this.dateNaissance.messageErreurFormat = this.dateUtileService.checkFormat(this.dateNaissance);
    if (this.dateUtileService.isDateDecomposeeSaisieValide(this.dateNaissance)) {
      this.informationsPersonnelles.dateNaissance = this.dateUtileService.getStringDateFromDateDecomposee(this.dateNaissance);
    }
  }

  private isDonneesSaisiesFormulaireValides(form: FormGroup): boolean {
    return form.valid
      && this.dateUtileService.isDateDecomposeeSaisieValide(this.dateNaissance)
      && this.isSituationFamilialeCorrecte();
  }

  private loadDataInformationsPersonnelles(demandeurEmploiConnecte: DemandeurEmploi): void {
    if(!demandeurEmploiConnecte.informationsPersonnelles) {
      this.informationsPersonnelles = new InformationsPersonnelles();
      this.informationsPersonnelles.nationalite = null;
    } else {
      this.informationsPersonnelles = demandeurEmploiConnecte.informationsPersonnelles;
    }
  }

  private loadDataSituationFamiliale(demandeurEmploiConnecte: DemandeurEmploi): void {
    if(demandeurEmploiConnecte.situationFamiliale) {
      this.isEnCouple = demandeurEmploiConnecte.situationFamiliale.isEnCouple;
      if(this.isEnCouple) {
        const conjoint = demandeurEmploiConnecte.situationFamiliale.conjoint;
        this.situationConjoint = new SituationPersonne(
          conjoint.informationsPersonnelles.isHandicape,
          conjoint.informationsPersonnelles.isSalarie,
          conjoint.informationsPersonnelles.isSansEmploi
        );
      }
    } else {
      this.situationConjoint = new SituationPersonne(false, false, false);
    }
  }

  public isSituationConjointCorrect(): boolean {
    return this.situationConjoint.isSalarie
      || this.situationConjoint.isSansEmploi;
  }

  private isSituationFamilialeCorrecte() {
    return !this.isEnCouple
      || (this.isEnCouple && this.isSituationConjointCorrect());
  }

  /** gestion évènements champ date naissance  **/

  public onChangeOrKeyUpDateNaissanceJour(event): void {
    event.stopPropagation();
    const value = this.dateNaissance.jour;
    if (value && value.length === 2) {
      this.moisDateNaissanceInput.nativeElement.focus();
    }
  }

  public onChangeOrKeyUpDateNaissanceMois(event): void {
    event.stopPropagation();
    const value = this.dateNaissance.mois;
    if (value && value.length === 2) {
      this.anneeDateNaissanceInput.nativeElement.focus();
    }
  }

  public onFocusDateNaissance(): void {
    this.dateNaissance.messageErreurFormat = undefined;
  }
}
