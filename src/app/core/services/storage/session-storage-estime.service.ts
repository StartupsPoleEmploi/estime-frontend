import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { KeysStorageEnum } from '@enumerations/keys-storage.enum';
import { PeConnectPayload } from '@models/pe-connect-payload';
import { SessionStorageService } from "ngx-webstorage";
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';
import { NiveauMessagesErreurEnum } from '@app/commun/enumerations/niveaux-message-erreur';
import { MessageErreur } from '@app/commun/models/message-erreur';
import { Individu } from "@models/individu";

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
    this.sessionStorageService.clear(KeysStorageEnum.INDIVIDU_CONNECTE_STORAGE_SESSION_KEY);
  }

  public clearMessageDemandeurEmploi(): void {
    return this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_MESSAGE_NON_AUTORISE);
  }

  public clearPathRouteActivatedByUser(): void {
    return this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_ROUTE_ACTIVATED_STORAGE_SESSION_KEY);
  }

  public getDemandeurEmploiConnected(): DemandeurEmploi {
    return this.sessionStorageService.retrieve(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
  }

  public getIndividuConnected(): Individu {
    return this.sessionStorageService.retrieve(KeysStorageEnum.INDIVIDU_CONNECTE_STORAGE_SESSION_KEY);
  }

  public getPathRouteActivatedByUser(): string {
    return this.sessionStorageService.retrieve(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_ROUTE_ACTIVATED_STORAGE_SESSION_KEY);
  }

  public getPayloadPeConnect(): PeConnectPayload {
    return this.sessionStorageService.retrieve(KeysStorageEnum.PE_CONNECT_PAYLOAD_STORAGE_SESSION_KEY);
  }

  public getMessageDemandeurEmploi(): MessageErreur {
    return this.sessionStorageService.retrieve(KeysStorageEnum.DEMANDEUR_EMPLOI_MESSAGE_NON_AUTORISE);
  }

  public storeDemandeurEmploiConnecte(demandeurEmploiConnecte: DemandeurEmploi): void {
    this.sessionStorageService.store(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY, demandeurEmploiConnecte);
  }

  public storeIndividuConnecte(storeIndividuConnecte: Individu): void {
    this.sessionStorageService.store(KeysStorageEnum.INDIVIDU_CONNECTE_STORAGE_SESSION_KEY, storeIndividuConnecte);
  }

  public storeRouteActivatedByUser(route: ActivatedRouteSnapshot): void {
    this.sessionStorageService.store(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_ROUTE_ACTIVATED_STORAGE_SESSION_KEY, route.routeConfig.path);
  }

  public storePeConnectPayload(peConnectPayload: PeConnectPayload): void {
    this.sessionStorageService.store(KeysStorageEnum.PE_CONNECT_PAYLOAD_STORAGE_SESSION_KEY, peConnectPayload);
  }

  public storeMessageDemandeurEmploiNonAutorise(): void {
    const message = new MessageErreur();
    message.texte = MessagesErreurEnum.POPULATION_NON_AUTORISEE;
    message.niveau = NiveauMessagesErreurEnum.INFO;
    this.sessionStorageService.store(KeysStorageEnum.DEMANDEUR_EMPLOI_MESSAGE_NON_AUTORISE, message);
  }
}
