import { Injectable } from '@angular/core';
import { SimulationAidesSociales } from "@models/simulation-aides-sociales";
import { SessionStorageService } from "ngx-webstorage";
import { KeysSessionStorageEnum } from "@enumerations/keys-session-storage.enum";

@Injectable({ providedIn: 'root' })
export class DeConnecteSimulationAidesSocialesService {

  private simulationAidesSociales: SimulationAidesSociales;

  constructor(
    private sessionStorageService: SessionStorageService
  ) {

  }

  public getSimulationAidesSociales(): SimulationAidesSociales {
    if (!this.simulationAidesSociales) {
      this.simulationAidesSociales = this.sessionStorageService.retrieve(KeysSessionStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION_AIDES_SOCIALE);
    }
    return this.simulationAidesSociales;
  }

  public setSimulationAidesSociales(simulationAidesSociales: SimulationAidesSociales): void {
    this.simulationAidesSociales = simulationAidesSociales;
    this.saveSimulationAidesSocialesInSessionStorage();
  }

  private saveSimulationAidesSocialesInSessionStorage(): void {
    this.sessionStorageService.store(KeysSessionStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION_AIDES_SOCIALE, this.simulationAidesSociales);
  }
}