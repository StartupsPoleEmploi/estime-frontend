import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { DemandeurEmploi } from '@app/commun/models/demandeur-emploi';
import { KeysStorageEnum } from '@enumerations/keys-storage.enum';
import { PeConnectPayload } from '@models/pe-connect-payload';
import { SessionStorageService } from "ngx-webstorage";
import { NiveauMessagesErreurEnum } from '@app/commun/enumerations/niveaux-message-erreur';
import { MessageErreur } from '@app/commun/models/message-erreur';
import { Individu } from "@models/individu";
import { CodesMessagesErreurEnum } from '@app/commun/enumerations/codes-messages-erreur.enum';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum';

@Injectable({ providedIn: 'root' })
export class SessionStorageEstimeService {


  constructor(
    private sessionStorageService: SessionStorageService
  ) {

  }

  public clear(): void {
    this.clearPathRouteActivatedByUser();
    this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
    this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION);
    this.sessionStorageService.clear(KeysStorageEnum.PE_CONNECT_PAYLOAD_STORAGE_SESSION_KEY);
    this.sessionStorageService.clear(KeysStorageEnum.INDIVIDU_CONNECTE_STORAGE_SESSION_KEY);
    this.sessionStorageService.clear(KeysStorageEnum.TRAFFIC_SOURCE);
  }

  public clearDemandeurEmploi(): void {
    this.clearPathRouteActivatedByUser();
    this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
    this.sessionStorageService.clear(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION);
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

  public getTrafficSource(): string {
    return this.sessionStorageService.retrieve(KeysStorageEnum.TRAFFIC_SOURCE);
  }

  public getTypeUtilisateur(): string {
    return this.sessionStorageService.retrieve(KeysStorageEnum.TYPE_UTILISATEUR);
  }

  public storeDemandeurEmploiConnecte(demandeurEmploiConnecte: DemandeurEmploi): void {
    //pour des raison de sécurité, on ne stocke pas les authorization dans session storage
    demandeurEmploiConnecte.peConnectAuthorization = null;
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

  public storeTrafficSource(trafficSource: string): void {
    this.sessionStorageService.store(KeysStorageEnum.TRAFFIC_SOURCE, trafficSource);
  }

  public storeMessageDemandeurEmploiNonAutorise(): void {
    const message = new MessageErreur();
    message.code = CodesMessagesErreurEnum.POPULATION_NON_AUTORISEE;
    message.niveau = NiveauMessagesErreurEnum.INFO;
    this.sessionStorageService.store(KeysStorageEnum.DEMANDEUR_EMPLOI_MESSAGE_NON_AUTORISE, message);
  }

  public storeMessageDemandeurEmploiConnexionImpossible(): void {
    const message = new MessageErreur();
    message.texte = MessagesErreurEnum.CONNEXION_ESTIME_IMPOSSIBLE;
    message.niveau = NiveauMessagesErreurEnum.ERROR;
    this.sessionStorageService.store(KeysStorageEnum.DEMANDEUR_EMPLOI_MESSAGE_NON_AUTORISE, message);
  }

  public storeTypeUtilisateur(typeUtilisateur: string): void {
    this.sessionStorageService.store(KeysStorageEnum.TYPE_UTILISATEUR, typeUtilisateur);
  }

}
