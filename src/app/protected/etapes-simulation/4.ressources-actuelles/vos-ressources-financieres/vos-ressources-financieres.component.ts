import { Component, ElementRef, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { DateDecomposee } from '@models/date-decomposee';
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
import { SituationFamilialeUtileService } from '@app/core/services/utile/situation-familiale.service';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { ModalService } from '@app/core/services/utile/modal.service';

@Component({
  selector: 'app-vos-ressources-financieres',
  templateUrl: './vos-ressources-financieres.component.html',
  styleUrls: ['./vos-ressources-financieres.component.scss']
})
export class VosRessourcesFinancieresComponent implements OnInit {

  dateDernierOuvertureDroitASS: DateDecomposee;
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

  @ViewChild('anneeDateDerniereOuvertureDroitASS', { read: ElementRef }) anneeDateDerniereOuvertureDroitASSInput: ElementRef;
  @ViewChild('moisDateDerniereOuvertureDroitASS', { read: ElementRef }) moisDateDerniereOuvertureDroitASSInput: ElementRef;
  @ViewChild('vosRessourcesFinancieresForm', { read: NgForm }) vosRessourcesFinancieresForm: FormGroup;


  constructor(
    private elementRef: ElementRef,
    public controleChampFormulaireService: ControleChampFormulaireService,
    public dateUtileService: DateUtileService,
    public deConnecteService: DeConnecteService,
    public deConnecteBeneficiaireAidesService: DeConnecteBeneficiaireAidesService,
    public deConnecteInfosPersonnellesService: DeConnecteInfosPersonnellesService,
    public deConnecteRessourcesFinancieresAvantSimulationService: DeConnecteRessourcesFinancieresAvantSimulationService,
    public deConnecteSituationFamilialeService: DeConnecteSituationFamilialeService,
    public modalService: ModalService,
    public ressourcesFinancieresAvantSimulationUtileService: RessourcesFinancieresAvantSimulationUtileService,
    public screenService: ScreenService,
    private situationFamilialeUtileService: SituationFamilialeUtileService
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
    this.loadDataSituationFamiliale(demandeurEmploiConnecte);
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
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxPlein = null;
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit = null;
    }
  }

  public onClickCheckBoxTauxPlein(event: any): void {
    event.preventDefault();
    if (this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxPlein) {
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit = false;
    }
  }

  public onClickCheckBoxTauxReduit(event: any): void {
    event.preventDefault();
    if (this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit) {
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxPlein = false;
    }
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
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxPlein = !this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxPlein;
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit = false;
      this.onClickCheckBoxTauxPlein(event);
    }
  }

  public handleKeyUpOnButtonTauxReduit(event: any): void {
    if (event.keyCode === 13) {
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit = !this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit;
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxPlein = false;
      this.onClickCheckBoxTauxReduit(event);
    }
  }

  public afficherMontantAllocationAre() {
    return (
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre != null &&
      (
        !this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre ||
        (
          this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxPlein != null &&
          this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit != null
        )
      )
    )
  }

  public getLibelleMontantBrutAllocationJournaliere(): string {
    if(this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre) {
      if(this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxPlein) {
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

  public onSubmitRessourcesFinancieresForm(form: FormGroup): void {
    this.isRessourcesFinancieresFormSubmitted = true;
    if (this.deConnecteBeneficiaireAidesService.isBeneficiaireASS()) {
      this.checkAndSaveDateDernierOuvertureDroitASS();
    }
    if (this.isDonneesSaisiesFormulaireValides(form)) {
      this.deConnecteService.setRessourcesFinancieres(this.ressourcesFinancieresAvantSimulation);
      this.validationVosRessourcesEventEmitter.emit();
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement(this.elementRef);
    }
  }

  private checkAndSaveDateDernierOuvertureDroitASS(): void {
    if (this.dateUtileService.isDateDecomposeeSaisieAvecInferieurDateJourValide(this.dateDernierOuvertureDroitASS)) {
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.dateDerniereOuvertureDroit = this.dateUtileService.getStringDateFromDateDecomposee(this.dateDernierOuvertureDroitASS);
    }
  }

  public isTauxDegressiviteAreSelectionne(): boolean {
    return (this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxPlein != null && this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit != null);
  }

  private isDonneesSaisiesFormulaireValides(form: FormGroup): boolean {
    let isValide = form.valid;
    if (isValide) {
      isValide = this.deConnecteRessourcesFinancieresAvantSimulationService.isDonneesRessourcesFinancieresAvantSimulationValides(this.ressourcesFinancieresAvantSimulation);
      // on vérifie si lorsque le formulaire est valide au niveau des données la saisie des champs salaires est valide également
      if (isValide) {
        isValide = this.deConnecteRessourcesFinancieresAvantSimulationService.isChampsSalairesValides(this.ressourcesFinancieresAvantSimulation);
        this.erreurSaisieSalaires = !isValide;
      }
    }
    return isValide;
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

  private loadDataSituationFamiliale(demandeurEmploiConnecte: DemandeurEmploi): void {
    if (demandeurEmploiConnecte.situationFamiliale) {
      this.situationFamiliale = demandeurEmploiConnecte.situationFamiliale;
    } else {
      this.situationFamiliale = this.situationFamilialeUtileService.creerSituationFamiliale();
    }
  }
}
