import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BeneficiaireAidesSociales } from '@models/beneficiaire-aides-sociales';
import { SituationFamiliale } from '@models/situation-familiale';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from "@app/core/services/utile/date-util.service";
import { SituationFamilialeUtileService } from '@app/core/services/utile/situation-familiale.service';
import { NationalitesEnum } from "@enumerations/nationalites.enum";
import { RoutesEnum } from '@enumerations/routes.enum';
import { SituationsFamilialesEnum } from "@enumerations/situations-familiales.enum";
import { SituationPersonneEnum } from '@enumerations/situations-personne.enum';
import { DateDecomposee } from "@models/date-decomposee";
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { InformationsPersonnelles } from '@models/informations-personnelles';

@Component({
  selector: 'app-mes-informations-personnelles',
  templateUrl: './mes-informations-personnelles.component.html',
  styleUrls: ['./mes-informations-personnelles.component.scss']
})
export class MesInformationsPersonnellesComponent implements OnInit {

  beneficiaireAidesSociales: BeneficiaireAidesSociales;
  dateNaissance: DateDecomposee;
  informationsPersonnelles: InformationsPersonnelles;
  isInformationsPersonnellesFormSubmitted = false;
  isSituationConjointNotValide = false;
  situationFamiliale: SituationFamiliale;

  nationalitesEnum: typeof NationalitesEnum = NationalitesEnum;
  situationsFamilialesEnum: typeof SituationsFamilialesEnum = SituationsFamilialesEnum;
  situationPersonneEnum: typeof SituationPersonneEnum = SituationPersonneEnum;

  @ViewChild('moisDateNaissance', { read: ElementRef }) moisDateNaissanceInput: ElementRef;
  @ViewChild('anneeDateNaissance', { read: ElementRef }) anneeDateNaissanceInput: ElementRef;

