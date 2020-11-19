import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { AllocationsCAF } from '@app/commun/models/allocations-caf';
import { AllocationsPoleEmploi } from '@app/commun/models/allocations-pole-emploi';
import { BeneficiaireAidesSociales } from '@app/commun/models/beneficiaire-aides-sociales';
import { DateDecomposee } from '@app/commun/models/date-decomposee';
import { RessourcesFinancieres } from '@app/commun/models/ressources-financieres';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { RessourcesFinancieresConjointComponent } from '@app/protected/ressources-financieres/ressources-financieres-conjoint/ressources-financieres-conjoint.component';
import { RessourcesFinancieresFoyerComponent } from './ressources-financieres-foyer/ressources-financieres-foyer.component';
import { VosRessourcesFinancieresComponent } from './vos-ressources-financieres/vos-ressources-financieres.component';
import { RessourcesFinancieresPersonnesAChargeComponent } from './ressources-financieres-personnes-a-charge/ressources-financieres-personnes-a-charge.component';

@Component({
  selector: 'app-ressources-financieres',
  templateUrl: './ressources-financieres.component.html',
  styleUrls: ['./ressources-financieres.component.scss']
})
export class RessourcesFinancieresComponent implements OnInit {

  isVosRessourcesDisplay = true;
  isRessourcesConjointDisplay = false;
  isRessourcesPersonnesChargeDisplay = false;
  isRessourcesFoyerDisplay = false;
  isPageLoadingDisplay = false;
  messageErreur: string;
  ressourcesFinancieres: RessourcesFinancieres;
  beneficiaireAidesSociales: BeneficiaireAidesSociales;
  dateDernierOuvertureDroitASS: DateDecomposee;
  isRessourcesFinancieresFormSubmitted = false;
  isRessourcesFinancieresFormInvalide = false;
  montantAidesFoyer: number;
  montantAidesPersonnesCharge: number;
  montantAidesRessourcesConjoint: number;
  montantAidesVosRessources: number;
  montantRevenusPersonnesCharge: number;
  montantRevenusRessourcesConjoint: number;
  montantRevenusVosRessources: number;

  nombreMoisCumulAssSalaireSelectOptions = [
    { label: "1 mois", value: 1, default: true },
    { label: "2 mois", value: 2, default: false },
    { label: "3 mois", value: 3, default: false }
  ];

