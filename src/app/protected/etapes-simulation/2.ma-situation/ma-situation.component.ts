import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { Salaire } from '@app/commun/models/salaire';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from "@app/core/services/utile/date-util.service";
import { SituationFamilialeUtileService } from '@app/core/services/utile/situation-familiale.service';
import { NationalitesEnum } from "@enumerations/nationalites.enum";
import { SituationsFamilialesEnum } from "@enumerations/situations-familiales.enum";
import { SituationPersonneEnum } from '@enumerations/situations-personne.enum';
import { BeneficiaireAidesSociales } from '@models/beneficiaire-aides-sociales';
import { DateDecomposee } from "@models/date-decomposee";
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { SituationFamiliale } from '@models/situation-familiale';
import { PopoverDirective } from 'ngx-bootstrap/popover';

@Component({
  selector: 'app-ma-situation',
  templateUrl: './ma-situation.component.html',
  styleUrls: ['./ma-situation.component.scss']
})
export class MaSituationComponent implements OnInit {

  beneficiaireAidesSociales: BeneficiaireAidesSociales;
  dateNaissance: DateDecomposee;
  informationsPersonnelles: InformationsPersonnelles;
  isInformationsPersonnellesFormSubmitted = false;
  isSituationConjointNotValide = false;
  isSelectionAideOk: boolean = true;
  situationFamiliale: SituationFamiliale;

  nationalitesEnum: typeof NationalitesEnum = NationalitesEnum;
  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  situationsFamilialesEnum: typeof SituationsFamilialesEnum = SituationsFamilialesEnum;
  situationPersonneEnum: typeof SituationPersonneEnum = SituationPersonneEnum;

  @ViewChild('popoverSituationLogement', { read: PopoverDirective }) popoverSituationLogement: PopoverDirective;

