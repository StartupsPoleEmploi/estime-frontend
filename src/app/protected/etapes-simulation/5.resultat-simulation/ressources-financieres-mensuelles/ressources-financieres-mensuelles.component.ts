import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeConnecteService } from '@app/core/services/demandeur-emploi-connecte/de-connecte.service';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { SimulationMensuelle } from '@models/simulation-mensuelle';
import { CodesAidesEnum } from '@enumerations/codes-aides.enum';
import { Aide } from '@models/aide';
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
  @Input() aideSelected: Aide;
  @Input() aidesDemandeurPourraObtenir: Array<Aide>;

  @Output() newAideSelected = new EventEmitter<Aide>();

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

  public isAideSelected(codeAide: string): boolean {
    return this.aideSelected && codeAide === this.aideSelected.code;
  }

  public filtrerAidesSimulationMensuelle(aideKeyValue: any): boolean {
    return aideKeyValue.value.code !== CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE
    && aideKeyValue.value.code !== CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES
    && aideKeyValue.value.code !== CodesAidesEnum.RSA
    && aideKeyValue.value.code !== CodesAidesEnum.ALLOCATIONS_FAMILIALES
    && aideKeyValue.value.code !== CodesAidesEnum.ALLOCATION_SOUTIEN_FAMILIAL
    && aideKeyValue.value.code !== CodesAidesEnum.COMPLEMENT_FAMILIAL
    && aideKeyValue.value.code !== CodesAidesEnum.PRESTATION_ACCUEIL_JEUNE_ENFANT;
  }


  public isLastAideKeyValue(index: number): boolean {
    let size = 0;
    const aides = Object.values(this.simulationSelected.mesAides);
    aides.forEach((aide) => {
      if(this.aidesService.isAideDemandeurPourraObtenir(aide)) {
        size += 1;
      }
    });
    return index === size - 1;
  }

  public onClickButtonAideActuelle(codeAide: string): void {
    this.onClickButtonAideObtenir(this.aidesService.getAideByCodeFromSimulationMensuelle(this.simulationSelected, codeAide));
  }

  public onClickButtonAideObtenir(aide: Aide) {
    if(this.isAideSelected(aide.code)) {
      this.aideSelected = null;
    } else  {
      this.aideSelected = aide;
    }
    this.newAideSelected.emit(aide);
  }

  public isItemSalaireIsNotLast(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieres.revenusMicroEntreprise3DerniersMois > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.beneficesTravailleurIndependantDernierExercice > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0
    || this.aidesService.getMontantAAH(this.simulationSelected) > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM?.pensionInvalidite > 0
    || this.aidesService.getMontantRSA(this.simulationSelected) > 0
    || this.aidesService.getMontantASS(this.simulationSelected) > 0
  }

  public isItemRevenusMicroEntrepriseIsNotLast(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieres.beneficesTravailleurIndependantDernierExercice > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0
    || this.aidesService.getMontantAAH(this.simulationSelected) > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM?.pensionInvalidite > 0
    || this.aidesService.getMontantRSA(this.simulationSelected) > 0
    || this.aidesService.getMontantASS(this.simulationSelected) > 0
  }

  public isItemBeneficesTravailleurIndependantIsNotLast(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois > 0
    || this.aidesService.getMontantAAH(this.simulationSelected) > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM?.pensionInvalidite > 0
    || this.aidesService.getMontantRSA(this.simulationSelected) > 0
    || this.aidesService.getMontantASS(this.simulationSelected) > 0
  }

  public isItemRevenusImmobilierIsNotLast(): boolean {
    return this.aidesService.getMontantAAH(this.simulationSelected) > 0
    || this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM?.pensionInvalidite > 0
    || this.aidesService.getMontantRSA(this.simulationSelected) > 0
    || this.aidesService.getMontantASS(this.simulationSelected) > 0
  }

  public isItemAahIsNotLast(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM?.pensionInvalidite > 0
    || this.aidesService.getMontantRSA(this.simulationSelected) > 0
    || this.aidesService.getMontantASS(this.simulationSelected) > 0
  }

  public isItemPensionInvaliditeIsNotLast(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM?.allocationSupplementaireInvalidite > 0
    || this.aidesService.getMontantRSA(this.simulationSelected) > 0
    || this.aidesService.getMontantASS(this.simulationSelected) > 0
  }

  public isItemAllocationSupplementaireInvaliditeIsNotLast(): boolean {
    return this.aidesService.getMontantRSA(this.simulationSelected) > 0
    || this.aidesService.getMontantASS(this.simulationSelected) > 0
  }

  public isItemRsaIsNotLast(): boolean {
    return this.aidesService.getMontantAllocationsFamiliales(this.simulationSelected) > 0
    || this.aidesService.getMontantAllocationSoutienFamilial(this.simulationSelected) > 0
    || this.aidesService.getMontantComplementFamilial(this.simulationSelected) > 0
    || this.aidesService.getMontantASS(this.simulationSelected) > 0
  }

  public isItemAllocationsFamilialesIsNotLast(): boolean {
    return this.aidesService.getMontantAllocationSoutienFamilial(this.simulationSelected) > 0
    || this.aidesService.getMontantComplementFamilial(this.simulationSelected) > 0
    || this.aidesService.getMontantASS(this.simulationSelected) > 0
  }

  public isItemAllocationSoutienFamilialIsNotLast(): boolean {
    return this.aidesService.getMontantComplementFamilial(this.simulationSelected) > 0
    || this.aidesService.getMontantASS(this.simulationSelected) > 0
  }

  public isItemComplementFamilialIsNotLast(): boolean {
    return this.aidesService.getMontantPrestationAccueilJeuneEnfant(this.simulationSelected) > 0
      || this.aidesService.getMontantASS(this.simulationSelected) > 0
  }

  public isItemPrestationAccueilJeuneEnfantIsNotLast(): boolean {
    return this.aidesService.getMontantASS(this.simulationSelected) > 0
  }

  public handleKeyUpOnAideActuelle(event: any, codeAideActuelle: string) {
    if (event.keyCode === 13) {
      this.onClickButtonAideActuelle(codeAideActuelle);
    }
  }

  public handleKeyUpOnAideObtenir(event: any, aideObtenir: Aide) {
    if (event.keyCode === 13) {
      this.onClickButtonAideObtenir(aideObtenir);
    }
  }
}
