import { Injectable } from '@angular/core';
import { SimulationAidesSociales } from "@models/simulation-aides-sociales";
import { SessionStorageService } from "ngx-webstorage";
import { KeysStorageEnum } from "@app/commun/enumerations/keys-storage.enum";
import { DeConnecteService } from './de-connecte.service';
import { SimulationMensuelle } from '@models/simulation-mensuelle';
import { NumberUtileService } from '../utile/number-util.service';
import { AllocationsCAF } from '@models/allocations-caf';
import { AllocationsCPAM } from '@app/commun/models/allocations-cpam';

@Injectable({ providedIn: 'root' })
export class DeConnecteSimulationAidesSocialesService {

  private simulationAidesSociales: SimulationAidesSociales;

  constructor(
    private deConnecteService: DeConnecteService,
    private numberUtileService: NumberUtileService,
    private sessionStorageService: SessionStorageService
  ) {

  }

  public getSimulationAidesSociales(): SimulationAidesSociales {
    if (!this.simulationAidesSociales) {
      this.simulationAidesSociales = this.sessionStorageService.retrieve(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION_AIDES_SOCIALE);
    }
    return this.simulationAidesSociales;
  }

  public setSimulationAidesSociales(simulationAidesSociales: SimulationAidesSociales): void {
    this.simulationAidesSociales = simulationAidesSociales;
    this.saveSimulationAidesSocialesInSessionStorage();
  }

  public calculerMontantTotalRessourcesMois(simulation: SimulationMensuelle): number {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    const ressourcesFinancieres = demandeurEmploiConnecte.ressourcesFinancieres;

    const salaireFuturTravail = this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.futurTravail.salaireMensuelNet);
    const montantAllocationsCAF = this.calculerMontantAllocationsCAF(ressourcesFinancieres.allocationsCAF);
    const montantAllocationsCPAM = this.calculerMontantAllocationsCPAM(ressourcesFinancieres.allocationsCPAM);
    const montantTotalAidesMoisSimule = this.calculerMontantAidesSimuleesMois(simulation);

    return salaireFuturTravail + montantAllocationsCAF + montantAllocationsCPAM + montantTotalAidesMoisSimule;
  }

  private calculerMontantAidesSimuleesMois(simulation: SimulationMensuelle) {
    let montant = 0;
    if (simulation.mesAides) {
      for (let [codeAide, aide] of Object.entries(simulation.mesAides)) {
        if (codeAide && aide) {
          montant += this.numberUtileService.getMontantSafe(aide.montant);
        }
      }
    }
    return montant;
  }

  private calculerMontantAllocationsCAF(allocationsCAF: AllocationsCAF) {
    const montant = this.numberUtileService.getMontantSafe(allocationsCAF.allocationMensuelleNetAAH);
    return montant
  }

  private calculerMontantAllocationsCPAM(allocationsCPAM: AllocationsCPAM) {
    const montant = this.numberUtileService.getMontantSafe(allocationsCPAM.pensionInvalidite);
    return montant
  }

  private saveSimulationAidesSocialesInSessionStorage(): void {
    this.sessionStorageService.store(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION_AIDES_SOCIALE, this.simulationAidesSociales);
  }
}