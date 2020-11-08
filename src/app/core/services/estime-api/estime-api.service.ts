import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Environment } from '@models/environment';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { InformationAutorisationOIDC } from '@models/informations-autorisation-oidc';
import { InformationsAccessTokenPeConnect } from "@models/informations-access-token-pe-connect";
import { SessionStorageService } from 'ngx-webstorage';
import { KeysSessionStorageEnum } from "@enumerations/keys-session-storage.enum";

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

  public authentifier(informationAutorisationOIDC: InformationAutorisationOIDC): Promise<InformationsAccessTokenPeConnect> {
    return this.http.post<InformationsAccessTokenPeConnect>(`${this.pathDemandeurEmploiService}authentifier`, informationAutorisationOIDC).toPromise();
  }

  public getDemandeurEmploi(): Promise<DemandeurEmploi> {
    const headers = this.getHttpHeaders();
    return this.http.get<DemandeurEmploi>(`${this.pathDemandeurEmploiService}demandeur_emploi`, {headers : headers}).toPromise();
  }

  public simulerMesAides(demandeurEmploi: DemandeurEmploi): Promise<DemandeurEmploi> {
    const headers = this.getHttpHeaders();
    return this.http.post<DemandeurEmploi>(`${this.pathDemandeurEmploiService}demandeur_emploi/simuler_mes_aides`, demandeurEmploi, {headers : headers}).toPromise();
  }


  private getHttpHeaders(): HttpHeaders {
    const informationsAccessTokenPeConnect = this.sessionStorageService.retrieve(KeysSessionStorageEnum.OIDC_INDIVIDU_ACCESS_TOKEN_STORAGE_SESSION_KEY);
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+ informationsAccessTokenPeConnect.accessToken});
    return headers;
  }
}