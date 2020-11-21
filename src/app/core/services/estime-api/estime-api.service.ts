import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeysSessionStorageEnum } from "@enumerations/keys-session-storage.enum";
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { Environment } from '@models/environment';
import { Individu } from "@models/individu";
import { InformationAutorisationOIDC } from '@models/informations-autorisation-oidc';
import { SessionStorageService } from 'ngx-webstorage';
import { DeConnecteService } from '../demandeur-emploi-connecte/de-connecte.service';
import { SimulationAidesSociales } from '@app/commun/models/simulation-aides-sociales';

@Injectable({providedIn: 'root'})
export class EstimeApiService {

  private pathDemandeurEmploiService: string;

  constructor(
    private environment: Environment,
    private http: HttpClient,
    private sessionStorageService: SessionStorageService
  ) {

    this.pathDemandeurEmploiService = `${this.environment.apiEstimeURL}individus/`;
  }

  public authentifier(informationAutorisationOIDC: InformationAutorisationOIDC): Promise<Individu> {
    return this.http.post<Individu>(`${this.pathDemandeurEmploiService}authentifier`, informationAutorisationOIDC).toPromise();
  }

  public completerInformationsDemandeurEmploi(demandeurEmploiConnecte: DemandeurEmploi): Promise<DemandeurEmploi> {
    const headers = this.getHttpHeaders();
    return this.http.put<DemandeurEmploi>(`${this.pathDemandeurEmploiService}demandeur_emploi`, demandeurEmploiConnecte, {headers : headers}).toPromise();
  }

  public simulerMesAides(demandeurEmploi: DemandeurEmploi): Promise<SimulationAidesSociales> {
    const headers = this.getHttpHeaders();
    return this.http.post<SimulationAidesSociales>(`${this.pathDemandeurEmploiService}demandeur_emploi/simulation_aides_sociales`, demandeurEmploi, {headers : headers}).toPromise();
  }

  private getHttpHeaders(): HttpHeaders {
    const informationsAccessTokenPeConnect = this.sessionStorageService.retrieve(KeysSessionStorageEnum.OIDC_INDIVIDU_ACCESS_TOKEN_STORAGE_SESSION_KEY);
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+ informationsAccessTokenPeConnect.accessToken});
    return headers;
  }
}