  @ViewChild(RessourcesFinancieresConjointComponent) ressourcesFinancieresConjointComponent: RessourcesFinancieresConjointComponent;
  @ViewChild(RessourcesFinancieresFoyerComponent) ressourcesFinancieresFoyerComponent: RessourcesFinancieresFoyerComponent;
  @ViewChild(RessourcesFinancieresPersonnesAChargeComponent) ressourcesFinancieresPersonnesAChargeComponent: RessourcesFinancieresPersonnesAChargeComponent;
  @ViewChild(VosRessourcesFinancieresComponent) vosRessourcesFinancieresComponent: VosRessourcesFinancieresComponent;

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    private dateUtileService: DateUtileService,
    public demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.loadDataRessourcesFinancieres();
    this.dateDernierOuvertureDroitASS = this.dateUtileService.getDateDecomposeeFromStringDate(this.ressourcesFinancieres.allocationsPoleEmploi.dateDerniereOuvertureDroitASS);
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
      this.demandeurEmploiConnecteService.simulerMesAides().then(
        () => {
          this.isPageLoadingDisplay = false;
          this.router.navigate([RoutesEnum.RESULAT_MA_SIMULATION], { replaceUrl: true });
        }, () => {
          this.isPageLoadingDisplay = false;
          this.messageErreur = MessagesErreurEnum.SIMULATION_IMPOSSIBLE
        }
      );
    }
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.MES_PERSONNES_A_CHARGE], { replaceUrl: true });
  }

  public traiterValidationVosRessourcesEventEmitter(): void {
    this.isVosRessourcesDisplay = false;
    if (this.demandeurEmploiConnecteService.hasConjointSituationAvecRessource()) {
      this.isRessourcesConjointDisplay = true;
    } else if (this.demandeurEmploiConnecteService.hasPersonneAChargeAvecRessourcesFinancieres()) {
      this.isRessourcesPersonnesChargeDisplay = true;
    } else {
      this.isRessourcesFoyerDisplay = true;
    }
    this.montantRevenusVosRessources= this.demandeurEmploiConnecteService.getMontantRevenusVosRessources();
    this.montantAidesVosRessources = this.demandeurEmploiConnecteService.getMontantAidesVosRessources();
  }

  public traiterValidationRessourcesFinancieresConjointEventEmitter(): void {
    this.isRessourcesConjointDisplay = false;
    if (this.demandeurEmploiConnecteService.hasPersonneAChargeAvecRessourcesFinancieres()) {
      this.isRessourcesPersonnesChargeDisplay = true;
    } else {
      this.isRessourcesFoyerDisplay = true;
    }
    this.montantRevenusRessourcesConjoint = this.demandeurEmploiConnecteService.getMontantRevenusRessourcesConjoint();
    this.montantAidesRessourcesConjoint = this.demandeurEmploiConnecteService.getMontantAidesRessourcesConjoint();
  }

  public traiterValidationRessourcesFinancieresPersonnesChargeEventEmitter(): void {
    this.isRessourcesPersonnesChargeDisplay = false;
    this.isRessourcesFoyerDisplay = true;
    this.montantAidesPersonnesCharge = this.demandeurEmploiConnecteService.getMontantAidesRessourcesPersonnesCharge();
    this.montantRevenusPersonnesCharge = this.demandeurEmploiConnecteService.getMontantRevenusRessourcesPersonnesCharge();
  }

  public traiterValidationRessourcesFinancieresFoyerEventEmitter(): void {
    this.montantAidesFoyer = this.demandeurEmploiConnecteService.getMontantAidesRessourcesFoyer();
    this.isRessourcesFoyerDisplay = false;
  }

  private loadDataRessourcesFinancieres(): void {
    const demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    if (demandeurEmploiConnecte.ressourcesFinancieres) {
      this.ressourcesFinancieres = demandeurEmploiConnecte.ressourcesFinancieres;
    } else {
      this.ressourcesFinancieres = new RessourcesFinancieres();
      const allocationsPE = new AllocationsPoleEmploi();
      allocationsPE.nombreMoisCumulesAssEtSalaire = 0;
      this.ressourcesFinancieres.allocationsPoleEmploi = allocationsPE;
      const allocationsCAF = new AllocationsCAF();
      this.ressourcesFinancieres.allocationsCAF = allocationsCAF;
    }
  }

  private isSaisieFormulairesValide(): boolean {
    let isSaisieFormulairesValide = true;
    if (!this.vosRessourcesFinancieresComponent.vosRessourcesFinancieresForm.valid) {
      this.isVosRessourcesDisplay = true;
      isSaisieFormulairesValide = false;
    }
    if (this.demandeurEmploiConnecteService.hasConjointSituationAvecRessource()
    && !this.ressourcesFinancieresConjointComponent.ressourcesFinancieresConjointForm.valid) {
      this.isRessourcesConjointDisplay = true;
      isSaisieFormulairesValide = false;
    }
    if (this.demandeurEmploiConnecteService.hasPersonneAChargeAvecRessourcesFinancieres()
    && !this.ressourcesFinancieresPersonnesAChargeComponent.ressourcesFinancieresPersonnesChargeForm.valid) {
      this.isRessourcesPersonnesChargeDisplay = true;
      isSaisieFormulairesValide = false;
    }
    if (!this.ressourcesFinancieresFoyerComponent.ressourcesFinancieresFoyerForm.valid) {
      this.isRessourcesFoyerDisplay = true;
      isSaisieFormulairesValide = false;
    }
    return isSaisieFormulairesValide;
  }
}
