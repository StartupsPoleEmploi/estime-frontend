import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { AidesPoleEmploi } from '@app/commun/models/aides-pole-emploi';
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { RessourcesFinancieresAvantSimulation } from '@app/commun/models/ressources-financieres-avant-simulation';
import { DeConnecteBeneficiaireAidesService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-beneficiaire-aides.service';
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

  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;

  SEUIL_DEGRESSIVITE_ARE = 140;

  @Input() isModificationCriteres: boolean;
  @ViewChild('maSituationForm', { read: NgForm }) maSituationForm: FormGroup;
  isMaSituationFormSubmitted: boolean = false;

  demandeurEmploiConnecte: DemandeurEmploi;
  ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation;


  hasDegressiviteAreOui: boolean;
  hasDegressiviteAreNon: boolean;
  isTauxReduit: boolean;
  isTauxPlein: boolean;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public screenService: ScreenService,
    public modalService: ModalService,
    public deConnecteService: DeConnecteService,
    private deConnecteBeneficiaireAidesService: DeConnecteBeneficiaireAidesService,
    private ressourcesFinancieresAvantSimulationService: RessourcesFinancieresAvantSimulationUtileService,
    private deConnecteRessourcesFinancieresAvantSimulationService: DeConnecteRessourcesFinancieresAvantSimulationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.initRessourcesFinancieresAvantSimulation();
    this.initBeneficiaireAides();
    this.loadDataForm();
  }

  private initRessourcesFinancieresAvantSimulation(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi == null) {
      this.ressourcesFinancieresAvantSimulation = new RessourcesFinancieresAvantSimulation();
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi = new AidesPoleEmploi();
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE = this.ressourcesFinancieresAvantSimulationService.creerAllocationARE();
    } else {
      this.ressourcesFinancieresAvantSimulation = this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation;
    }
  }

  private initBeneficiaireAides(): void {
    this.demandeurEmploiConnecte.beneficiaireAides = new BeneficiaireAides();
    this.demandeurEmploiConnecte.beneficiaireAides.beneficiaireARE = true;
  }

  private loadDataForm(): void {
    if (this.ressourcesFinancieresAvantSimulation != null && this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi != null && this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE != null) {
      this.hasDegressiviteAreNon = this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre === false;
      this.hasDegressiviteAreOui = this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre === true;
      this.isTauxPlein = this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxPlein;
      this.isTauxReduit = this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit;
    }
    this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.nombreJoursRestants = 1;
  }

  public hasDegressiviteAreSelectionne(): boolean {
    return (this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre != null && (this.hasDegressiviteAreOui != null || this.hasDegressiviteAreNon != null));
  }

  public isTauxDegressiviteAreSelectionne(): boolean {
    return (this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxPlein != null && this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit != null);
  }

  public onClickButtonRadioHasDegressiviteAreOui(event: any): void {
    event.preventDefault();
    if (this.hasDegressiviteAreOui) {
      this.hasDegressiviteAreNon = false;
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre = true;
    } else {
      this.resetDonneesARE();
    }
  }

  public onClickButtonRadioHasDegressiviteAreNon(event: any): void {
    event.preventDefault();
    if (this.hasDegressiviteAreNon) {
      this.hasDegressiviteAreOui = false;
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre = false;
      this.resetDonneesDegressivite();
    } else {
      this.resetDonneesARE();
    }
  }

  public onClickCheckBoxTauxPlein(event: any): void {
    event.preventDefault();
    if (this.isTauxPlein) {
      this.isTauxReduit = false;
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxPlein = true;
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit = false;
    } else {
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxPlein = null;
    }
  }

  public onClickCheckBoxTauxReduit(event: any): void {
    event.preventDefault();
    if (this.isTauxReduit) {
      this.isTauxPlein = false;
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit = true;
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxPlein = false;
    } else {
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxReduit = null;
    }
  }

  public handleKeyUpOnButtonRadioHasDegressiviteAreOui(event: any) {
    if (event.keyCode === 13) {
      this.onClickButtonRadioHasDegressiviteAreOui(event);
    }
  }

  public handleKeyUpOnButtonRadioHasDegressiviteAreNon(event: any) {
    if (event.keyCode === 13) {
      this.onClickButtonRadioHasDegressiviteAreNon(event);
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

  public afficherQuestionDegressiviteAre(): boolean {
    return this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.salaireJournalierReferenceBrut >= this.SEUIL_DEGRESSIVITE_ARE;
  }

  public afficherQuestionTypeTauxDegressiviteAre(): boolean {
    return (this.hasDegressiviteAreOui || this.hasDegressiviteAreNon) && this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre;
  }

  public afficherMontantAllocationAre(): boolean {
    return (
      (this.hasDegressiviteAreOui || this.hasDegressiviteAreNon) &&
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
    if (this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre) {
      return (this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxPlein) ? "à taux plein" : "à taux réduit";
    }
    return "";
  }

  private resetDonneesARE() {
    this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.hasDegressiviteAre = null;
    this.resetDonneesDegressivite();
  }

  private resetDonneesDegressivite(): void {
    this.isTauxPlein = null;
    this.isTauxReduit = null;
    this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.isTauxPlein = null;
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
    if (this.hasDegressiviteAreNon || (this.hasDegressiviteAreOui && this.isTauxPlein)) {
      this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationJournaliereBruteTauxPlein = this.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationJournaliereBrute;
    }
  }

  private checkAndSaveDemandeurEmploiConnecte(): void {
    this.deConnecteService.setRessourcesFinancieres(this.ressourcesFinancieresAvantSimulation);
  }

  private isDonneesSaisiesFormulaireValides(): boolean {
    return this.maSituationForm.valid && this.deConnecteRessourcesFinancieresAvantSimulationService.isDonneesRessourcesFinancieresAvantSimulationValides(this.ressourcesFinancieresAvantSimulation);
  }

}
