import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { DeConnecteRessourcesFinancieresService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service";
import { DeConnecteSimulationAidesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-simulation-aides.service";
import { DeConnecteSituationFamilialeService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-situation-familiale.service";
import { DeConnecteBeneficiaireAidesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-beneficiaire-aides.service";
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { RessourcesFinancieresConjointComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-financieres-conjoint/ressources-financieres-conjoint.component';
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { RessourcesFinancieresFoyerComponent } from './ressources-financieres-foyer/ressources-financieres-foyer.component';
import { RessourcesFinancieresPersonnesAChargeComponent } from './ressources-financieres-personnes-a-charge/ressources-financieres-personnes-a-charge.component';
import { VosRessourcesFinancieresComponent } from './vos-ressources-financieres/vos-ressources-financieres.component';
import { InformationsPersonnelles } from '@app/commun/models/informations-personnelles';
import { InformationsPersonnellesService } from '@app/core/services/utile/informations-personnelles.service';

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

  ressourcesFinancieres: RessourcesFinancieres;
  informationsPersonnelles: InformationsPersonnelles;

  montantAidesFoyer: number;
  montantAidesPersonnesCharge: number;
  montantAidesRessourcesConjoint: number;
  montantAidesVosRessources: number;
  montantRevenusPersonnesCharge: number;
  montantRevenusRessourcesConjoint: number;
  montantRevenusVosRessources: number;

  montantVosRessources: number;
  montantRessourcesConjoint: number;
  montantRessourcesPersonnesCharge: number;
  montantRessourcesFoyer: number;

  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;

  ressourceConjointSeulementRSA: boolean;
  ressourcePersonnesAChargeSeulementRSA: boolean;
  conjointRSA: boolean;

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

  // services à injecter dynamiquement
  public controleChampFormulaireService: ControleChampFormulaireService;
  public deConnecteService: DeConnecteService;
  public deConnecteBeneficiaireAidesService: DeConnecteBeneficiaireAidesService;
  private deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService;
  private deConnecteSimulationAidesService: DeConnecteSimulationAidesService;
  public deConnecteSituationFamilialeService: DeConnecteSituationFamilialeService;
  private estimeApiService: EstimeApiService;
  private informationsPersonnellesService: InformationsPersonnellesService;
  public screenService: ScreenService;


  constructor(
    private elementRef: ElementRef,
    private injector: Injector,
    private router: Router
  ) {
    this.controleChampFormulaireService = injector.get<ControleChampFormulaireService>(ControleChampFormulaireService);
    this.deConnecteService = injector.get<DeConnecteService>(DeConnecteService);
    this.deConnecteBeneficiaireAidesService = injector.get<DeConnecteBeneficiaireAidesService>(DeConnecteBeneficiaireAidesService);
    this.deConnecteRessourcesFinancieresService = injector.get<DeConnecteRessourcesFinancieresService>(DeConnecteRessourcesFinancieresService);
    this.deConnecteSimulationAidesService = injector.get<DeConnecteSimulationAidesService>(DeConnecteSimulationAidesService);
    this.deConnecteSituationFamilialeService = injector.get<DeConnecteSituationFamilialeService>(DeConnecteSituationFamilialeService);
    this.estimeApiService = injector.get<EstimeApiService>(EstimeApiService);
    this.informationsPersonnellesService = injector.get<InformationsPersonnellesService>(InformationsPersonnellesService);
    this.screenService = injector.get<ScreenService>(ScreenService);
  }

  ngOnInit(): void {
    this.deConnecteService.controlerSiDemandeurEmploiConnectePresent();
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    this.loadDataRessourcesFinancieres(demandeurEmploiConnecte);
    this.loadDataInformationsPersonnelles(demandeurEmploiConnecte);
    this.calculerMontantsRessourcesFinancieres();
    this.ressourceConjointSeulementRSA = this.checkConjointToucheSeulementRSA();
    this.ressourcePersonnesAChargeSeulementRSA = this.checkPersonnesAChargeToucheSeulementRSA();
    if (this.deConnecteService.getDemandeurEmploiConnecte().situationFamiliale.isEnCouple
      && demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAides.beneficiaireRSA) {
      this.conjointRSA = true;
    } else {
      this.conjointRSA = false;
    }
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
          && (personne.ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite === null
            || personne.ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite === 0)
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
        && (conjoint.ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite === null
          || conjoint.ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite === 0)
        && !conjoint.informationsPersonnelles.microEntrepreneur
        && !conjoint.informationsPersonnelles.travailleurIndependant)
    ) {
      result = true;
    }
    return result;
  }

  public onClickPopoverRessourceFoyer(event) {
    event.stopPropagation();
  }

  public onClickClosePopoverRessourceFoyerTemplate(event, popoverRessourceFoyer) {
    event.stopPropagation();
    popoverRessourceFoyer.hide();
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
      this.estimeApiService.simulerMesAides(demandeurEmploiConnecte).then(
        (simulationAides) => {
          this.deConnecteSimulationAidesService.setSimulationAides(simulationAides);
          this.isPageLoadingDisplay = false;
          this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.RESULTAT_SIMULATION]);
        }, (erreur) => {
          this.isPageLoadingDisplay = false;
          this.messageErreur = MessagesErreurEnum.SIMULATION_IMPOSSIBLE
        }
      );
    } else {
      this.controleChampFormulaireService.focusOnFirstInvalidElement(this.elementRef);
    }
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.ETAPES_SIMULATION, RoutesEnum.MES_PERSONNES_A_CHARGE]);
  }

  public traiterValidationVosRessourcesEventEmitter(): void {
    this.isVosRessourcesDisplay = false;
    if (this.hasConjointAvecRessourcesFinancieresInvalide()) {
      this.isRessourcesConjointDisplay = true;
    } else if (this.hasPersonneAChargeAvecRessourcesFinancieresInvalide()) {
      this.isRessourcesPersonnesChargeDisplay = true;
    } else {
      this.isRessourcesFoyerDisplay = true;
    }
    this.montantRevenusVosRessources = this.deConnecteRessourcesFinancieresService.getMontantRevenusVosRessources();
    this.montantAidesVosRessources = this.deConnecteRessourcesFinancieresService.getMontantAidesVosRessources();
    this.montantVosRessources = this.deConnecteRessourcesFinancieresService.getMontantVosRessources();
  }

  public traiterValidationRessourcesFinancieresConjointEventEmitter(): void {
    this.isRessourcesConjointDisplay = false;
    if (this.deConnecteSituationFamilialeService.hasPersonneAChargeAvecRessourcesFinancieres()) {
      this.isRessourcesPersonnesChargeDisplay = true;
    } else {
      this.isRessourcesFoyerDisplay = true;
    }
    this.montantRevenusRessourcesConjoint = this.deConnecteRessourcesFinancieresService.getMontantRevenusRessourcesConjoint();
    this.montantAidesRessourcesConjoint = this.deConnecteRessourcesFinancieresService.getMontantAidesRessourcesConjoint();
    this.montantRessourcesConjoint = this.deConnecteRessourcesFinancieresService.getMontantRessourcesConjoint();
  }

  public traiterValidationRessourcesFinancieresPersonnesChargeEventEmitter(): void {
    this.isRessourcesPersonnesChargeDisplay = false;
    this.isRessourcesFoyerDisplay = true;
    this.montantAidesPersonnesCharge = this.deConnecteRessourcesFinancieresService.getMontantAidesRessourcesPersonnesCharge();
    this.montantRevenusPersonnesCharge = this.deConnecteRessourcesFinancieresService.getMontantRevenusRessourcesPersonnesCharge();
    this.montantRessourcesPersonnesCharge = this.deConnecteRessourcesFinancieresService.getMontantRessourcesPersonnesCharge();
  }

  public traiterValidationRessourcesFinancieresFoyerEventEmitter(): void {
    this.montantAidesFoyer = this.deConnecteRessourcesFinancieresService.getMontantAidesRessourcesFoyer();
    this.montantRessourcesFoyer = this.deConnecteRessourcesFinancieresService.getMontantRessourcesFoyer();
    this.isRessourcesFoyerDisplay = false;
  }

  private loadDataRessourcesFinancieres(demandeurEmploiConnecte: DemandeurEmploi): void {
    if (demandeurEmploiConnecte.ressourcesFinancieres) {
      this.ressourcesFinancieres = demandeurEmploiConnecte.ressourcesFinancieres;
    }
  }


  private loadDataInformationsPersonnelles(demandeurEmploiConnecte: DemandeurEmploi): void {
    if (demandeurEmploiConnecte.informationsPersonnelles) {
      this.informationsPersonnelles = demandeurEmploiConnecte.informationsPersonnelles;
    } else {
      this.informationsPersonnelles = this.informationsPersonnellesService.creerInformationsPersonnelles();
    }
  }

  private isSaisieFormulairesValide(): boolean {
    return this.isSaisieVosRessourcesFinancieresValide()
      && this.isSaisieRessourcesFinancieresConjointValide()
      && this.isSaisieRessourcesFinancieresPersonnesAChargeValide()
      && this.isSaisieRessourcesFinancieresFoyerValide()
      && this.deConnecteService.hasRessourcesFinancieres();
  }

  private calculerMontantsRessourcesFinancieres(): void {
    this.montantRevenusVosRessources = this.deConnecteRessourcesFinancieresService.getMontantRevenusVosRessources();
    this.montantAidesVosRessources = this.deConnecteRessourcesFinancieresService.getMontantAidesVosRessources();
    this.montantRevenusRessourcesConjoint = this.deConnecteRessourcesFinancieresService.getMontantRevenusRessourcesConjoint();
    this.montantAidesRessourcesConjoint = this.deConnecteRessourcesFinancieresService.getMontantAidesRessourcesConjoint();
    this.montantAidesPersonnesCharge = this.deConnecteRessourcesFinancieresService.getMontantAidesRessourcesPersonnesCharge();
    this.montantRevenusPersonnesCharge = this.deConnecteRessourcesFinancieresService.getMontantRevenusRessourcesPersonnesCharge();
    this.montantAidesFoyer = this.deConnecteRessourcesFinancieresService.getMontantAidesRessourcesFoyer();

    this.montantVosRessources = this.deConnecteRessourcesFinancieresService.getMontantVosRessources();
    this.montantRessourcesConjoint = this.deConnecteRessourcesFinancieresService.getMontantRessourcesConjoint();
    this.montantRessourcesPersonnesCharge = this.deConnecteRessourcesFinancieresService.getMontantRessourcesPersonnesCharge();
    this.montantRessourcesFoyer = this.deConnecteRessourcesFinancieresService.getMontantRessourcesFoyer()
  }

  private isSaisieVosRessourcesFinancieresValide(): boolean {
    let isValide = this.vosRessourcesFinancieresComponent.vosRessourcesFinancieresForm.valid;
    if (isValide) {
      isValide = this.deConnecteRessourcesFinancieresService.isDonneesRessourcesFinancieresValides(this.ressourcesFinancieres);
    }
    if (isValide) {
      isValide = this.deConnecteRessourcesFinancieresService.isDonneesRessourcesFinancieresFoyerValides(this.ressourcesFinancieres, this.informationsPersonnelles);
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
    if (!this.ressourcesFinancieresFoyerComponent.ressourcesFinancieresFoyerForm.valid) {
      this.isRessourcesFoyerDisplay = true;
      isSaisieFormulairesValide = false;
    }
    return isSaisieFormulairesValide;
  }

  private hasPersonneAChargeAvecRessourcesFinancieresInvalide(): boolean {
    let hasPersonneAChargeAvecRessourcesFinancieresInvalide = false;
    if (this.deConnecteSituationFamilialeService.hasPersonneAChargeAvecRessourcesFinancieres()
      && !this.deConnecteSituationFamilialeService.hasPersonneAChargeSeulementRSA()) {
      if (!this.ressourcesFinancieresPersonnesAChargeComponent.ressourcesFinancieresPersonnesChargeForm.valid
        || !this.deConnecteSituationFamilialeService.isRessourcesFinancieresPersonnesAChargeValides()) {
        hasPersonneAChargeAvecRessourcesFinancieresInvalide = true;
      }
    }
    return hasPersonneAChargeAvecRessourcesFinancieresInvalide;
  }

  private hasConjointAvecRessourcesFinancieresInvalide(): boolean {
    let hasConjointAvecRessourcesFinancieresInvalide = false;
    if (this.deConnecteSituationFamilialeService.hasConjointSituationAvecRessource()
      && !this.deConnecteSituationFamilialeService.hasConjointSeulementRSA()) {
      if ((!this.ressourcesFinancieresConjointComponent.ressourcesFinancieresConjointForm.valid)
        || !this.deConnecteSituationFamilialeService.isRessourcesFinancieresConjointValides()) {
        hasConjointAvecRessourcesFinancieresInvalide = true;
      }
    }
    return hasConjointAvecRessourcesFinancieresInvalide;
  }
}
