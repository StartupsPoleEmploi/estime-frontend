import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { SimulationMensuelle } from '@models/simulation-mensuelle';
import { CodesAidesEnum } from '@enumerations/codes-aides.enum';
import { AideSociale } from '@models/aide-sociale';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { DeConnecteRessourcesFinancieresService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';

@Component({
  selector: 'app-ressources-financieres-mensuelles',
  templateUrl: './ressources-financieres-mensuelles.component.html',
  styleUrls: ['./ressources-financieres-mensuelles.component.scss']
})
export class RessourcesFinancieresMensuellesComponent implements OnInit {

  demandeurEmploiConnecte: DemandeurEmploi;

  @Input() simulationSelected: SimulationMensuelle;
  @Input() aideSocialeSelected: AideSociale;

  @Output() newAideSocialeSelected = new EventEmitter<AideSociale>();

  constructor(
    public deConnecteService: DeConnecteService,
    public deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    private screenService: ScreenService
  ) { }

  ngOnInit(): void {
    this.demandeurEmploiConnecte  = this.deConnecteService.getDemandeurEmploiConnecte();
  }

  public filtrerAidesSimulationMensuelle(aideKeyValue: any): boolean {
    return aideKeyValue.value.code !== CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE;
  }

  public getMontantASS(): number {
    let montant = 0;
    if(this.simulationSelected.mesAides) {
      for (let [codeAide, aide] of Object.entries(this.simulationSelected.mesAides)) {
        if(codeAide === CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE) {
          montant = aide.montant;
        }
      }
    }
    return montant;
  }

  public hasAidesObtenir(): boolean {
    let hasAidesObtenir = false;
    if(this.simulationSelected) {
      if(Object.entries(this.simulationSelected.mesAides).length > 1) {
        hasAidesObtenir = true;
      }
      if(Object.entries(this.simulationSelected.mesAides).length === 1) {
        for (let [codeAide, aide] of Object.entries(this.simulationSelected.mesAides)) {
          if(aide && codeAide !== CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE) {
            hasAidesObtenir = true;
          }
        }
      }
    }

    return hasAidesObtenir;
  }

  public isAideSocialSelected(aideSociale: AideSociale): boolean {
    return this.aideSocialeSelected && aideSociale.code === this.aideSocialeSelected.code;
  }

  public isLastAideKeyValue(index: number): boolean {
    let size = 0;
    for (let [codeAide, aide] of Object.entries(this.simulationSelected.mesAides)) {
      if(aide && codeAide !== CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE) {
        size += 1;
      }
    }
    return index === size - 1;
  }

  public onClickButtonAideSocialObtenir(aideSociale: AideSociale) {
    if(this.screenService.isSmallScreen() && this.isAideSocialSelected(aideSociale)) {
      this.aideSocialeSelected = null;
    } else  {
      this.aideSocialeSelected = aideSociale;
    }
    this.newAideSocialeSelected.emit(aideSociale);
  }

  public isItemSalaireIsNotLast(): boolean {
    return this.getMontantASS() > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationMensuelleNetAAH > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationMensuelleNetRSA > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsLogementMensuellesNetFoyer > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsFamilialesMensuellesNetFoyer > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois > 0

  }

  public isItemAssIsNotLast(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationMensuelleNetAAH > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationMensuelleNetRSA > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsLogementMensuellesNetFoyer > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsFamilialesMensuellesNetFoyer > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois > 0
  }

  public isItemAahIsNotLast(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationMensuelleNetRSA > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsLogementMensuellesNetFoyer > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsFamilialesMensuellesNetFoyer > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois > 0
  }

  public isItemRsaIsNotLast(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois > 0
  }

  public isItemRevenusImmobilierIsNotLast(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois > 0
  }
}
