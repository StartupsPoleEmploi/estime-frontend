import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { KeysStorageEnum } from '@enumerations/keys-storage.enum';
import { PeConnectPayload } from '@models/pe-connect-payload';
import { SessionStorageService } from "ngx-webstorage";

@Injectable({ providedIn: 'root' })
export class SessionStorageEstimeService {


  constructor(
    private sessionStorageService: SessionStorageService
  ) {

  }

  public clear(): void {
    this.clearPathRouteActivatedByUser();
    this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
    this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION_AIDES_SOCIALE);
    this.sessionStorageService.clear(KeysStorageEnum.PE_CONNECT_PAYLOAD_STORAGE_SESSION_KEY);
  }

  public clearPathRouteActivatedByUser(): void {
    return this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_ROUTE_ACTIVATED_STORAGE_SESSION_KEY);
  }

  public getDemandeurEmploiConnected(): DemandeurEmploi {
    return this.sessionStorageService.retrieve(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
  }

  public getPathRouteActivatedByUser(): string {
    return this.sessionStorageService.retrieve(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_ROUTE_ACTIVATED_STORAGE_SESSION_KEY);
  }

  public getPayloadPeConnect(): PeConnectPayload {
    return this.sessionStorageService.retrieve(KeysStorageEnum.PE_CONNECT_PAYLOAD_STORAGE_SESSION_KEY);
  }

  public storeDemandeurEmploiConnecte(demandeurEmploiConnecte: DemandeurEmploi): void {
    this.sessionStorageService.store(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY, demandeurEmploiConnecte);
  }

  public storeRouteActivatedByUser(route: ActivatedRouteSnapshot): void {
    this.sessionStorageService.store(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_ROUTE_ACTIVATED_STORAGE_SESSION_KEY, route.routeConfig.path);
  }
}
