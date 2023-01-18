import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PageHeadlineEnum } from '@app/commun/enumerations/page-headline.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { TypeUtilisateurEnum } from '@app/commun/enumerations/type-utilisateur.enum';
import { AidesPoleEmploi } from '@app/commun/models/aides-pole-emploi';
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { RessourcesFinancieresAvantSimulation } from '@app/commun/models/ressources-financieres-avant-simulation';
import { DeConnecteRessourcesFinancieresAvantSimulationService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { ModalService } from '@app/core/services/utile/modal.service';
import { RessourcesFinancieresAvantSimulationUtileService } from '@app/core/services/utile/ressources-financieres-avant-simulation-utile.service';
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-ma-situation',
  templateUrl: './ma-situation.component.html',
  styleUrls: ['./ma-situation.component.scss']
})
export class MaSituationComponent implements OnInit {

  PageHeadlineEnum: typeof PageHeadlineEnum = PageHeadlineEnum;

  SEUIL_DEGRESSIVITE_ARE = 140;

  @Input() isModificationCriteres: boolean;
  @ViewChild('maSituationForm', { read: NgForm }) maSituationForm: UntypedFormGroup;
  isMaSituationFormSubmitted: boolean = false;

  demandeurEmploiConnecte: DemandeurEmploi;
  ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public screenService: ScreenService,
    public modalService: ModalService,
    public deConnecteService: DeConnecteService,
    private ressourcesFinancieresAvantSimulationService: RessourcesFinancieresAvantSimulationUtileService,
    private deConnecteRessourcesFinancieresAvantSimulationService: DeConnecteRessourcesFinancieresAvantSimulationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecteDebutParcours(TypeUtilisateurEnum.PARCOURS_RAPIDE);
    this.initRessourcesFinancieresAvantSimulation();
    this.initBeneficiaireAides();
  }

  private initRessourcesFinancieresAvantSimulation(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi == null) {
      this.ressourcesFinancieresAvantSimulation = new RessourcesFinancieresAvantSimulation();
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi = new AidesPoleEmploi();
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE = this.ressourcesFinancieresAvantSimulationService.creerAllocationARE();
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation = this.ressourcesFinancieresAvantSimulation;
      this.checkAndSaveDemandeurEmploiConnecte();
    } else {
      this.ressourcesFinancieresAvantSimulation = this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation;
    }
  }

  private initBeneficiaireAides(): void {
    this.demandeurEmploiConnecte.beneficiaireAides = new BeneficiaireAides();
    this.demandeurEmploiConnecte.beneficiaireAides.beneficiaireARE = true;
  }

  public hasDegressiviteAreSelectionne(): boolean {
    return this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre != null;
  }

  public isTauxDegressiviteAreSelectionne(): boolean {
    return this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit != null;
  }

  public onClickButtonRadioHasDegressiviteAreOui(): void {
    if (!this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre) {
      this.resetDonneesDegressivite();
    }
    this.isMaSituationFormSubmitted = false;
  }

  public onClickButtonRadioHasDegressiviteAreNon(): void {
    if (this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre) {
      this.resetDonneesDegressivite();
    }
    this.isMaSituationFormSubmitted = false;
  }

  public onClickCheckBoxTauxPlein(): void {
    this.isMaSituationFormSubmitted = false;
  }

  public onClickCheckBoxTauxReduit(): void {
    this.isMaSituationFormSubmitted = false;
  }

  public handleKeyUpOnButtonRadioHasDegressiviteAreOui(event: any) {
    if (event.keyCode === 13) {
      this.onClickButtonRadioHasDegressiviteAreOui();
    }
  }

  public handleKeyUpOnButtonRadioHasDegressiviteAreNon(event: any) {
    if (event.keyCode === 13) {
      this.onClickButtonRadioHasDegressiviteAreNon();
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
    return this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.salaireJournalierReferenceBrut >= this.SEUIL_DEGRESSIVITE_ARE;
  }

  public afficherQuestionTypeTauxDegressiviteAre(): boolean {
    return this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre;
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
      return (this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit) ? "à taux réduit" : "à taux plein";
    }
    return "";
  }

  private resetDonneesDegressivite(): void {
    this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit = null;
  }


  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.AVANT_COMMENCER_SIMULATION]);
  }

  public onSubmitMaSituationForm() {
    this.propagateAllocationJournaliere();
    this.isMaSituationFormSubmitted = true
    if (this.isDonneesSaisiesFormulaireValides()) {
      this.checkAndSaveDemandeurEmploiConnecte();
      if (!this.isModificationCriteres) this.router.navigate([RoutesEnum.PARCOURS_COMPLEMENT_ARE, RoutesEnum.ACTIVITE_REPRISE]);
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement();
    }
  }

  private propagateAllocationJournaliere(): void {
    if (!this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre ||
      (
        this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre
        && !this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit
      )
    ) {
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationJournaliereBruteTauxPlein = this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationJournaliereBrute;
    }
    this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.nombreJoursRestants = 1;
  }

  private checkAndSaveDemandeurEmploiConnecte(): void {
    this.deConnecteService.setRessourcesFinancieres(this.ressourcesFinancieresAvantSimulation);
  }

  private isDonneesSaisiesFormulaireValides(): boolean {
    return this.maSituationForm.valid && this.deConnecteRessourcesFinancieresAvantSimulationService.isDonneesRessourcesFinancieresAvantSimulationValidesComplementARE(this.ressourcesFinancieresAvantSimulation);
  }

  public isChampSJRInvalide(salaireJournalierReferenceBrut): boolean {
    return this.isChampSJREgalAZero(salaireJournalierReferenceBrut)
      || this.isChampSJRNonPresent(salaireJournalierReferenceBrut)
      || this.isChampSJRErreurMontant(salaireJournalierReferenceBrut);
  }

  public isChampSJREgalAZero(salaireJournalierReferenceBrut): boolean {
    return (this.isMaSituationFormSubmitted || salaireJournalierReferenceBrut?.touched) && (
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE
      && this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.salaireJournalierReferenceBrut == 0
    );

  }

  public isChampSJRNonPresent(salaireJournalierReferenceBrut): boolean {
    return (this.isMaSituationFormSubmitted || salaireJournalierReferenceBrut?.touched) && (
      salaireJournalierReferenceBrut?.errors?.required
      || this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.salaireJournalierReferenceBrut == null
    );
  }

  public isChampSJRErreurMontant(salaireJournalierReferenceBrut): boolean {
    return (this.isMaSituationFormSubmitted || salaireJournalierReferenceBrut?.touched)
      && salaireJournalierReferenceBrut?.errors?.pattern
  }

  public isChampAllocationJournaliereBrutTauxPleinInvalide(allocationJournaliereBruteTauxPlein): boolean {
    return this.isChampAllocationJournaliereBrutTauxPleinEgalAZero(allocationJournaliereBruteTauxPlein)
      || this.isChampAllocationJournaliereBrutTauxPleinNonPresent(allocationJournaliereBruteTauxPlein)
      || this.isChampAllocationJournaliereBrutErreurMontant(allocationJournaliereBruteTauxPlein);
  }

  public isChampAllocationJournaliereBrutTauxPleinEgalAZero(allocationJournaliereBruteTauxPlein): boolean {
    return (this.isMaSituationFormSubmitted || allocationJournaliereBruteTauxPlein?.touched) && (
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit && (
        this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE
        && this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationJournaliereBruteTauxPlein == 0
      )
    );
  }

  public isChampAllocationJournaliereBrutTauxPleinNonPresent(allocationJournaliereBruteTauxPlein): boolean {
    return (this.isMaSituationFormSubmitted || allocationJournaliereBruteTauxPlein?.touched) && (
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit && (
        allocationJournaliereBruteTauxPlein?.errors?.required
        || this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationJournaliereBruteTauxPlein == null
      )
    );
  }

  public isChampAllocationJournaliereBrutTauxPleinErreurMontant(allocationJournaliereBruteTauxPlein): boolean {
    return (this.isMaSituationFormSubmitted || allocationJournaliereBruteTauxPlein?.touched)
      && allocationJournaliereBruteTauxPlein?.errors?.pattern
  }

  public isChampAllocationJournaliereBrutInvalide(allocationJournaliereBrute): boolean {
    return this.isChampAllocationJournaliereBrutEgalAZero(allocationJournaliereBrute)
      || this.isChampAllocationJournaliereBrutNonPresent(allocationJournaliereBrute)
      || this.isChampAllocationJournaliereBrutErreurMontant(allocationJournaliereBrute);
  }

  public isChampAllocationJournaliereBrutEgalAZero(allocationJournaliereBrute): boolean {
    return (this.isMaSituationFormSubmitted || allocationJournaliereBrute?.touched) && (
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE
      && this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationJournaliereBrute == 0
    );
  }

  public isChampAllocationJournaliereBrutNonPresent(allocationJournaliereBrute): boolean {
    return (this.isMaSituationFormSubmitted || allocationJournaliereBrute?.touched) && (
      allocationJournaliereBrute?.errors?.required
      || this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationJournaliereBrute == null
    );
  }

  public isChampAllocationJournaliereBrutErreurMontant(allocationJournaliereBrute): boolean {
    return (this.isMaSituationFormSubmitted || allocationJournaliereBrute?.touched)
      && allocationJournaliereBrute?.errors?.pattern;
  }

}
