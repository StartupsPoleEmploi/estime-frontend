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
import { LibellesAidesEnum } from "@enumerations/libelles-aides.enum";
import { OrganismeAidesEnum } from "@enumerations/organismes-aides.enum";
import { LibellesRessourcesFinancieresEnum } from "@enumerations/libelles-ressources-financieres.enum";

@Component({
  selector: 'app-ressources-financieres-mensuelles',
  templateUrl: './ressources-financieres-mensuelles.component.html',
  styleUrls: ['./ressources-financieres-mensuelles.component.scss']
})
export class RessourcesFinancieresMensuellesComponent implements OnInit {

  demandeurEmploiConnecte: DemandeurEmploi;


  @Input() simulationSelected: SimulationMensuelle;
  @Input() aideSocialeSelected: AideSociale;
  @Input() aidesDemandeurPourraObtenir: Array<AideSociale>;

  @Output() newAideSocialeSelected = new EventEmitter<AideSociale>();

  codesRessourcesFinancieresEnum: typeof CodesRessourcesFinancieresEnum = CodesRessourcesFinancieresEnum;
  codesAidesEnum: typeof CodesAidesEnum = CodesAidesEnum;
  libellesAidesEnum: typeof LibellesAidesEnum = LibellesAidesEnum;
  libellesRessourcesFinancieresEnum: typeof LibellesRessourcesFinancieresEnum = LibellesRessourcesFinancieresEnum;
  organismeAidesEnum: typeof OrganismeAidesEnum = OrganismeAidesEnum;

  constructor(
    public aidesService: AidesService,
    public deConnecteService: DeConnecteService,
    public deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    private screenService: ScreenService
  ) { }

  ngOnInit(): void {
    this.demandeurEmploiConnecte  = this.deConnecteService.getDemandeurEmploiConnecte();
  }

  public isAideSocialSelected(codeAideSociale: string): boolean {
    return this.aideSocialeSelected && codeAideSociale === this.aideSocialeSelected.code;
  }

  public filtrerAidesSimulationMensuelle(aideKeyValue: any): boolean {
    return aideKeyValue.value.code !== CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE
    && aideKeyValue.value.code !== CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES
    && aideKeyValue.value.code !== CodesAidesEnum.RSA;
  }


  public isLastAideKeyValue(index: number): boolean {
    let size = 0;
    for (let [codeAide, aide] of Object.entries(this.simulationSelected.mesAides)) {
      if(this.aidesService.isAideDemandeurPourraObtenir(aide)) {
        size += 1;
      }
    }
    return index === size - 1;
  }

  public onClickButtonAideActuelle(codeAide: string): void {
    this.onClickButtonAideSocialObtenir(this.aidesService.getAideByCodeFromSimulationMensuelle(this.simulationSelected, codeAide));
  }

  public onClickButtonAideSocialObtenir(aideSociale: AideSociale) {
    if(this.screenService.isExtraSmallScreen() && this.isAideSocialSelected(aideSociale.code)) {
      this.aideSocialeSelected = null;
    } else  {
      this.aideSocialeSelected = aideSociale;
    }
    this.newAideSocialeSelected.emit(aideSociale);
  }

  public isItemSalaireIsNotLast(): boolean {
    return this.aidesService.getMontantASS(this.simulationSelected) > 0
    || this.aidesService.getMontantRSA(this.simulationSelected) > 0
    || this.aidesService.getMontantAAH(this.simulationSelected) > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM?.pensionInvalidite > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois > 0
  }

  public isItemAssIsNotLast(): boolean {
    return this.aidesService.getMontantRSA(this.simulationSelected) > 0
    || this.aidesService.getMontantAAH(this.simulationSelected) > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM?.pensionInvalidite > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois > 0
  }

  public isItemRsaIsNotLast(): boolean {
    return this.aidesService.getMontantAAH(this.simulationSelected) > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM?.pensionInvalidite > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois > 0
  }

  public isItemAahIsNotLast(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM?.pensionInvalidite > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois > 0
  }

  public isItemPensionInvaliditeIsNotLast(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois > 0
  }

  public isItemRevenusImmobilierIsNotLast(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois > 0
  }
}
