import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DeConnecteRessourcesFinancieresAvantSimulationService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service";
import { DeConnecteSimulationService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-simulation.service";
import { DeConnecteSituationFamilialeService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-situation-familiale.service";
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { RessourcesFinancieresConjointComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-financieres-conjoint/ressources-financieres-conjoint.component';
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';
import { RessourcesFinancieresAvantSimulation } from '@app/commun/models/ressources-financieres-avant-simulation';
import { RessourcesFinancieresFoyerComponent } from './ressources-financieres-foyer/ressources-financieres-foyer.component';
import { RessourcesFinancieresPersonnesAChargeComponent } from './ressources-financieres-personnes-a-charge/ressources-financieres-personnes-a-charge.component';
import { VosRessourcesFinancieresComponent } from './vos-ressources-financieres/vos-ressources-financieres.component';
import { InformationsPersonnelles } from '@app/commun/models/informations-personnelles';
import { NombreMoisTravailles } from '@app/commun/models/nombre-mois-travailles';
import { Simulation } from '@app/commun/models/simulation';
import { DemandeurEmploiService } from '@app/core/services/utile/demandeur-emploi.service';
import { ModalService } from '@app/core/services/utile/modal.service';

@Component({
  selector: 'app-ressources-actuelles',
  templateUrl: './ressources-actuelles.component.html',
  styleUrls: ['./ressources-actuelles.component.scss']
})
export class RessourcesActuellesComponent implements OnInit {

  beneficiaireAides: BeneficiaireAides;

  //gestion affichage accordions
  isVosRessourcesDisplay = true;
  isRessourcesConjointDisplay = false;
  isRessourcesPersonnesChargeDisplay = false;
  isRessourcesFoyerDisplay = false;

  //gestion du formulaire
  isRessourcesFinancieresFormInvalide = false;
  isRessourcesFinancieresFormSubmitted = false;

  //appel service http : gestion loading et erreur
  isPageLoadingDisplay = false;
  messageErreur: string;

  //gestion de la pension d'invalidité et des salaires
  isSimulationImpossiblePensionInvaliditeEtSalaire = false;

  ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation;
  informationsPersonnelles: InformationsPersonnelles;

  vosRessourcesValidees: boolean;
  ressourcesConjointValidees: boolean;
  ressourcesPersonnesAChargeValidees: boolean;
  ressourcesFoyerValidees: boolean;

  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;

  ressourceConjointSeulementRSA: boolean;
  ressourcePersonnesAChargeSeulementRSA: boolean;
  conjointRSA: boolean;

  optionsNombreMoisTravailles: Array<NombreMoisTravailles>;

  nombreMoisCumulAssSalaireSelectOptions = [
    { label: "1 mois", value: 1, default: true },
    { label: "2 mois", value: 2, default: false },
    { label: "3 mois", value: 3, default: false }
  ];

  //récupération des composants enfants
  @ViewChild(RessourcesFinancieresConjointComponent) ressourcesFinancieresConjointComponent: RessourcesFinancieresConjointComponent;
  @ViewChild(RessourcesFinancieresFoyerComponent) ressourcesFinancieresFoyerComponent: RessourcesFinancieresFoyerComponent;
  @ViewChild(RessourcesFinancieresPersonnesAChargeComponent) ressourcesFinancieresPersonnesAChargeComponent: RessourcesFinancieresPersonnesAChargeComponent;
  @ViewChild(VosRessourcesFinancieresComponent) vosRessourcesFinancieresComponent: VosRessourcesFinancieresComponent;
  @ViewChild('modalPensionInvaliditeEtSalaires') modalPensionInvaliditeEtSalaires;

  constructor(
    private deConnecteService: DeConnecteService,
    private deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresAvantSimulationService,
    private deConnecteSimulationService: DeConnecteSimulationService,
    private demandeurEmploiService: DemandeurEmploiService,
    private estimeApiService: EstimeApiService,
    private router: Router,
    public deConnecteSituationFamilialeService: DeConnecteSituationFamilialeService,
    private modalService: ModalService,
    public screenService: ScreenService,
    public controleChampFormulaireService: ControleChampFormulaireService,
  ) {
  }

  ngOnInit(): void {
    this.deConnecteService.controlerSiDemandeurEmploiConnectePresent();
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.ressourcesFinancieresAvantSimulation = this.demandeurEmploiService.loadDataRessourcesFinancieresAvantSimulation(demandeurEmploiConnecte);
    this.informationsPersonnelles = this.demandeurEmploiService.loadDataInformationsPersonnelles(demandeurEmploiConnecte);
    this.ressourceConjointSeulementRSA = this.checkConjointToucheSeulementRSA();
    this.ressourcePersonnesAChargeSeulementRSA = this.checkPersonnesAChargeToucheSeulementRSA();
    if (this.deConnecteService.getDemandeurEmploiConnecte().situationFamiliale.isEnCouple
      && demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAides.beneficiaireRSA) {
      this.conjointRSA = true;
    } else {
      this.conjointRSA = false;
    }
    this.isSimulationImpossiblePensionInvaliditeEtSalaire = false;
    this.vosRessourcesValidees = this.isDonneesSaisieVosRessourcesFinancieresAvantSimulationValide();
    this.ressourcesConjointValidees = !this.hasConjointAvecRessourcesFinancieresInvalide();
    this.ressourcesPersonnesAChargeValidees = !this.hasPersonneAChargeAvecRessourcesFinancieresInvalide();
    this.ressourcesFoyerValidees = this.isDonneesSaisieRessourcesFinancieresFoyerValide();
    this.controleChampFormulaireService.focusOnFirstElement();
  }

  private checkPersonnesAChargeToucheSeulementRSA(): boolean {
    let result = false;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    const personnesACharge = demandeurEmploiConnecte.situationFamiliale.personnesACharge;
    if (personnesACharge != null && personnesACharge.length > 0) {
      for (let personne of personnesACharge) {
        if (personne.beneficiaireAides.beneficiaireRSA
          && !personne.informationsPersonnelles.salarie
          && !personne.beneficiaireAides.beneficiaireAAH
          && !personne.beneficiaireAides.beneficiaireARE
          && !personne.beneficiaireAides.beneficiaireASS
          && !personne.beneficiaireAides.beneficiairePensionInvalidite
          && !personne.informationsPersonnelles.microEntrepreneur
          && !personne.informationsPersonnelles.travailleurIndependant) {
          result = true;
        } else {
          result = false;
        }
      }
    }
    return result;
  }

  private checkConjointToucheSeulementRSA(): boolean {
    let result = false;
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    const conjoint = demandeurEmploiConnecte.situationFamiliale.conjoint;
    if (demandeurEmploiConnecte.situationFamiliale.isEnCouple
      && conjoint != null
      && (conjoint.beneficiaireAides.beneficiaireRSA
        && !conjoint.informationsPersonnelles.salarie
        && !conjoint.beneficiaireAides.beneficiaireAAH
        && !conjoint.beneficiaireAides.beneficiaireARE
        && !conjoint.beneficiaireAides.beneficiaireASS
        && !conjoint.beneficiaireAides.beneficiairePensionInvalidite
        && !conjoint.informationsPersonnelles.microEntrepreneur
        && !conjoint.informationsPersonnelles.travailleurIndependant)
    ) {
      result = true;
    }
    return result;
  }

  public onClickButtonVosRessources(): void {
    this.isVosRessourcesDisplay = !this.isVosRessourcesDisplay;
  }

  public onClickButtonRessourcesConjoint(): void {
    this.isRessourcesConjointDisplay = !this.isRessourcesConjointDisplay;
  }

  public onClickButtonRessourcesPersonnesCharge(): void {
    this.isRessourcesPersonnesChargeDisplay = !this.isRessourcesPersonnesChargeDisplay;
  }

  public onClickButtonRessourcesFoyer(): void {
    this.isRessourcesFoyerDisplay = !this.isRessourcesFoyerDisplay;
  }

  public onClickButtonObtenirSimulation(): void {
    if (this.isSaisieFormulairesValide()) {
      this.isPageLoadingDisplay = true;
      const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
      if (!this.deConnecteRessourcesFinancieresService.hasPensionInvaliditeAvecSalaireAvantSimulation()) {
        this.isSimulationImpossiblePensionInvaliditeEtSalaire = false;
        this.estimeApiService.simulerMesAides(demandeurEmploiConnecte).subscribe({
          next: this.traiterRetourSimulerMesAides.bind(this),
          error: this.traiterErreurSimulerMesAides.bind(this)
        });
      } else {
        this.isPageLoadingDisplay = false;
        this.modalService.openModal(this.modalPensionInvaliditeEtSalaires);
        // this.messageErreur = MessagesErreurEnum.SIMULATION_IMPOSSIBLE_PENSION_INVALIDITE_ET_SALAIRES;
      }
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement();
    }
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.MES_PERSONNES_A_CHARGE]);
  }

  public traiterValidationVosRessourcesEventEmitter(): void {
    this.isVosRessourcesDisplay = false;
    if (this.deConnecteSituationFamilialeService.hasConjoint()) {
      this.isRessourcesConjointDisplay = true;
    } else if (this.deConnecteSituationFamilialeService.hasPersonneAChargeAgeLegal()) {
      this.isRessourcesPersonnesChargeDisplay = true;
    } else {
      this.isRessourcesFoyerDisplay = true;
    }
    this.vosRessourcesValidees = true;
  }

  public traiterValidationRessourcesFinancieresConjointEventEmitter(): void {
    this.isRessourcesConjointDisplay = false;
    if (this.deConnecteSituationFamilialeService.hasPersonneAChargeAgeLegal()) {
      this.isRessourcesPersonnesChargeDisplay = true;
    } else {
      this.isRessourcesFoyerDisplay = true;
    }
    this.ressourcesConjointValidees = true;
  }

  public traiterValidationRessourcesFinancieresPersonnesChargeEventEmitter(): void {
    this.isRessourcesPersonnesChargeDisplay = false;
    this.isRessourcesFoyerDisplay = true;
    this.ressourcesPersonnesAChargeValidees = true;
  }

  public traiterValidationRessourcesFinancieresFoyerEventEmitter(): void {
    this.isRessourcesFoyerDisplay = false;
    this.ressourcesFoyerValidees = true;
  }

  public isVosRessourcesValides(): boolean {
    return !this.isVosRessourcesDisplay && this.vosRessourcesValidees;
  }

  public isRessourcesConjointValides(): boolean {
    return !this.isRessourcesConjointDisplay && this.ressourcesConjointValidees;
  }

  public isRessourcesPersonnesAChargeValides(): boolean {
    return !this.isRessourcesPersonnesChargeDisplay && this.ressourcesPersonnesAChargeValidees;
  }

  public isRessourcesFoyerValides(): boolean {
    return !this.isRessourcesFoyerDisplay && this.ressourcesFoyerValidees;
  }

  private isSaisieFormulairesValide(): boolean {
    return this.isSaisieVosRessourcesFinancieresValide()
      && this.isSaisieRessourcesFinancieresConjointValide()
      && this.isSaisieRessourcesFinancieresPersonnesAChargeValide()
      && this.isSaisieRessourcesFinancieresFoyerValide()
      && this.deConnecteService.hasRessourcesFinancieres();
  }

  private isSaisieVosRessourcesFinancieresValide(): boolean {
    let isValide = this.vosRessourcesFinancieresComponent.vosRessourcesFinancieresForm.valid;
    if (isValide) {
      isValide = this.isDonneesSaisieVosRessourcesFinancieresAvantSimulationValide();
    }
    if (!isValide) {
      this.isVosRessourcesDisplay = true;
    }

    return isValide;
  }

  private isSaisieRessourcesFinancieresConjointValide(): boolean {
    let isSaisieFormulairesValide = true;
    if (this.hasConjointAvecRessourcesFinancieresInvalide()) {
      this.isRessourcesConjointDisplay = true;
      isSaisieFormulairesValide = false;
    }
    return isSaisieFormulairesValide;
  }

  private isSaisieRessourcesFinancieresPersonnesAChargeValide(): boolean {
    let isSaisieFormulairesValide = true;
    if (this.hasPersonneAChargeAvecRessourcesFinancieresInvalide()) {
      this.isRessourcesPersonnesChargeDisplay = true;
      isSaisieFormulairesValide = false;
    }
    return isSaisieFormulairesValide;
  }

  private isSaisieRessourcesFinancieresFoyerValide(): boolean {
    let isSaisieFormulairesValide = true;
    if (!this.isDonneesSaisieRessourcesFinancieresFoyerValide()) {
      this.isRessourcesFoyerDisplay = true;
      isSaisieFormulairesValide = false;
    }
    return isSaisieFormulairesValide;
  }

  private isDonneesSaisieVosRessourcesFinancieresAvantSimulationValide(): boolean {
    return this.deConnecteRessourcesFinancieresService.isDonneesRessourcesFinancieresAvantSimulationValides(this.ressourcesFinancieresAvantSimulation)
      && this.deConnecteRessourcesFinancieresService.isChampsSalairesValides(this.ressourcesFinancieresAvantSimulation);
  }

  private isDonneesSaisieRessourcesFinancieresFoyerValide(): boolean {
    return this.deConnecteRessourcesFinancieresService.isDonneesRessourcesFinancieresAvantSimulationFoyerValides(this.ressourcesFinancieresAvantSimulation, this.informationsPersonnelles);
  }

  private hasPersonneAChargeAvecRessourcesFinancieresInvalide(): boolean {
    let hasPersonneAChargeAvecRessourcesFinancieresInvalide = false;
    if (this.deConnecteSituationFamilialeService.hasPersonneAChargeAvecRessourcesFinancieres()
      && !this.deConnecteSituationFamilialeService.hasPersonneAChargeSeulementRSA()) {
      if ((!this.ressourcesFinancieresPersonnesAChargeComponent
        || !this.ressourcesFinancieresPersonnesAChargeComponent.ressourcesFinancieresPersonnesChargeForm
        || !this.ressourcesFinancieresPersonnesAChargeComponent.ressourcesFinancieresPersonnesChargeForm.valid)
        && !this.deConnecteSituationFamilialeService.isRessourcesFinancieresPersonnesAChargeValides()) {
        hasPersonneAChargeAvecRessourcesFinancieresInvalide = true;
      }
    }
    return hasPersonneAChargeAvecRessourcesFinancieresInvalide;
  }

  private hasConjointAvecRessourcesFinancieresInvalide(): boolean {
    let hasConjointAvecRessourcesFinancieresInvalide = false;
    if (this.deConnecteSituationFamilialeService.hasConjointSituationAvecRessource()
      && !this.deConnecteSituationFamilialeService.hasConjointSeulementRSA()) {
      if ((!this.ressourcesFinancieresConjointComponent
        || !this.ressourcesFinancieresConjointComponent.ressourcesFinancieresConjointForm
        || !this.ressourcesFinancieresConjointComponent.ressourcesFinancieresConjointForm.valid)
        && !this.deConnecteSituationFamilialeService.isRessourcesFinancieresConjointValides()) {
        hasConjointAvecRessourcesFinancieresInvalide = true;
      }
    }
    return hasConjointAvecRessourcesFinancieresInvalide;
  }

  private traiterRetourSimulerMesAides(simulation: Simulation): void {
    this.deConnecteSimulationService.setSimulation(simulation);
    this.isPageLoadingDisplay = false;
    this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.RESULTAT_SIMULATION]);
  }

  private traiterErreurSimulerMesAides(): void {
    this.isPageLoadingDisplay = false;
    this.messageErreur = MessagesErreurEnum.SIMULATION_IMPOSSIBLE;
  }
}
