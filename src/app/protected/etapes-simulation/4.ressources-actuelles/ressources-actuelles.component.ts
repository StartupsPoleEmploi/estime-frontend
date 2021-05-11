import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { DeConnecteRessourcesFinancieresService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service";
import { DeConnecteSimulationAidesSocialesService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-simulation-aides-sociales.service";
import { DeConnecteSituationFamilialeService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-situation-familiale.service";
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { RessourcesFinancieresUtileService } from "@app/core/services/utile/ressources-financieres-utiles.service";
import { RessourcesFinancieresConjointComponent } from '@app/protected/etapes-simulation/4.ressources-actuelles/ressources-financieres-conjoint/ressources-financieres-conjoint.component';
import { BeneficiaireAidesSociales } from '@models/beneficiaire-aides-sociales';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { RessourcesFinancieresFoyerComponent } from './ressources-financieres-foyer/ressources-financieres-foyer.component';
import { RessourcesFinancieresPersonnesAChargeComponent } from './ressources-financieres-personnes-a-charge/ressources-financieres-personnes-a-charge.component';
import { VosRessourcesFinancieresComponent } from './vos-ressources-financieres/vos-ressources-financieres.component';

@Component({
  selector: 'app-ressources-actuelles',
  templateUrl: './ressources-actuelles.component.html',
  styleUrls: ['./ressources-actuelles.component.scss']
})
export class RessourcesActuellesComponent implements OnInit {

  beneficiaireAidesSociales: BeneficiaireAidesSociales;

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

  montantAidesFoyer: number;
  montantAidesPersonnesCharge: number;
  montantAidesRessourcesConjoint: number;
  montantAidesVosRessources: number;
  montantRevenusPersonnesCharge: number;
  montantRevenusRessourcesConjoint: number;
  montantRevenusVosRessources: number;

  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;

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

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public deConnecteService: DeConnecteService,
    private deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    private deConnecteSimulationAidesSocialesService: DeConnecteSimulationAidesSocialesService,
    public deConnecteSituationFamilialeService: DeConnecteSituationFamilialeService,
    private elementRef: ElementRef,
    private estimeApiService: EstimeApiService,
    private ressourcesFinancieresUtileService: RessourcesFinancieresUtileService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.loadDataRessourcesFinancieres();
    this.calculerMontantsRessourcesFinancieres();
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
        (simulationAidesSociales) => {
          this.deConnecteSimulationAidesSocialesService.setSimulationAidesSociales(simulationAidesSociales);
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
  }

  public traiterValidationRessourcesFinancieresPersonnesChargeEventEmitter(): void {
    this.isRessourcesPersonnesChargeDisplay = false;
    this.isRessourcesFoyerDisplay = true;
    this.montantAidesPersonnesCharge = this.deConnecteRessourcesFinancieresService.getMontantAidesRessourcesPersonnesCharge();
    this.montantRevenusPersonnesCharge = this.deConnecteRessourcesFinancieresService.getMontantRevenusRessourcesPersonnesCharge();
  }

  public traiterValidationRessourcesFinancieresFoyerEventEmitter(): void {
    this.montantAidesFoyer = this.deConnecteRessourcesFinancieresService.getMontantAidesRessourcesFoyer();
    this.isRessourcesFoyerDisplay = false;
  }

  private loadDataRessourcesFinancieres(): void {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieres) {
      this.ressourcesFinancieres = demandeurEmploiConnecte.ressourcesFinancieres;
    } else {
      this.ressourcesFinancieres = this.ressourcesFinancieresUtileService.creerRessourcesFinancieres();
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
  }

  private isSaisieVosRessourcesFinancieresValide(): boolean {
    let isValide = this.vosRessourcesFinancieresComponent.vosRessourcesFinancieresForm.valid;
    if (isValide) {
      isValide = this.deConnecteRessourcesFinancieresService.isDonneesRessourcesFinancieresValides(this.ressourcesFinancieres);
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
    if (this.deConnecteSituationFamilialeService.hasPersonneAChargeAvecRessourcesFinancieres()) {
      if (!this.ressourcesFinancieresPersonnesAChargeComponent.ressourcesFinancieresPersonnesChargeForm.valid
        || !this.deConnecteSituationFamilialeService.isRessourcesFinancieresPersonnesAChargeValides()) {
          hasPersonneAChargeAvecRessourcesFinancieresInvalide = true;
        }
    }
    return hasPersonneAChargeAvecRessourcesFinancieresInvalide;
  }

  private hasConjointAvecRessourcesFinancieresInvalide(): boolean {
    let hasConjointAvecRessourcesFinancieresInvalide = false;
    if (this.deConnecteSituationFamilialeService.hasConjointSituationAvecRessource()) {
      if(!this.ressourcesFinancieresConjointComponent.ressourcesFinancieresConjointForm.valid
        || !this.deConnecteSituationFamilialeService.isRessourcesFinancieresConjointValides()) {
          hasConjointAvecRessourcesFinancieresInvalide = true;
      }
    }
    return hasConjointAvecRessourcesFinancieresInvalide;
  }
}