  nationaliteSelectOptions = [
    { label: NationalitesEnum.FRANCAISE },
    { label: NationalitesEnum.RESSORTISSANT_EUROPEEN_OU_SUISSE },
    { label: NationalitesEnum.AUTRE }
  ];

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public dateUtileService: DateUtileService,
    public deConnecteService: DeConnecteService,
    private router: Router,
    private situationFamilialeUtileService: SituationFamilialeUtileService,
    private elementRef: ElementRef
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
    this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.CONTRAT_TRAVAIL]);
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

  public onClickCheckBoxHasASS(): void {
    if (!this.beneficiaireAidesSociales.beneficiaireASS) {
      this.deConnecteService.unsetAllocationMensuelleNetASS();
    }
  }

  public onClickCheckBoxHasRSA(): void {
    if (!this.beneficiaireAidesSociales.beneficiaireRSA) {
      this.deConnecteService.unsetInfosRSA();
    }
  }

  public onClickCheckBoxHasRevenusImmobilier(): void {
    if (!this.informationsPersonnelles.hasRevenusImmobilier) {
      this.deConnecteService.unsetRevenusImmobilier();
    }
  }

  public onClickCheckBoxHasPensionInvalidite(): void {
    if (!this.beneficiaireAidesSociales.beneficiairePensionInvalidite) {
      this.deConnecteService.unsetPensionInvalidite();
    }
  }

  public onClickClosePopoverSituationLogement(): void {
    this.popoverSituationLogement.hide();
  }

  public onSubmitInformationsPersonnellesForm(form: FormGroup): void {
    this.isInformationsPersonnellesFormSubmitted = true;
    this.checkAndSaveDateNaissanceDemandeurEmploiConnecte();
    if (this.isDonneesSaisiesFormulaireValides(form)) {
      if(this.checkSelectionAideOk()) {
        this.deConnecteService.setBeneficiaireAidesSociales(this.beneficiaireAidesSociales);
        this.deConnecteService.setInformationsPersonnelles(this.informationsPersonnelles);
        this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.MES_PERSONNES_A_CHARGE]);
      } else {
        this.isSelectionAideOk = false;
      }
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement(this.elementRef);
    }
  }

  public unsetTitreSejourEnFranceValide(nationalite: string): void {
    if (nationalite !== NationalitesEnum.AUTRE) {
      this.informationsPersonnelles.titreSejourEnFranceValide = null;
    }
  }


  /************ gestion évènements press enter ************************/

  public handleKeyUpOnButtonTitreSejour(event: any, value: boolean): void  {
    if (event.keyCode === 13) {
      this.informationsPersonnelles.titreSejourEnFranceValide = value;
    }
  }

  public handleKeyUpOnButtonSituationFamiliale(event: any, value: boolean): void {
    if (event.keyCode === 13) {
      this.situationFamiliale.isEnCouple = value;
      this.onClickCheckBoxSituationFamiliale();
    }
  }

  public handleKeyUpOnButtonSeulPlusDe18Mois(event: any, value: boolean): void {
    if (event.keyCode === 13) {
      this.situationFamiliale.isSeulPlusDe18Mois = value;
    }
  }

  public handleKeyUpOnButtonProprietaireSansPretOuLogeGratuit(event: any, value: boolean): void {
    if (event.keyCode === 13) {
      this.informationsPersonnelles.isProprietaireSansPretOuLogeGratuit = value;
    }
  }

  public handleKeyUpOnButtonSituationDemandeur(event: any, situationPersonne: string): void  {
    if (event.keyCode === 13) {
      if(situationPersonne === this.situationPersonneEnum.AAH) {
        this.beneficiaireAidesSociales.beneficiaireAAH = !this.beneficiaireAidesSociales.beneficiaireAAH;
        this.onClickCheckBoxHasAAH();
      }
      if(situationPersonne === this.situationPersonneEnum.BENEFICIAIRE_REVENUS_IMMOBILIER) {
        this.informationsPersonnelles.hasRevenusImmobilier = !this.informationsPersonnelles.hasRevenusImmobilier;
        this.onClickCheckBoxHasRevenusImmobilier();
      }
      if(situationPersonne === this.situationPersonneEnum.CREATEUR_ENTREPRISE) {
        this.informationsPersonnelles.createurEntreprise = !this.informationsPersonnelles.createurEntreprise;
        this.onClickCheckBoxIsCreateurEntreprise();
      }
      if(situationPersonne === this.situationPersonneEnum.PENSION_INVALIDITE) {
        this.beneficiaireAidesSociales.beneficiairePensionInvalidite = !this.beneficiaireAidesSociales.beneficiairePensionInvalidite;
        this.onClickCheckBoxHasPensionInvalidite();
      }
    }
  }

  public handleKeyUpOnButtonSituationConjoint(e: any, situationConjoint: string): void  {
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
        || this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireRSA
        || this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiairePensionInvalidite);
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
      this.situationFamiliale.conjoint.ressourcesFinancieres.salaire = new Salaire();
    }
  }

  public onClickCheckBoxConjointHasPensionInvalidite(): void {
    if (!this.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiairePensionInvalidite) {
      this.deConnecteService.unsetConjointPensionInvalidite();
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
    if (this.dateUtileService.isDateDecomposeeSaisieAvecInferieurDateJourValide(this.dateNaissance)) {
      this.informationsPersonnelles.dateNaissance = this.dateUtileService.getStringDateFromDateDecomposee(this.dateNaissance);
    }
  }

  private isDonneesSaisiesFormulaireValides(form: FormGroup): boolean {
    this.isSituationConjointNotValide = !this.isSituationConjointValide();
    return form.valid
      && this.dateUtileService.isDateDecomposeeSaisieAvecInferieurDateJourValide(this.dateNaissance)
      && (!this.situationFamiliale.isEnCouple
        || this.situationFamiliale.isEnCouple && !this.isSituationConjointNotValide);
  }

  private checkSelectionAideOk(): boolean {
    return (this.beneficiaireAidesSociales.beneficiaireASS
        || this.beneficiaireAidesSociales.beneficiaireRSA
        || this.beneficiaireAidesSociales.beneficiaireAAH);
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
}
