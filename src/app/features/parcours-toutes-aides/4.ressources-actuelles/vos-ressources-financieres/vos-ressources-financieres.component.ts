import { Component, Input, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { UntypedFormGroup, NgForm } from '@angular/forms';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { RessourcesFinancieresAvantSimulation } from '@app/commun/models/ressources-financieres-avant-simulation';
import { DeConnecteInfosPersonnellesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-infos-personnelles.service";
import { DeConnecteBeneficiaireAidesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-beneficiaire-aides.service";
import { RessourcesFinancieresAvantSimulationUtileService } from '@app/core/services/utile/ressources-financieres-avant-simulation-utile.service';
import { DeConnecteRessourcesFinancieresAvantSimulationService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { NombreMoisTravailles } from "@models/nombre-mois-travailles";
import { NumeroProchainMoisDeclarationTrimestrielle } from "@app/commun/models/numero-prochain-mois-declaration-trimestrielle";
import { ScreenService } from '@app/core/services/utile/screen.service';
import { DeConnecteSituationFamilialeService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-situation-familiale.service";
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';
import { SituationFamiliale } from '@models/situation-familiale';
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { ModalService } from '@app/core/services/utile/modal.service';
import { DemandeurEmploiService } from '@app/core/services/utile/demandeur-emploi.service';
import { DateDecomposee } from '@app/commun/models/date-decomposee';
import { LibellesTypesBeneficesEnum } from '@app/commun/enumerations/libelles-types-benefices';
import { CodesTypesBeneficesEnum } from '@app/commun/enumerations/codes-types-benefices';

@Component({
  selector: 'app-vos-ressources-financieres',
  templateUrl: './vos-ressources-financieres.component.html',
  styleUrls: ['./vos-ressources-financieres.component.scss']
})
export class VosRessourcesFinancieresComponent implements OnInit {

  dateDernierOuvertureDroitASS: DateDecomposee;
  libellesTypesBeneficesEnum: typeof LibellesTypesBeneficesEnum = LibellesTypesBeneficesEnum;
  codesTypesBeneficesEnum: typeof CodesTypesBeneficesEnum = CodesTypesBeneficesEnum;

  SEUIL_DEGRESSIVITE_ARE = 140;

  isRessourcesFinancieresFormSubmitted = false;
  optionsNombreMoisTravailles: Array<NombreMoisTravailles>;
  optionsProchaineDeclarationTrimestrielle: Array<NumeroProchainMoisDeclarationTrimestrielle>;
  // flag qui passe à vrai quand on a déclaré avoir toucher un salaire dans les derniers mois mais qu'on ne remplit aucun salaire
  erreurSaisieSalaires: boolean;

  informationsPersonnelles: InformationsPersonnelles;
  beneficiaireAides: BeneficiaireAides;
  situationFamiliale: SituationFamiliale;

  @Input() ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation;
  @Output() validationVosRessourcesEventEmitter = new EventEmitter<void>();
  @Output() openModalPensionInvaliditeEtSalaires = new EventEmitter<void>();

  @ViewChild('vosRessourcesFinancieresForm', { read: NgForm }) vosRessourcesFinancieresForm: UntypedFormGroup;
  @ViewChild('anneeDateDerniereOuvertureDroitASS', { read: ElementRef }) anneeDateDerniereOuvertureDroitASSInput: ElementRef;
  @ViewChild('moisDateDerniereOuvertureDroitASS', { read: ElementRef }) moisDateDerniereOuvertureDroitASSInput: ElementRef;


  constructor(
    private deConnecteService: DeConnecteService,
    private deConnecteRessourcesFinancieresAvantSimulationService: DeConnecteRessourcesFinancieresAvantSimulationService,
    private demandeurEmploiService: DemandeurEmploiService,
    public dateUtileService: DateUtileService,
    public controleChampFormulaireService: ControleChampFormulaireService,
    public deConnecteBeneficiaireAidesService: DeConnecteBeneficiaireAidesService,
    public deConnecteInfosPersonnellesService: DeConnecteInfosPersonnellesService,
    public deConnecteSituationFamilialeService: DeConnecteSituationFamilialeService,
    public modalService: ModalService,
    public ressourcesFinancieresAvantSimulationUtileService: RessourcesFinancieresAvantSimulationUtileService,
    public screenService: ScreenService,
  ) {
  }

  ngOnInit(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.beneficiaireAides = demandeurEmploiConnecte.beneficiaireAides;
    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireASS()) {
      this.dateDernierOuvertureDroitASS = this.dateUtileService.getDateDecomposeeFromStringDate(this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.dateDerniereOuvertureDroit, "date derniere ouverture droit ASS", "DateDerniereOuvertureDroitASS");
    }
    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireRSA() || this.deConnecteBeneficiaireAidesService.isBeneficiaireAAH()) {
      this.initOptionsProchaineDeclarationTrimestrielle();
    }
    if (this.ressourcesFinancieresAvantSimulation.hasTravailleAuCoursDerniersMois) {
      this.optionsNombreMoisTravailles = this.ressourcesFinancieresAvantSimulationUtileService.initOptionsNombreMoisTravailles();
      this.ressourcesFinancieresAvantSimulation = this.ressourcesFinancieresAvantSimulationUtileService.initSalairesAvantPeriodeSimulation(this.ressourcesFinancieresAvantSimulation);
    }
    this.situationFamiliale = this.demandeurEmploiService.loadDataSituationFamiliale(demandeurEmploiConnecte);
    this.informationsPersonnelles = demandeurEmploiConnecte.informationsPersonnelles;
  }

  public isBeneficiaireRSACelibataireSansEnfants(): boolean {
    let result = false;
    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireRSA()
      && !this.deConnecteSituationFamilialeService.hasConjointSituationAvecRessource()
      && !this.deConnecteSituationFamilialeService.hasPersonneAChargeAvecRessourcesFinancieres()
      && !(this.deConnecteSituationFamilialeService.isEnCouple()
        && this.deConnecteSituationFamilialeService.hasPersonneACharge())) {
      result = true;
    }
    return result;
  }

  /**
   * Fonction qui permet d'initialiser les options du select de mois de prochaine déclaration trimestrielle
   */
  private initOptionsProchaineDeclarationTrimestrielle() {
    this.optionsProchaineDeclarationTrimestrielle = new Array<NumeroProchainMoisDeclarationTrimestrielle>();
    for (let i = 0; i < 4; i++) {
      const numeroProchainMoisDeclarationTrimestrielle = new NumeroProchainMoisDeclarationTrimestrielle();
      numeroProchainMoisDeclarationTrimestrielle.value = i;
      numeroProchainMoisDeclarationTrimestrielle.label = this.dateUtileService.getLibelleMoisApresDateJour(i);
      this.optionsProchaineDeclarationTrimestrielle.push(numeroProchainMoisDeclarationTrimestrielle);
    }
  }

  public onClickButtonRadioHasDegressiviteAre(hasDegressiviteAre: boolean): void {
    this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre = hasDegressiviteAre;
    if (hasDegressiviteAre === false) {
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit = null;
    }
  }

  public onClickCheckBoxTauxPlein(): void {
    this.isRessourcesFinancieresFormSubmitted = false;
  }

  public onClickCheckBoxTauxReduit(): void {
    this.isRessourcesFinancieresFormSubmitted = false;
  }

  public onClickButtonRadioHasTravailleAuCoursDerniersMois(hasTravailleAuCoursDerniersMois: boolean): void {
    if (hasTravailleAuCoursDerniersMois === false) {
      this.ressourcesFinancieresAvantSimulation.nombreMoisTravaillesDerniersMois = 0;
      this.ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation = null;
      this.ressourcesFinancieresAvantSimulation.hasTravailleAuCoursDerniersMois = false;
      this.deConnecteService.unsetSalairesAvantPeriodeSimulation();
    } else {
      if (this.ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation == null) {
        this.ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation = this.ressourcesFinancieresAvantSimulationUtileService.creerSalairesAvantPeriodeSimulation();
      }
      if (this.optionsNombreMoisTravailles == null) {
        this.optionsNombreMoisTravailles = this.ressourcesFinancieresAvantSimulationUtileService.initOptionsNombreMoisTravailles();
      }
      if (this.deConnecteBeneficiaireAidesService.isBeneficiairePensionInvalidite()) {
        this.openModalPensionInvaliditeEtSalaires.emit();
      }
    }
  }

  public handleKeyUpOnButtonRadioHasDegressiviteAre(event: any, value: boolean) {
    if (event.keyCode === 13) {
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre = value;
      this.onClickButtonRadioHasDegressiviteAre(value);
    }
  }

  public handleKeyUpOnButtonTauxPlein(event: any): void {
    if (event.keyCode === 13) {
      this.onClickCheckBoxTauxPlein();
    }
  }

  public handleKeyUpOnButtonTauxReduit(event: any): void {
    if (event.keyCode === 13) {
      this.onClickCheckBoxTauxReduit();
    }
  }

  public afficherQuestionDegressiviteAre(): boolean {
    return this.deConnecteBeneficiaireAidesService.isBeneficiaireARE() && this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.salaireJournalierReferenceBrut >= this.SEUIL_DEGRESSIVITE_ARE;
  }

  public afficherQuestionTypeTauxDegressiviteAre(): boolean {
    return this.deConnecteBeneficiaireAidesService.isBeneficiaireARE() && this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre;
  }

  public afficherMontantAllocationAre(): boolean {
    return (
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre != null &&
      (
        !this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre ||
        this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit != null
      )
    )
  }

  public getLibelleMontantBrutAllocationJournaliere(): string {
    if (this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre) {
      if (!this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit) {
        return "Montant brut de votre allocation journalière à taux plein pour l’ARE";
      } else {
        return "Montant brut de votre allocation journalière à taux réduit pour l’ARE";
      }
    }
    return "Montant brut de votre allocation journalière pour l’ARE";
  }

  public hasQuatorzeMoisSansSalaire(): boolean {
    const isNull = (mois) => mois == null;
    return (this.ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation == null
      || this.ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation.mois.every(isNull));
  }

  public handleKeyUpOnButtonRadioHasTravailleAuCoursDerniersMois(event: any, value: boolean) {
    if (event.keyCode === 13) {
      this.ressourcesFinancieresAvantSimulation.hasTravailleAuCoursDerniersMois = value;
      this.onClickButtonRadioHasTravailleAuCoursDerniersMois(value);
    }
  }

  public isAfficherSelectNombreMoisTravailles6DerniersMois(): boolean {
    return this.ressourcesFinancieresAvantSimulation.hasTravailleAuCoursDerniersMois === true &&
      (this.deConnecteBeneficiaireAidesService.isBeneficiaireAAH() || this.deConnecteBeneficiaireAidesService.isBeneficiaireASS());
  }

  public isAfficherChampsSalaires(): boolean {
    return this.ressourcesFinancieresAvantSimulation.hasTravailleAuCoursDerniersMois;
  }

  public onSubmitRessourcesFinancieresForm(form: UntypedFormGroup): void {
    this.isRessourcesFinancieresFormSubmitted = true;
    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireASS()) {
      this.checkAndSaveDateDernierOuvertureDroitASS();
    }
    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireARE()) {
      this.propageAllocationJournaliereARE()
    }
    if (this.informationsPersonnelles.isMicroEntrepreneur) {
      this.propageChiffreAffairesMicroEntreprise();
    }
    if (this.isDonneesSaisiesFormulaireValides(form)) {
      this.deConnecteService.setRessourcesFinancieres(this.ressourcesFinancieresAvantSimulation);
      this.deConnecteService.setInformationsPersonnelles(this.informationsPersonnelles);
      this.validationVosRessourcesEventEmitter.emit();
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement();
    }
  }

  private checkAndSaveDateDernierOuvertureDroitASS(): void {
    if (this.dateUtileService.isDateDecomposeeSaisieAvecInferieurDateJourValide(this.dateDernierOuvertureDroitASS)) {
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.dateDerniereOuvertureDroit = this.dateUtileService.getStringDateFromDateDecomposee(this.dateDernierOuvertureDroitASS);
    }
  }

  private propageAllocationJournaliereARE(): void {
    if (!this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre
      || (
        this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre
        && !this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit
      )) {
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationJournaliereBruteTauxPlein = this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationJournaliereBrute;
    }
  }

  private propageChiffreAffairesMicroEntreprise(): void {
    if (this.informationsPersonnelles.microEntreprise != null) {
      if (!this.isDateCreationRepriseEntrepriseAvantNMoins2()) {
        this.informationsPersonnelles.microEntreprise.chiffreAffairesNMoins2 = 0;
      }
      if (!this.isDateCreationRepriseEntrepriseAvantNMoins1()) {
        this.informationsPersonnelles.microEntreprise.chiffreAffairesNMoins1 = 0;
      }
    }
  }

  public isTauxDegressiviteAreSelectionne(): boolean {
    return this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit != null;
  }

  /*** gestion évènement dateDernierOuvertureDroitASS */

  public onChangeOrKeyUpDateDerniereOuvertureDroitASSJour(event): void {
    event.stopPropagation();
    const value = this.dateDernierOuvertureDroitASS.jour;
    if (value && value.length === 2) {
      this.moisDateDerniereOuvertureDroitASSInput.nativeElement.focus();
    }
    this.dateUtileService.checkFormatJour(this.dateDernierOuvertureDroitASS);
  }

  public onChangeOrKeyUpDateDerniereOuvertureDroitASSMois(event): void {
    event.stopPropagation();
    const value = this.dateDernierOuvertureDroitASS.mois;
    if (value && value.length === 2) {
      this.anneeDateDerniereOuvertureDroitASSInput.nativeElement.focus();
    }
    this.dateUtileService.checkFormatMois(this.dateDernierOuvertureDroitASS);
  }

  public onChangeOrKeyUpDateDerniereOuvertureDroitASSAnnee(event): void {
    event.stopPropagation();
    this.dateUtileService.checkFormatAnnee(this.dateDernierOuvertureDroitASS);
  }


  private isDonneesSaisiesFormulaireValides(form: UntypedFormGroup): boolean {
    let isValide = form.valid;
    if (isValide) {
      isValide = this.deConnecteRessourcesFinancieresAvantSimulationService.isDonneesRessourcesFinancieresAvantSimulationValides(this.ressourcesFinancieresAvantSimulation, this.informationsPersonnelles);
      // on vérifie si lorsque le formulaire est valide au niveau des données la saisie des champs salaires est valide également
      if (isValide) {
        isValide = this.deConnecteRessourcesFinancieresAvantSimulationService.isChampsSalairesValides(this.ressourcesFinancieresAvantSimulation);
        this.erreurSaisieSalaires = !isValide;
      }
    }
    return isValide;
  }

  public checkChangePensionInvaliditeEtSalaire(nouveauSalaire) {
    if (this.deConnecteBeneficiaireAidesService.isBeneficiairePensionInvalidite()) {
      if (nouveauSalaire > 0) {
        this.openModalPensionInvaliditeEtSalaires.emit();
      }
    }
  }

  public isDateCreationRepriseEntrepriseN(): boolean {
    if (this.deConnecteInfosPersonnellesService.hasMicroEntreprise()) {
      return this.dateUtileService.isStringDateAnneeN(this.informationsPersonnelles.microEntreprise.dateRepriseCreationEntreprise);
    }
  }

  public isDateCreationRepriseEntrepriseAvantNMoins1(): boolean {
    if (this.deConnecteInfosPersonnellesService.hasMicroEntreprise()) {
      return this.dateUtileService.isStringDateAnneeAvantNMoins1(this.informationsPersonnelles.microEntreprise.dateRepriseCreationEntreprise);
    }
  }

  public isDateCreationRepriseEntrepriseAvantNMoins2(): boolean {
    if (this.deConnecteInfosPersonnellesService.hasMicroEntreprise()) {
      return this.dateUtileService.isStringDateAnneeAvantNMoins2(this.informationsPersonnelles.microEntreprise.dateRepriseCreationEntreprise);
    }
  }

  public onClickCheckBoxIsBIC(): void {
    if (this.informationsPersonnelles.microEntreprise.typeBenefices == CodesTypesBeneficesEnum.BIC) {
      this.informationsPersonnelles.microEntreprise.typeBenefices = CodesTypesBeneficesEnum.BIC;
    }
  }

  public handleKeyUpOnButtonIsBIC(event: any): void {
    if (event.keyCode === 13) {
      this.onClickCheckBoxIsBIC();
    }
  }

  public onClickCheckBoxIsBNC(): void {
    if (this.informationsPersonnelles.microEntreprise.typeBenefices == CodesTypesBeneficesEnum.BNC) {
      this.informationsPersonnelles.microEntreprise.typeBenefices = CodesTypesBeneficesEnum.BNC;
    }
  }

  public handleKeyUpOnButtonIsBNC(event: any): void {
    if (event.keyCode === 13) {
      this.onClickCheckBoxIsBNC();
    }
  }

  public onClickCheckBoxIsAR(): void {
    if (this.informationsPersonnelles.microEntreprise.typeBenefices == CodesTypesBeneficesEnum.AR) {
      this.informationsPersonnelles.microEntreprise.typeBenefices = CodesTypesBeneficesEnum.AR;
    }
  }

  public handleKeyUpOnButtonIsAR(event: any): void {
    if (event.keyCode === 13) {
      this.onClickCheckBoxIsAR();
    }
  }

  public isTypeBeneficesMicroEntrepriseValide() {
    return this.informationsPersonnelles.microEntreprise.typeBenefices
      && (
        this.informationsPersonnelles.microEntreprise.typeBenefices == CodesTypesBeneficesEnum.AR
        || this.informationsPersonnelles.microEntreprise.typeBenefices == CodesTypesBeneficesEnum.BIC
        || this.informationsPersonnelles.microEntreprise.typeBenefices == CodesTypesBeneficesEnum.BNC
      );
  }
}
