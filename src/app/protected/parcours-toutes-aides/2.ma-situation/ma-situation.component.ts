import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';
import { Salaire } from '@app/commun/models/salaire';
import { CommuneApiService } from '@app/core/services/communes-api/communes-api.service';
import { DeConnecteBeneficiaireAidesService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-beneficiaire-aides.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from "@app/core/services/utile/date-util.service";
import { ScreenService } from '@app/core/services/utile/screen.service';
import { NationalitesEnum } from "@enumerations/nationalites.enum";
import { SituationsFamilialesEnum } from "@enumerations/situations-familiales.enum";
import { SituationPersonneEnum } from '@enumerations/situations-personne.enum';
import { DateDecomposee } from "@models/date-decomposee";
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { SituationFamiliale } from '@models/situation-familiale';
import { ModalService } from '@app/core/services/utile/modal.service';
import { DemandeurEmploiService } from '@app/core/services/utile/demandeur-emploi.service';

@Component({
  selector: 'app-ma-situation',
  templateUrl: './ma-situation.component.html',
  styleUrls: ['./ma-situation.component.scss']
})
export class MaSituationComponent implements OnInit {

  //appel service http : gestion loading et erreur
  isPageLoadingDisplay = false;

  beneficiaireAides: BeneficiaireAides;
  isSansRessource: boolean;
  dateNaissance: DateDecomposee;
  dateRepriseCreationEntreprise: DateDecomposee;
  informationsPersonnelles: InformationsPersonnelles;
  isInformationsPersonnellesFormSubmitted = false;
  isSituationConjointNotValide = false;
  situationFamiliale: SituationFamiliale;

  nationalitesEnum: typeof NationalitesEnum = NationalitesEnum;
  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  situationsFamilialesEnum: typeof SituationsFamilialesEnum = SituationsFamilialesEnum;
  situationPersonneEnum: typeof SituationPersonneEnum = SituationPersonneEnum;

  nationaliteSelectOptions = [
    { label: NationalitesEnum.FRANCAISE },
    { label: NationalitesEnum.RESSORTISSANT_UNION_EUROPEENNE },
    { label: NationalitesEnum.RESSORTISSANT_ESPACE_ECONOMIQUE_EUROPEEN },
    { label: NationalitesEnum.SUISSE },
    { label: NationalitesEnum.AUTRE }
  ];

  @ViewChild('modalPensionInvaliditeEtMicro') modalPensionInvaliditeEtMicro;
  @ViewChild('modalAAHEtMicro') modalAAHEtMicro;


  constructor(
    private communeApiService: CommuneApiService,
    private dateUtileService: DateUtileService,
    private deConnecteService: DeConnecteService,
    private demandeurEmploiService: DemandeurEmploiService,
    private router: Router,
    public deConnecteBeneficiaireAidesService: DeConnecteBeneficiaireAidesService,
    public controleChampFormulaireService: ControleChampFormulaireService,
    public modalService: ModalService,
    public screenService: ScreenService
  ) { }

  ngOnInit(): void {
    this.deConnecteService.controlerSiDemandeurEmploiConnectePresent();
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.beneficiaireAides = this.demandeurEmploiService.loadDataBeneficiaireAides(demandeurEmploiConnecte);
    this.informationsPersonnelles = this.demandeurEmploiService.loadDataInformationsPersonnelles(demandeurEmploiConnecte);
    this.situationFamiliale = this.demandeurEmploiService.loadDataSituationFamiliale(demandeurEmploiConnecte);
    this.dateNaissance = this.dateUtileService.getDateDecomposeeFromStringDate(this.informationsPersonnelles.dateNaissance, "de votre date de naissance", "DateNaissanceDemandeur");
    this.dateRepriseCreationEntreprise = this.dateUtileService.getDateDecomposeeFromStringDate(this.informationsPersonnelles.dateRepriseCreationEntreprise, "de la création ou de la reprise d'entreprise", "DateRepriseCreationEntrepriseDemandeur");
    this.controleChampFormulaireService.focusOnFirstElement();
  }

  public onClickButtonRetour(): void {
    this.checkAndSaveDateNaissanceDemandeurEmploiConnecte();
    this.checkAndSaveDateRepriseCreationEntrepriseDemandeurEmploiConnecte();
    this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.CONTRAT_TRAVAIL]);
  }

  public onClickCheckBoxBeneficiaireACRE(value: boolean): void {
    if (value === false) {
      this.informationsPersonnelles.dateRepriseCreationEntreprise = null;
      this.deConnecteService.setInformationsPersonnelles(this.informationsPersonnelles);
    }
  }

  public onClickCheckBoxSituationFamiliale(): void {
    this.situationFamiliale.isSeulPlusDe18Mois = null;
    this.deConnecteService.setSituationFamiliale(this.situationFamiliale);
  }

  public onClickCheckBoxIsMicroEntrepreneur(): void {
    if (!this.informationsPersonnelles.isMicroEntrepreneur) {
      this.deConnecteService.unsetBeneficesMicroEntreprise();
      this.deConnecteService.unsetBeneficiaireACRE();
      this.dateRepriseCreationEntreprise = this.dateUtileService.getDateDecomposeeFromStringDate(this.informationsPersonnelles.dateRepriseCreationEntreprise, "de la création ou de la reprise d'entreprise", "DateRepriseCreationEntrepriseDemandeur");
    } else {
      // évite de déclencher deux fois l'ouverture de modale
      if (!this.checkSiAAHEtMicro()) {
        this.checkSiPensionInvaliditeEtMicro();
      }
      this.isSansRessource = false;
    }
  }

  public onClickCheckBoxHasAAH(): void {
    if (!this.beneficiaireAides.beneficiaireAAH) {
      this.deConnecteService.unsetAllocationMensuelleNetAAH();
    } else {
      this.checkSiAAHEtMicro();
      this.isSansRessource = false;
    }
  }

  public onClickCheckBoxHasASS(): void {
    if (!this.beneficiaireAides.beneficiaireASS) {
      this.deConnecteService.unsetAllocationMensuelleNetASS();
      this.deConnecteService.unsetBeneficiaireACRE();
      this.dateRepriseCreationEntreprise = this.dateUtileService.getDateDecomposeeFromStringDate(this.informationsPersonnelles.dateRepriseCreationEntreprise, "de la création ou de la reprise d'entreprise", "DateRepriseCreationEntrepriseDemandeur");
    } else {
      this.deConnecteService.setAllocationMensuelleNetASS();
      this.deConnecteService.unsetAllocationMensuelleNetARE();
      this.beneficiaireAides.beneficiaireARE = false;
      this.isSansRessource = false;
    }
  }
  public onClickCheckBoxHasARE(): void {
    if (!this.beneficiaireAides.beneficiaireARE) {
      this.deConnecteService.unsetAllocationMensuelleNetARE();
    } else {
      this.deConnecteService.setAllocationMensuelleNetARE();
      this.deConnecteService.unsetAllocationMensuelleNetASS();
      this.beneficiaireAides.beneficiaireASS = false;
      this.isSansRessource = false;
    }
  }

  public onClickCheckBoxHasRSA(): void {
    if (!this.beneficiaireAides.beneficiaireRSA) {
      this.deConnecteService.unsetInfosRSA();
    } else {
      this.deConnecteService.setAllocationRSA();
      this.deConnecteService.unsetConjointAllocationRSA();
      this.isSansRessource = false;
    }
  }

  public onClickCheckBoxHasRevenusImmobilier(): void {
    if (!this.informationsPersonnelles.hasRevenusImmobilier) {
      this.deConnecteService.unsetRevenusImmobilier();
    } else {
      this.isSansRessource = false;
    }
  }

  public onClickCheckBoxHasPensionInvalidite(): void {
    if (!this.beneficiaireAides.beneficiairePensionInvalidite) {
      this.deConnecteService.unsetPensionInvalidite();
    } else {
      this.deConnecteService.setPensionInvalidite();
      this.checkSiPensionInvaliditeEtMicro();
      this.isSansRessource = false;
    }
  }

  public onClickCheckBoxHasAucuneRessource(): void {
    if (this.isSansRessource) {
      this.unsetAides();
      this.deConnecteService.unsetAides();
    }
  }

  private unsetAides(): void {
    this.beneficiaireAides.beneficiaireASS = false;
    this.beneficiaireAides.beneficiaireARE = false;
    this.beneficiaireAides.beneficiaireAAH = false;
    this.beneficiaireAides.beneficiaireRSA = false;
    this.beneficiaireAides.beneficiairePensionInvalidite = false;
    this.informationsPersonnelles.hasRevenusImmobilier = false;
    this.informationsPersonnelles.isMicroEntrepreneur = false;
  }

  public onSubmitInformationsPersonnellesForm(form: FormGroup): void {
    this.isInformationsPersonnellesFormSubmitted = true;
    this.checkAndSaveDateNaissanceDemandeurEmploiConnecte();
    this.checkAndSaveDateRepriseCreationEntrepriseDemandeurEmploiConnecte();
    if (this.isDonneesSaisiesFormulaireValides(form)) {
      if (this.isAllocationDEntreeSelectionnee()) {
        this.getCodeInseeFromCodePostal(this.informationsPersonnelles.logement.coordonnees.codePostal);
        this.deConnecteService.setBeneficiaireAides(this.beneficiaireAides);
        this.deConnecteService.setInformationsPersonnelles(this.informationsPersonnelles);
        this.router.navigate([RoutesEnum.PARCOURS_TOUTES_AIDES, RoutesEnum.MES_PERSONNES_A_CHARGE]);
      }
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement();
    }
  }

  private getCodeInseeFromCodePostal(codePostal: string): void {
    const response = this.communeApiService.getCommuneFromCodePostal(codePostal);
    response.subscribe(
      data => {
        let commune = data.pop();
        this.informationsPersonnelles.logement.coordonnees.codeInsee = commune.code;
        this.deConnecteService.setInformationsPersonnelles(this.informationsPersonnelles);
      }
    );
  }

  public unsetTitreSejourEnFranceValide(nationalite: string): void {
    if (nationalite !== NationalitesEnum.AUTRE) {
      this.informationsPersonnelles.hasTitreSejourEnFranceValide = null;
    }
  }

  public isAllocationDEntreeSelectionnee(): boolean {
    return (this.beneficiaireAides.beneficiaireASS
      || this.beneficiaireAides.beneficiaireRSA
      || this.beneficiaireAides.beneficiaireAAH
      || this.beneficiaireAides.beneficiaireARE
      || this.beneficiaireAides.beneficiairePensionInvalidite
      || this.isSansRessource);
  }

  public isConcerneACRE(): boolean {
    return this.beneficiaireAides.beneficiaireASS && this.informationsPersonnelles.isMicroEntrepreneur;
  }

  /************ gestion évènements press enter ************************/

  public handleKeyUpOnButtonTitreSejour(event: any, value: boolean): void {
    if (event.keyCode === 13) {
      this.informationsPersonnelles.hasTitreSejourEnFranceValide = value;
    }
  }

  public handleKeyUpOnButtonSituationFamiliale(event: any, value: boolean): void {
    if (event.keyCode === 13) {
      this.situationFamiliale.isEnCouple = value;
      this.onClickCheckBoxSituationFamiliale();
    }
  }

  public handleKeyUpOnButtonBeneficiaireACRE(event: any, value: boolean): void {
    if (event.keyCode === 13) {
      this.informationsPersonnelles.isBeneficiaireACRE = value;
      this.onClickCheckBoxBeneficiaireACRE(value);
    }
  }

  public handleKeyUpOnButtonSeulPlusDe18Mois(event: any, value: boolean): void {
    if (event.keyCode === 13) {
      this.situationFamiliale.isSeulPlusDe18Mois = value;
    }
  }

  public handleKeyUpOnButtonSituationDemandeur(event: any, situationPersonne: string): void {
    if (event.keyCode === 13) {
      if (situationPersonne === this.situationPersonneEnum.ASS) {
        this.onClickCheckBoxHasASS();
      }
      else if (situationPersonne === this.situationPersonneEnum.AAH) {
        this.onClickCheckBoxHasAAH();
      }
      else if (situationPersonne === this.situationPersonneEnum.ARE) {
        this.onClickCheckBoxHasARE();
      }
      else if (situationPersonne === this.situationPersonneEnum.IMMOBILIER) {
        this.onClickCheckBoxHasRevenusImmobilier();
      }
      else if (situationPersonne === this.situationPersonneEnum.MICRO_ENTREPRENEUR) {
        this.onClickCheckBoxIsMicroEntrepreneur();
      }
      else if (situationPersonne === this.situationPersonneEnum.PENSION_INVALIDITE) {
        this.onClickCheckBoxHasPensionInvalidite();
      }
      else if (situationPersonne === this.situationPersonneEnum.RSA) {
        this.onClickCheckBoxHasRSA();
      }
      else if (situationPersonne === this.situationPersonneEnum.SANS_RESSOURCE) {
        this.onClickCheckBoxHasAucuneRessource();
      }
    }
  }

  public handleKeyUpOnButtonSituationConjoint(e: any, situationConjoint: string): void {
    if (e.keyCode === 13) {
      if (situationConjoint === this.situationPersonneEnum.ARE || situationConjoint === this.situationPersonneEnum.ASS) {
        this.handleKeyUpOnButtonSituationConjointAidesPoleEmploi(situationConjoint);
      }
      if (situationConjoint === this.situationPersonneEnum.AAH || situationConjoint === this.situationPersonneEnum.RSA) {
        this.handleKeyUpOnButtonSituationConjointAidesCAF(situationConjoint);
      }
      if (situationConjoint === this.situationPersonneEnum.SALARIE
        || situationConjoint === this.situationPersonneEnum.MICRO_ENTREPRENEUR
        || situationConjoint === this.situationPersonneEnum.TRAVAILLEUR_INDEPENDANT
        || situationConjoint === this.situationPersonneEnum.IMMOBILIER
        || situationConjoint === this.situationPersonneEnum.PENSION_RETRAITE) {
        this.handleKeyUpOnButtonSituationConjointRessourcesFinancieres(situationConjoint);
      }
      if (situationConjoint === this.situationPersonneEnum.PENSION_INVALIDITE) {
        this.handleKeyUpOnButtonSituationConjointAidesCPAM(situationConjoint);
      }
      if (situationConjoint === this.situationPersonneEnum.SANS_RESSOURCE) {
        this.onClickCheckBoxConjointIsSansRessource();
      }
    }
  }

  private handleKeyUpOnButtonSituationConjointAidesPoleEmploi(situationConjoint: string) {
    if (situationConjoint === this.situationPersonneEnum.ASS) {
      this.onClickCheckBoxConjointHasASS();
    }
    if (situationConjoint === this.situationPersonneEnum.ARE) {
      this.onClickCheckBoxConjointHasARE();
    }
  }

  private handleKeyUpOnButtonSituationConjointAidesCAF(situationConjoint: string) {
    if (situationConjoint === this.situationPersonneEnum.AAH) {
      this.onClickCheckBoxConjointHasAAH();
    }
    if (situationConjoint === this.situationPersonneEnum.RSA) {
      this.onClickCheckBoxConjointHasRSA();
    }
  }

  private handleKeyUpOnButtonSituationConjointAidesCPAM(situationConjoint: string) {
    if (situationConjoint === this.situationPersonneEnum.PENSION_INVALIDITE) {
      this.onClickCheckBoxConjointHasPensionInvalidite();
    }
  }

  private handleKeyUpOnButtonSituationConjointRessourcesFinancieres(situationConjoint: string) {
    if (situationConjoint === this.situationPersonneEnum.SALARIE) {
      this.onClickCheckBoxConjointIsSalarie();
    }
    if (situationConjoint === this.situationPersonneEnum.MICRO_ENTREPRENEUR) {
      this.onClickCheckBoxConjointIsMicroEntrepreneur();
    }
    if (situationConjoint === this.situationPersonneEnum.TRAVAILLEUR_INDEPENDANT) {
      this.onClickCheckBoxConjointIsTravailleurIndependant();
    }
    if (situationConjoint === this.situationPersonneEnum.IMMOBILIER) {
      this.onClickCheckBoxConjointHasRevenusImmobilier();
    }
    if (situationConjoint === this.situationPersonneEnum.PENSION_RETRAITE) {
      this.onClickCheckBoxConjointHasPensionRetraite();
    }
  }


  /************ est en couple, gestion situation conjoint *******************************/

  public isSituationConjointValide(): boolean {
    return this.situationFamiliale.conjoint
      && (this.situationFamiliale.conjoint.informationsPersonnelles.isSalarie
        || this.situationFamiliale.conjoint.informationsPersonnelles.isSansRessource
        || this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireAAH
        || this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireARE
        || this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireASS
        || this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireRSA
        || this.situationFamiliale.conjoint.beneficiaireAides.beneficiairePensionInvalidite
        || this.situationFamiliale.conjoint.informationsPersonnelles.isTravailleurIndependant
        || this.situationFamiliale.conjoint.informationsPersonnelles.isMicroEntrepreneur
        || this.situationFamiliale.conjoint.informationsPersonnelles.hasRevenusImmobilier
        || this.situationFamiliale.conjoint.informationsPersonnelles.hasPensionRetraite);
  }

  public onClickCheckBoxConjointHasAAH(): void {
    if (!this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireAAH) {
      this.deConnecteService.unsetConjointAllocationAAH();
    } else {
      this.deConnecteService.setConjointAllocationAAH();
      this.situationFamiliale.conjoint.informationsPersonnelles.isSansRessource = false;
    }
  }

  public onClickCheckBoxConjointHasASS(): void {
    if (!this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireASS) {
      this.deConnecteService.unsetConjointAllocationASS();
    } else {
      this.deConnecteService.setConjointAllocationASS();
      this.deConnecteService.unsetConjointAllocationARE();
      this.situationFamiliale.conjoint.informationsPersonnelles.isSansRessource = false;
    }
  }

  public onClickCheckBoxConjointHasARE(): void {
    if (!this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireARE) {
      this.deConnecteService.unsetConjointAllocationARE();
    } else {
      this.deConnecteService.setConjointAllocationARE();
      this.deConnecteService.unsetConjointAllocationASS();
      this.situationFamiliale.conjoint.informationsPersonnelles.isSansRessource = false;
    }
  }

  public onClickCheckBoxConjointHasRSA(): void {
    if (!this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireRSA) {
      this.deConnecteService.unsetConjointAllocationRSA();
    } else {
      this.deConnecteService.setConjointAllocationRSA();
      this.situationFamiliale.conjoint.informationsPersonnelles.isSansRessource = false;
    }
  }

  public onClickCheckBoxConjointIsMicroEntrepreneur(): void {
    if (!this.situationFamiliale.conjoint.informationsPersonnelles.isMicroEntrepreneur) {
      this.deConnecteService.unsetConjointBeneficesMicroEntreprise();
    } else {
      this.deConnecteService.unsetConjointChiffreAffairesIndependant();
      this.situationFamiliale.conjoint.informationsPersonnelles.isSansRessource = false;
    }
  }

  public onClickCheckBoxConjointIsTravailleurIndependant(): void {
    if (!this.situationFamiliale.conjoint.informationsPersonnelles.isTravailleurIndependant) {
      this.deConnecteService.unsetConjointChiffreAffairesIndependant();
    } else {
      this.deConnecteService.unsetConjointBeneficesMicroEntreprise();
      this.situationFamiliale.conjoint.informationsPersonnelles.isSansRessource = false;
    }
  }

  public onClickCheckBoxConjointHasRevenusImmobilier(): void {
    if (!this.situationFamiliale.conjoint.informationsPersonnelles.hasRevenusImmobilier) {
      this.deConnecteService.unsetConjointRevenusImmobilier();
    } else {
      this.situationFamiliale.conjoint.informationsPersonnelles.isSansRessource = false;
    }
  }

  public onClickCheckBoxConjointIsSalarie(): void {
    if (!this.situationFamiliale.conjoint.informationsPersonnelles.isSalarie) {
      this.deConnecteService.unsetConjointSalaire();
    } else {
      this.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.salaire = new Salaire();
      this.situationFamiliale.conjoint.informationsPersonnelles.isSansRessource = false;
    }
  }

  public onClickCheckBoxConjointHasPensionInvalidite(): void {
    if (!this.situationFamiliale.conjoint.beneficiaireAides.beneficiairePensionInvalidite) {
      this.deConnecteService.unsetConjointPensionInvalidite();
    } else {
      this.deConnecteService.setConjointPensionInvalidite();
      this.situationFamiliale.conjoint.informationsPersonnelles.isSansRessource = false;
    }
  }

  public onClickCheckBoxConjointHasPensionRetraite(): void {
    if (!this.situationFamiliale.conjoint.informationsPersonnelles.hasPensionRetraite) {
      this.deConnecteService.unsetConjointPensionRetraite();
    } else {
      this.situationFamiliale.conjoint.informationsPersonnelles.isSansRessource = false;
    }
  }

  public onClickCheckBoxConjointIsSansRessource(): void {
    this.deConnecteService.unsetConjointSalaire();
    this.deConnecteService.unsetConjointAides();
    this.deConnecteService.unsetConjointBeneficesMicroEntreprise();
    this.deConnecteService.unsetConjointChiffreAffairesIndependant();
    this.deConnecteService.unsetConjointRevenusImmobilier();
    this.deConnecteService.unsetConjointPensionRetraite();
  }


  /************ private methods ************************/

  private checkAndSaveDateNaissanceDemandeurEmploiConnecte(): void {
    if (this.dateUtileService.isDateDecomposeeSaisieAvecInferieurDateJourValide(this.dateNaissance)) {
      this.informationsPersonnelles.dateNaissance = this.dateUtileService.getStringDateFromDateDecomposee(this.dateNaissance);
    }
  }

  private checkAndSaveDateRepriseCreationEntrepriseDemandeurEmploiConnecte(): void {
    if (this.dateUtileService.isDateDecomposeeSaisieAvecInferieurDateJourValide(this.dateRepriseCreationEntreprise)) {
      this.informationsPersonnelles.dateRepriseCreationEntreprise = this.dateUtileService.getStringDateFromDateDecomposee(this.dateRepriseCreationEntreprise);
      if (this.isNonBeneficiaireACRE()) {
        this.unsetDateRepriseCreationEntreprise();
      }
    }
  }

  private isDonneesSaisiesFormulaireValides(form: FormGroup): boolean {
    this.isSituationConjointNotValide = !this.isSituationConjointValide();
    return form.valid
      && this.dateUtileService.isDateDecomposeeSaisieAvecInferieurDateJourValide(this.dateNaissance)
      && (this.isNonBeneficiaireACRE() || this.dateUtileService.isDateDecomposeeSaisieAvecInferieurDateJourValide(this.dateRepriseCreationEntreprise))
      && (!this.situationFamiliale.isEnCouple
        || this.situationFamiliale.isEnCouple && !this.isSituationConjointNotValide)
      && !this.checkSiAAHEtMicro()
      && !this.checkSiPensionInvaliditeEtMicro();
  }

  private isNonBeneficiaireACRE() {
    return !this.isConcerneACRE() || this.informationsPersonnelles.isBeneficiaireACRE == null || !this.informationsPersonnelles.isBeneficiaireACRE;
  }

  private unsetDateRepriseCreationEntreprise() {
    this.informationsPersonnelles.dateRepriseCreationEntreprise = null;
    this.dateRepriseCreationEntreprise = this.dateUtileService.getDateDecomposeeFromStringDate(this.informationsPersonnelles.dateRepriseCreationEntreprise, "de la création ou de la reprise d'entreprise", "DateRepriseCreationEntrepriseDemandeur");
    this.deConnecteService.setInformationsPersonnelles(this.informationsPersonnelles);
  }

  public displayLoading(displayLoading: boolean) {
    this.isPageLoadingDisplay = displayLoading;
  }

  public checkSiAAHEtMicro(): boolean {
    if (this.beneficiaireAides.beneficiaireAAH && this.informationsPersonnelles.isMicroEntrepreneur) {
      this.modalService.openModal(this.modalAAHEtMicro);
      return true;
    }
    return false;
  }

  public checkSiPensionInvaliditeEtMicro(): boolean {
    if (this.beneficiaireAides.beneficiairePensionInvalidite && this.informationsPersonnelles.isMicroEntrepreneur) {
      this.modalService.openModal(this.modalPensionInvaliditeEtMicro);
      return true;
    }
    return false;
  }
}
