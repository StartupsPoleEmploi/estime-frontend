import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DemandeurEmploiConnecteService } from '@app/core/services/utile/demandeur-emploi-connecte.service';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { SimulationMensuelle } from '@models/simulation-mensuelle';
import { CodesAidesEnum } from '@enumerations/codes-aides.enum';
import { AideSociale } from '@app/commun/models/aide-sociale';

@Component({
  selector: 'app-ressources-financieres-mensuelles',
  templateUrl: './ressources-financieres-mensuelles.component.html',
  styleUrls: ['./ressources-financieres-mensuelles.component.scss']
})
export class RessourcesFinancieresMensuellesComponent implements OnInit {

  demandeurEmploiConnecte: DemandeurEmploi;
  montantASS: number;

  @Input() simulationSelected: SimulationMensuelle;
  @Input() aideSocialeSelected: AideSociale;

  @Output() newAideSocialeSelected = new EventEmitter<AideSociale>();

  constructor(
    public demandeurEmploiConnecteService: DemandeurEmploiConnecteService
  ) { }

  ngOnInit(): void {
    this.demandeurEmploiConnecte  = this.demandeurEmploiConnecteService.getDemandeurEmploiConnecte();
    this.montantASS = this.getMontantASS();
  }

  public filtrerAidesSimulationMensuelle(aideKeyValue: any): boolean {
    return aideKeyValue.value.code !== CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE;
  }

  private getMontantASS(): number {
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
    if(Object.entries(this.simulationSelected.mesAides).length > 1) {
      hasAidesObtenir = true;
    }
    if(Object.entries(this.simulationSelected.mesAides).length === 1) {
      for (let [codeAide, aide] of Object.entries(this.simulationSelected.mesAides)) {
        if(codeAide !== CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE) {
          hasAidesObtenir = true;
        }
      }
    }
    return hasAidesObtenir;
  }

  public isAideSocialListIsAideSocialeSelected(aideSociale: AideSociale): boolean {
    return aideSociale.code === this.aideSocialeSelected.code;
  }

  public isLastAideKeyValue(index: number): boolean {
    let size = 0;
    for (let [codeAide, aide] of Object.entries(this.simulationSelected.mesAides)) {
      if(codeAide !== CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE) {
        size += 1;
      }
    }
    return index === size - 1;
  }

  public onClickButtonAideSocialObtenir(aideSociale: AideSociale) {
    this.aideSocialeSelected = aideSociale;
    this.newAideSocialeSelected.emit(aideSociale);
  }
}
