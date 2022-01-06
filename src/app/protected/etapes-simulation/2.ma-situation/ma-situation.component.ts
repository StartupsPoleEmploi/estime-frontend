import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';
import { Salaire } from '@app/commun/models/salaire';
import { CommuneApiService } from '@app/core/services/communes-api/communes-api.service';
import { DeConnecteBeneficiaireAidesService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-beneficiaire-aides.service';
import { DeConnecteInfosPersonnellesService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-infos-personnelles.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from "@app/core/services/utile/date-util.service";
import { InformationsPersonnellesService } from '@app/core/services/utile/informations-personnelles.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { SituationFamilialeUtileService } from '@app/core/services/utile/situation-familiale.service';
import { NationalitesEnum } from "@enumerations/nationalites.enum";
import { SituationsFamilialesEnum } from "@enumerations/situations-familiales.enum";
import { SituationPersonneEnum } from '@enumerations/situations-personne.enum';
import { DateDecomposee } from "@models/date-decomposee";
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { SituationFamiliale } from '@models/situation-familiale';

@Component({
  selector: 'app-ma-situation',
  templateUrl: './ma-situation.component.html',
  styleUrls: ['./ma-situation.component.scss']
})
export class MaSituationComponent implements OnInit {

  beneficiaireAides: BeneficiaireAides;
  dateNaissance: DateDecomposee;
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
    { label: NationalitesEnum.RESSORTISSANT_EUROPEEN_OU_SUISSE },
    { label: NationalitesEnum.AUTRE }
  ];

  constructor(
    private elementRef: ElementRef,
    public controleChampFormulaireService: ControleChampFormulaireService,
    private communeApiService: CommuneApiService,
    public dateUtileService: DateUtileService,
    public deConnecteService: DeConnecteService,
    public deConnecteBeneficiaireAidesService: DeConnecteBeneficiaireAidesService,
    public deConnecteInfosPersonnellesService: DeConnecteInfosPersonnellesService,
    private estimeApiService: EstimeApiService,
    private informationsPersonnellesService: InformationsPersonnellesService,
    public screenService: ScreenService,
    private situationFamilialeUtileService: SituationFamilialeUtileService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.deConnecteService.controlerSiDemandeurEmploiConnectePresent();
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.beneficiaireAides = demandeurEmploiConnecte.beneficiaireAides;
    this.loadDataInformationsPersonnelles(demandeurEmploiConnecte);
    this.loadDataSituationFamiliale(demandeurEmploiConnecte);
    this.dateNaissance = this.dateUtileService.getDateDecomposeeFromStringDate(this.informationsPersonnelles.dateNaissance, "de votre date de naissance", "DateNaissanceDemandeur");
  }

  public onClickButtonRetour(): void {
    this.checkAndSaveDateNaissanceDemandeurEmploiConnecte();
    this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.CONTRAT_TRAVAIL]);
  }

  public onClickCheckBoxSituationFamiliale(): void {
    this.situationFamiliale.isSeulPlusDe18Mois = null;
    this.deConnecteService.setSituationFamiliale(this.situationFamiliale);
  }

  public onClickCheckBoxIsMicroEntrepreneur(): void {
    if (!this.informationsPersonnelles.microEntrepreneur) {
      this.deConnecteService.unsetBeneficesMicroEntreprise();
    } else {
      this.deConnecteService.unsetChiffreAffairesIndependant();
      this.informationsPersonnelles.travailleurIndependant = false;
    }
  }

  public onClickCheckBoxIsTravailleurIndependant(): void {
    if (!this.informationsPersonnelles.travailleurIndependant) {
      this.deConnecteService.unsetChiffreAffairesIndependant();
    } else {
      this.deConnecteService.unsetBeneficesMicroEntreprise();
      this.informationsPersonnelles.microEntrepreneur = false;
    }
  }

  public onClickCheckBoxHasAAH(): void {
    if (!this.beneficiaireAides.beneficiaireAAH) {
      this.deConnecteService.unsetAllocationMensuelleNetAAH();
    }
  }

  public onClickCheckBoxHasASS(): void {
    if (!this.beneficiaireAides.beneficiaireASS) {
      this.deConnecteService.unsetAllocationMensuelleNetASS();
    } else {
      this.deConnecteService.setAllocationMensuelleNetASS();
    }
  }

  public onClickCheckBoxHasRSA(): void {
    if (!this.beneficiaireAides.beneficiaireRSA) {
      this.deConnecteService.unsetInfosRSA();
    } else {
      this.deConnecteService.setAllocationRSA();
      this.deConnecteService.unsetConjointAllocationRSA();
    }
  }

  public onClickCheckBoxHasRevenusImmobilier(): void {
    if (!this.informationsPersonnelles.hasRevenusImmobilier) {
      this.deConnecteService.unsetRevenusImmobilier();
    }
  }

  public onClickCheckBoxHasPensionInvalidite(): void {
    if (!this.beneficiaireAides.beneficiairePensionInvalidite) {
      this.deConnecteService.unsetPensionInvalidite();
    } else {
      this.deConnecteService.setPensionInvalidite();
    }
  }

  public onSubmitInformationsPersonnellesForm(form: FormGroup): void {
    this.isInformationsPersonnellesFormSubmitted = true;
    this.checkAndSaveDateNaissanceDemandeurEmploiConnecte();
    if (this.isDonneesSaisiesFormulaireValides(form)) {
      if (this.isAllocationPeOuCafSelectionnee()) {
        this.getCodeInseeFromCodePostal(this.informationsPersonnelles.logement.coordonnees.codePostal);
        this.deConnecteService.setBeneficiaireAides(this.beneficiaireAides);
        this.deConnecteService.setInformationsPersonnelles(this.informationsPersonnelles);
        this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.MES_PERSONNES_A_CHARGE]);
      }
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement(this.elementRef);
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
      this.informationsPersonnelles.titreSejourEnFranceValide = null;
    }
  }

  public isAllocationPeOuCafSelectionnee(): boolean {
    return (this.beneficiaireAides.beneficiaireASS
      || this.beneficiaireAides.beneficiaireRSA
      || this.beneficiaireAides.beneficiaireAAH);
  }


  /************ gestion évènements press enter ************************/

  public handleKeyUpOnButtonTitreSejour(event: any, value: boolean): void {
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

  public handleKeyUpOnButtonSituationDemandeur(event: any, situationPersonne: string): void {
    if (event.keyCode === 13) {
      if (situationPersonne === this.situationPersonneEnum.ASS) {
        this.beneficiaireAides.beneficiaireASS = !this.beneficiaireAides.beneficiaireASS;
        this.onClickCheckBoxHasASS();
      }
      if (situationPersonne === this.situationPersonneEnum.AAH) {
        this.beneficiaireAides.beneficiaireAAH = !this.beneficiaireAides.beneficiaireAAH;
        this.onClickCheckBoxHasAAH();
      }
      if (situationPersonne === this.situationPersonneEnum.BENEFICIAIRE_REVENUS_IMMOBILIER) {
        this.informationsPersonnelles.hasRevenusImmobilier = !this.informationsPersonnelles.hasRevenusImmobilier;
        this.onClickCheckBoxIsTravailleurIndependant();
      }
      if (situationPersonne === this.situationPersonneEnum.MICRO_ENTREPRENEUR) {
        this.informationsPersonnelles.microEntrepreneur = !this.informationsPersonnelles.microEntrepreneur;
        this.onClickCheckBoxIsMicroEntrepreneur();
      }
      if (situationPersonne === this.situationPersonneEnum.TRAVAILLEUR_INDEPENDANT) {
        this.informationsPersonnelles.travailleurIndependant = !this.informationsPersonnelles.travailleurIndependant;
        this.onClickCheckBoxIsTravailleurIndependant();
      }
      if (situationPersonne === this.situationPersonneEnum.PENSION_INVALIDITE) {
        this.beneficiaireAides.beneficiairePensionInvalidite = !this.beneficiaireAides.beneficiairePensionInvalidite;
        this.onClickCheckBoxHasPensionInvalidite();
      }
      if (situationPersonne === this.situationPersonneEnum.RSA) {
        this.beneficiaireAides.beneficiaireRSA = !this.beneficiaireAides.beneficiaireRSA;
        this.onClickCheckBoxHasRSA();
      }
    }
  }

  public handleKeyUpOnButtonSituationConjoint(e: any, situationConjoint: string): void {
    if (e.keyCode === 13) {
      if (situationConjoint === this.situationPersonneEnum.AAH) {
        this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireAAH = !this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireAAH;
        this.onClickCheckBoxConjointHasAAH();
      }
      if (situationConjoint === this.situationPersonneEnum.SALARIE) {
        this.situationFamiliale.conjoint.informationsPersonnelles.salarie = !this.situationFamiliale.conjoint.informationsPersonnelles.salarie;
        this.onClickCheckBoxConjointIsSalarie();
      }
      if (situationConjoint === this.situationPersonneEnum.RSA) {
        this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireRSA = !this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireRSA;
        this.onClickCheckBoxConjointHasRSA();
      }
      if (situationConjoint === this.situationPersonneEnum.ARE) {
        this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireARE = !this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireARE;
        this.onClickCheckBoxConjointHasARE();
      }
      if (situationConjoint === this.situationPersonneEnum.ASS) {
        this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireASS = !this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireASS;
        this.onClickCheckBoxConjointHasASS();
      }
      if (situationConjoint === this.situationPersonneEnum.PENSION_INVALIDITE) {
        this.situationFamiliale.conjoint.beneficiaireAides.beneficiairePensionInvalidite = !this.situationFamiliale.conjoint.beneficiaireAides.beneficiairePensionInvalidite;
        this.onClickCheckBoxConjointHasPensionInvalidite();
      }
      if (situationConjoint === this.situationPersonneEnum.SANS_RESSOURCE) {
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
        || this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireAAH
        || this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireARE
        || this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireASS
        || this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireRSA
        || this.situationFamiliale.conjoint.beneficiaireAides.beneficiairePensionInvalidite
        || this.situationFamiliale.conjoint.informationsPersonnelles.travailleurIndependant
        || this.situationFamiliale.conjoint.informationsPersonnelles.microEntrepreneur);
  }

  public onClickCheckBoxConjointHasAAH(): void {
    if (!this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireAAH) {
      this.deConnecteService.unsetConjointAllocationAAH();
    } else {
      this.deConnecteService.setConjointAllocationAAH();
      this.situationFamiliale.conjoint.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxConjointHasASS(): void {
    if (!this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireASS) {
      this.deConnecteService.unsetConjointAllocationASS();
    } else {
      this.deConnecteService.setConjointAllocationASS();
      this.deConnecteService.unsetConjointAllocationARE();
      this.situationFamiliale.conjoint.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxConjointHasARE(): void {
    if (!this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireARE) {
      this.deConnecteService.unsetConjointAllocationARE();
    } else {
      this.deConnecteService.setConjointAllocationARE();
      this.deConnecteService.unsetConjointAllocationASS();
      this.situationFamiliale.conjoint.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxConjointHasRSA(): void {
    if (!this.situationFamiliale.conjoint.beneficiaireAides.beneficiaireRSA) {
      this.deConnecteService.unsetConjointAllocationRSA();
    } else {
      this.deConnecteService.setConjointAllocationRSA();
      this.situationFamiliale.conjoint.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxConjointIsMicroEntrepreneur(): void {
    if (!this.situationFamiliale.conjoint.informationsPersonnelles.microEntrepreneur) {
      this.deConnecteService.unsetConjointBeneficesMicroEntreprise();
    } else {
      this.deConnecteService.unsetConjointChiffreAffairesIndependant();
      this.situationFamiliale.conjoint.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxConjointIsTravailleurIndependant(): void {
    if (!this.situationFamiliale.conjoint.informationsPersonnelles.travailleurIndependant) {
      this.deConnecteService.unsetConjointChiffreAffairesIndependant();
    } else {
      this.deConnecteService.unsetConjointBeneficesMicroEntreprise();
      this.situationFamiliale.conjoint.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxConjointIsSalarie(): void {
    if (!this.situationFamiliale.conjoint.informationsPersonnelles.salarie) {
      this.deConnecteService.unsetConjointSalaire();
    } else {
      this.situationFamiliale.conjoint.ressourcesFinancieres.salaire = new Salaire();
      this.situationFamiliale.conjoint.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxConjointHasPensionInvalidite(): void {
    if (!this.situationFamiliale.conjoint.beneficiaireAides.beneficiairePensionInvalidite) {
      this.deConnecteService.unsetConjointPensionInvalidite();
    } else {
      this.deConnecteService.setConjointPensionInvalidite();
      this.situationFamiliale.conjoint.informationsPersonnelles.sansRessource = false;
    }
  }

  public onClickCheckBoxConjointIsSansRessource(): void {
    this.deConnecteService.unsetConjointSalaire();
    this.deConnecteService.unsetConjointAides();
    this.deConnecteService.unsetConjointBeneficesMicroEntreprise();
    this.deConnecteService.unsetConjointChiffreAffairesIndependant();
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

  private loadDataInformationsPersonnelles(demandeurEmploiConnecte: DemandeurEmploi): void {
    if (!demandeurEmploiConnecte.informationsPersonnelles) {
      this.informationsPersonnelles = this.informationsPersonnellesService.creerInformationsPersonnelles();
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
