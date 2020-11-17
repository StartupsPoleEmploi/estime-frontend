import { Component, OnInit } from '@angular/core';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { Router } from '@angular/router';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { ControleChampFormulaireService } from '@app/core/services/utile/controle-champ-formulaire.service';
import { RessourcesFinancieres } from '@app/commun/models/ressources-financieres';
import { AllocationsPoleEmploi } from '@app/commun/models/allocations-pole-emploi';
import { AllocationsCAF } from '@app/commun/models/allocations-caf';

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

  constructor(
    public controleChampFormulaireService: ControleChampFormulaireService,
    public demandeurEmploiConnecteService: DemandeurEmploiConnecteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDataRessourcesFinancieres();
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
    this.demandeurEmploiConnecteService.simulerMesAides().then(
          () => {
            this.isPageLoadingDisplay = false;
            this.router.navigate([RoutesEnum.RESULAT_MA_SIMULATION], { replaceUrl: true });
          },() => {
            this.isPageLoadingDisplay = false;
            this.messageErreur = MessagesErreurEnum.SIMULATION_IMPOSSIBLE
          }
        );
  }

  public onClickButtonRetour(): void {
    this.router.navigate([RoutesEnum.MES_PERSONNES_A_CHARGE], { replaceUrl: true });
  }

  public traiterValidationVosRessourcesEventEmitter(): void {
    this.isVosRessourcesDisplay = false;
    if(this.demandeurEmploiConnecteService.hasConjointSituationAvecRessource()) {
      this.isRessourcesConjointDisplay = true;
    } else if(this.demandeurEmploiConnecteService.hasPersonneAChargeAvecRessourcesFinancieres) {
      this.isRessourcesPersonnesChargeDisplay = true;
    } else {
      this.isRessourcesFoyerDisplay = true;
    }
  }

  private loadDataRessourcesFinancieres(): void {
    const demandeurEmploiConnecte = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    if(demandeurEmploiConnecte.ressourcesFinancieres) {
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
}
