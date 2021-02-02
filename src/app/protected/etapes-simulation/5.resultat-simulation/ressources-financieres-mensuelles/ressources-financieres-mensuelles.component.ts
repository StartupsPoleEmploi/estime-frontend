import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { SimulationMensuelle } from '@models/simulation-mensuelle';
import { CodesAidesEnum } from '@enumerations/codes-aides.enum';
import { AideSociale } from '@models/aide-sociale';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { DeConnecteRessourcesFinancieresService } from '@app/core/services/demandeur-emploi-connecte/de-connecte-ressources-financieres.service';
import { AidesService } from "@app/core/services/utile/aides.service";
import { CodesRessourcesFinancieresEnum } from "@app/commun/enumerations/codes-ressources-financieres.enum";


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


  codesRessourcesFinancieresEnum: typeof CodesRessourcesFinancieresEnum = CodesRessourcesFinancieresEnum;

  constructor(
    public aidesService: AidesService,
    public deConnecteService: DeConnecteService,
    public deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    private screenService: ScreenService
  ) { }

  ngOnInit(): void {
    this.demandeurEmploiConnecte  = this.deConnecteService.getDemandeurEmploiConnecte();
  }

  public filtrerAidesSimulationMensuelle(aideKeyValue: any): boolean {
    return aideKeyValue.value.code !== (CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE || CodesAidesEnum.PENSION_INVALIDITE);
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
    if(this.screenService.isExtraSmallScreen() && this.isAideSocialSelected(aideSociale)) {
      this.aideSocialeSelected = null;
    } else  {
      this.aideSocialeSelected = aideSociale;
    }
    this.newAideSocialeSelected.emit(aideSociale);
  }

  public isItemSalaireIsNotLast(): boolean {
    return this.aidesService.getMontantASS(this.simulationSelected) > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationMensuelleNetAAH > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationMensuelleNetRSA > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsLogementMensuellesNetFoyer.moisNMoins1 > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsLogementMensuellesNetFoyer.moisNMoins2 > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsLogementMensuellesNetFoyer.moisNMoins3 > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsFamilialesMensuellesNetFoyer > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM?.pensionInvalidite > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois > 0

  }

  public isItemAssIsNotLast(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationMensuelleNetAAH > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationMensuelleNetRSA > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsLogementMensuellesNetFoyer.moisNMoins1 > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsLogementMensuellesNetFoyer.moisNMoins2 > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsLogementMensuellesNetFoyer.moisNMoins3 > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsFamilialesMensuellesNetFoyer > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM?.pensionInvalidite > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois > 0
  }

  public isItemAahIsNotLast(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationMensuelleNetRSA > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsLogementMensuellesNetFoyer.moisNMoins1 > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsLogementMensuellesNetFoyer.moisNMoins2 > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsLogementMensuellesNetFoyer.moisNMoins3 > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationsFamilialesMensuellesNetFoyer > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM?.pensionInvalidite > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois > 0
  }

  public isItemPensionInvaliditeIsNotLast(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF?.allocationMensuelleNetRSA > 0
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