  nationaliteSelectOptions = [
    { label: NationalitesEnum.FRANCAISE },
    { label: NationalitesEnum.RESSORTISSANT_EUROPEEN_OU_SUISSE },
    { label: NationalitesEnum.AUTRE }
  ];

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    private dateUtileService: DateUtileService,
    public deConnecteService: DeConnecteService,
    private router: Router,
    private situationFamilialeUtileService: SituationFamilialeUtileService
  ) { }

  ngOnInit(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.beneficiaireAidesSociales = demandeurEmploiConnecte.beneficiaireAidesSociales;
    this.loadDataInformationsPersonnelles(demandeurEmploiConnecte);
    this.loadDataSituationFamiliale(demandeurEmploiConnecte);
    this.dateNaissance = this.dateUtileService.getDateDecomposeeFromStringDate(this.informationsPersonnelles.dateNaissance);
  }

  public onClickButtonRetour(): void {
    this.checkAndSaveDateNaissanceDemandeurEmploiConnecte();
    this.router.navigate([RoutesEnum.MON_FUTUR_DE_TRAVAIL]);
  }

    public onClickCheckBoxSituationFamiliale(): void {
    this.deConnecteService.setSituationFamiliale(this.situationFamiliale);
  }

  public onClickCheckBoxIsCreateurEntreprise(): void {
    if (!this.informationsPersonnelles.createurEntreprise) {
      this.deConnecteService.unsetRevenusCreateurEntreprise();
    }
  }

  public onClickCheckBoxHasAAH(): void {
    if (!this.beneficiaireAidesSociales.beneficiaireAAH) {
      this.deConnecteService.unsetAllocationMensuelleNetAAH();
    }
  }

  public onClickCheckBoxHasRevenusImmobilier(): void {
    if (!this.informationsPersonnelles.hasRevenusImmobilier) {
      this.deConnecteService.unsetRevenusImmobilier();
    }
  }

  public onSubmitInformationsPersonnellesForm(form: FormGroup): void {
    this.isInformationsPersonnellesFormSubmitted = true;
    this.checkAndSaveDateNaissanceDemandeurEmploiConnecte();
    if (this.isDonneesSaisiesFormulaireValides(form)) {
      this.deConnecteService.setBeneficiaireAidesSociales(this.beneficiaireAidesSociales);
      this.deConnecteService.setInformationsPersonnelles(this.informationsPersonnelles);
      this.router.navigate([RoutesEnum.MES_PERSONNES_A_CHARGE]);
    }
  }

  public unsetTitreSejourEnFranceValide(nationalite: string): void {
    if (nationalite !== NationalitesEnum.AUTRE) {
      this.informationsPersonnelles.titreSejourEnFranceValide = null;
    }
  }

  /************ gestion évènements press enter ************************/

  public handleKeyUpOnButtonSituationFamiliale(event: any, value: boolean) {
    if (event.keyCode === 13) {
      this.situationFamiliale.isEnCouple = value;
      this.onClickCheckBoxSituationFamiliale();
    }
  }

  public handleKeyUpOnButtonSituationDemandeur(event: any, situationPersonne: string) {
    if (event.keyCode === 13) {
      if(situationPersonne === this.situationPersonneEnum.AAH) {
        this.beneficiaireAidesSociales.beneficiaireAAH = !this.beneficiaireAidesSociales.beneficiaireAAH;
        this.onClickCheckBoxHasAAH();
      }
      if(situationPersonne === this.situationPersonneEnum.BENEFICIAIRE_REVENUS_IMMOBILIER) {
        this.informationsPersonnelles.hasRevenusImmobilier = !this.informationsPersonnelles.hasRevenusImmobilier;
        this.onClickCheckBoxIsCreateurEntreprise();
      }
      if(situationPersonne === this.situationPersonneEnum.CREATEUR_ENTREPRISE) {
        this.informationsPersonnelles.createurEntreprise = !this.informationsPersonnelles.createurEntreprise;
        this.onClickCheckBoxIsCreateurEntreprise();
      }
    }
  }

  public handleKeyUpOnButtonSituationConjoint(e: any, situationConjoint: string) {
    if (e.keyCode === 13) {
      if(situationConjoint === this.situationPersonneEnum.AAH) {
        this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireAAH = !this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireAAH;
        this.onClickCheckBoxConjointHasAAH();
      }
      if(situationConjoint === this.situationPersonneEnum.SALARIE) {
        this.situationFamiliale.conjoint.informationsPersonnelles.salarie = !this.situationFamiliale.conjoint.informationsPersonnelles.salarie;
        this.onClickCheckBoxConjointIsSalarie();
      }
      if(situationConjoint === this.situationPersonneEnum.RSA) {
        this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireRSA = !this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireRSA;
        this.onClickCheckBoxConjointHasRSA();
      }
      if(situationConjoint === this.situationPersonneEnum.ARE) {
        this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireARE = !this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireARE;
        this.onClickCheckBoxConjointHasARE();
      }
      if(situationConjoint === this.situationPersonneEnum.ASS) {
        this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireASS = !this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireASS;
        this.onClickCheckBoxConjointHasASS();
      }
      if(situationConjoint === this.situationPersonneEnum.SANS_RESSOURCE) {
        this.situationFamiliale.conjoint.informationsPersonnelles.sansRessource = !this.situationFamiliale.conjoint.informationsPersonnelles.sansRessource;
        this.onClickCheckBoxConjointIsSansRessource();
      }
    }
  }


  /************ est en couple, gestion situation conjoint *******************************/

  public isSituationConjointValide(): boolean {
    return this.situationFamiliale.conjoint
      && (this.situationFamiliale.conjoint.informationsPersonnelles.salarie
        || this.situationFamiliale.conjoint.informationsPersonnelles.sansRessource
        || this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireAAH
        || this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireARE
        || this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireASS
        || this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireRSA);
  }

  public onClickCheckBoxConjointHasAAH(): void {
    if (!this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireAAH) {
      this.deConnecteService.unsetConjointAllocationAAH();
    } else {
      this.situationFamiliale.conjoint.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxConjointHasASS(): void {
    if (!this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireASS) {
      this.deConnecteService.unsetConjointAllocationASS();
    } else {
      this.situationFamiliale.conjoint.informationsPersonnelles.sansRessource = false;
      this.deConnecteService.unsetConjointAllocationARE();
      this.deConnecteService.unsetConjointAllocationRSA();
    }
  }

  public onClickCheckBoxConjointHasARE(): void {
    if (!this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireARE) {
      this.deConnecteService.unsetConjointAllocationARE();
    } else {
      this.situationFamiliale.conjoint.informationsPersonnelles.sansRessource = false;
      this.deConnecteService.unsetConjointAllocationASS();
      this.deConnecteService.unsetConjointAllocationRSA();
    }
  }

  public onClickCheckBoxConjointHasRSA(): void {
    if (!this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireRSA) {
      this.deConnecteService.unsetConjointAllocationRSA();
    } else {
      this.situationFamiliale.conjoint.informationsPersonnelles.sansRessource = false;
      this.deConnecteService.unsetConjointAllocationARE();
      this.deConnecteService.unsetConjointAllocationASS();
    }
  }

  public onClickCheckBoxConjointIsSalarie(): void {
    if (!this.situationFamiliale.conjoint.informationsPersonnelles.salarie) {
      this.deConnecteService.unsetConjointSalaire();
    } else {
      this.situationFamiliale.conjoint.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxConjointIsSansRessource(): void {
    this.deConnecteService.unsetConjointSalaire();
    this.deConnecteService.unsetConjointtAllocationsAidesSociales();
  }

  /************ private methods ************************/

  private checkAndSaveDateNaissanceDemandeurEmploiConnecte(): void {
    this.dateNaissance.messageErreurFormat = this.dateUtileService.checkFormat(this.dateNaissance);
    if (this.dateUtileService.isDateDecomposeeSaisieValide(this.dateNaissance)) {
      this.informationsPersonnelles.dateNaissance = this.dateUtileService.getStringDateFromDateDecomposee(this.dateNaissance);
    }
  }

  private isDonneesSaisiesFormulaireValides(form: FormGroup): boolean {
    this.isSituationConjointNotValide = !this.isSituationConjointValide();
    return form.valid
      && this.dateUtileService.isDateDecomposeeSaisieValide(this.dateNaissance)
      && (!this.situationFamiliale.isEnCouple
        || this.situationFamiliale.isEnCouple && !this.isSituationConjointNotValide);
  }

  private loadDataInformationsPersonnelles(demandeurEmploiConnecte: DemandeurEmploi): void {
    if (!demandeurEmploiConnecte.informationsPersonnelles) {
      this.informationsPersonnelles = new InformationsPersonnelles();
      this.informationsPersonnelles.nationalite = null;
    } else {
      this.informationsPersonnelles = demandeurEmploiConnecte.informationsPersonnelles;
    }
  }

  private loadDataSituationFamiliale(demandeurEmploiConnecte: DemandeurEmploi): void {
    if (demandeurEmploiConnecte.situationFamiliale) {
      this.situationFamiliale = demandeurEmploiConnecte.situationFamiliale;
    } else {
      this.situationFamiliale = this.situationFamilialeUtileService.creerSituationFamiliale();
    }
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
