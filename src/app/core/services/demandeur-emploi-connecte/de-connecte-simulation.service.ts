import { Injectable } from '@angular/core';
import { Simulation } from "@app/commun/models/simulation";
import { SessionStorageService } from "ngx-webstorage";
import { KeysStorageEnum } from "@app/commun/enumerations/keys-storage.enum";

@Injectable({ providedIn: 'root' })
export class DeConnecteSimulationService {

  constructor(
    private sessionStorageService: SessionStorageService
  ) { }

  public getSimulation(): Simulation {
    return this.sessionStorageService.retrieve(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION);
  }

  public setSimulation(simulation: Simulation): void {
    this.saveSimulationInSessionStorage(simulation);
  }

  private saveSimulationInSessionStorage(simulation: Simulation): void {
    this.sessionStorageService.store(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION, simulation);
  }

  public getDatePremierMoisSimule(): string {
    return this.getSimulation().simulationsMensuelles[0].datePremierJourMoisSimule;
  }
}