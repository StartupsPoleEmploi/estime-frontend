import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { BeneficiaireAidesSociales } from '@app/commun/models/beneficiaire-aides-sociales';
import { DateDecomposee } from '@app/commun/models/date-decomposee';
import { RessourcesFinancieres } from '@app/commun/models/ressources-financieres';
import { DeConnecteRessourcesFinancieresService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service";
import { DeConnecteSituationFamilialeService } from "@app/core/services/demandeur-emploi-connecte/de-connecte-situation-familiale.service";
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { DateUtileService } from '@app/core/services/utile/date-util.service';
import { RessourcesFinancieresUtileService } from "@app/core/services/utile/ressources-financieres-utiles.service";
import { RessourcesFinancieresConjointComponent } from '@app/protected/ressources-financieres/ressources-financieres-conjoint/ressources-financieres-conjoint.component';
import { RessourcesFinancieresFoyerComponent } from './ressources-financieres-foyer/ressources-financieres-foyer.component';
import { RessourcesFinancieresPersonnesAChargeComponent } from './ressources-financieres-personnes-a-charge/ressources-financieres-personnes-a-charge.component';
import { VosRessourcesFinancieresComponent } from './vos-ressources-financieres/vos-ressources-financieres.component';

@Component({
  selector: 'app-ressources-financieres',
  templateUrl: './ressources-financieres.component.html',
  styleUrls: ['./ressources-financieres.component.scss']
})
export class RessourcesFinancieresComponent implements OnInit {

  beneficiaireAidesSociales: BeneficiaireAidesSociales;
  dateDernierOuvertureDroitASS: DateDecomposee;

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
    private dateUtileService: DateUtileService,
    public deConnecteService: DeConnecteService,
    private deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    public deConnecteSituationFamilialeService: DeConnecteSituationFamilialeService,
    private estimeApiService: EstimeApiService,
    private ressourcesFinancieresUtileService: RessourcesFinancieresUtileService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.loadDataRessourcesFinancieres();
    this.dateDernierOuvertureDroitASS = this.dateUtileService.getDateDecomposeeFromStringDate(this.ressourcesFinancieres.allocationsPoleEmploi.dateDerniereOuvertureDroitASS);
    this.calculerMontantsRessourcesFinancieres();
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
    if (this.deConnecteSituationFamilialeService.hasConjointSituationAvecRessource()
    && !this.ressourcesFinancieresConjointComponent.ressourcesFinancieresConjointForm.valid) {
      this.isRessourcesConjointDisplay = true;
    } else if (this.deConnecteSituationFamilialeService.hasPersonneAChargeAvecRessourcesFinancieres()
    && !this.ressourcesFinancieresPersonnesAChargeComponent.ressourcesFinancieresPersonnesChargeForm.valid) {
      this.isRessourcesPersonnesChargeDisplay = true;
    } else {
      this.isRessourcesFoyerDisplay = true;
    }
    this.montantRevenusVosRessources= this.deConnecteRessourcesFinancieresService.getMontantRevenusVosRessources();
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
    let isSaisieFormulairesValide = true;
    if (!this.vosRessourcesFinancieresComponent.vosRessourcesFinancieresForm.valid) {
      this.isVosRessourcesDisplay = true;
      isSaisieFormulairesValide = false;
    }
    if (this.deConnecteSituationFamilialeService.hasConjointSituationAvecRessource()
    && !this.ressourcesFinancieresConjointComponent.ressourcesFinancieresConjointForm.valid) {
      this.isRessourcesConjointDisplay = true;
      isSaisieFormulairesValide = false;
    }
    if (this.deConnecteSituationFamilialeService.hasPersonneAChargeAvecRessourcesFinancieres()
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

  private calculerMontantsRessourcesFinancieres(): void {
    this.montantRevenusVosRessources= this.deConnecteRessourcesFinancieresService.getMontantRevenusVosRessources();
    this.montantAidesVosRessources = this.deConnecteRessourcesFinancieresService.getMontantAidesVosRessources();
    this.montantRevenusRessourcesConjoint = this.deConnecteRessourcesFinancieresService.getMontantRevenusRessourcesConjoint();
    this.montantAidesRessourcesConjoint = this.deConnecteRessourcesFinancieresService.getMontantAidesRessourcesConjoint();
    this.montantAidesPersonnesCharge = this.deConnecteRessourcesFinancieresService.getMontantAidesRessourcesPersonnesCharge();
    this.montantRevenusPersonnesCharge = this.deConnecteRessourcesFinancieresService.getMontantRevenusRessourcesPersonnesCharge();
    this.montantAidesFoyer = this.deConnecteRessourcesFinancieresService.getMontantAidesRessourcesFoyer();
  }
}
