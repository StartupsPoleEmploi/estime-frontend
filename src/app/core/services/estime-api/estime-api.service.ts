import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Environment } from '@models/environment';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { InformationAutorisationOIDC } from '@models/informations-autorisation-oidc';
import { InformationsAccessTokenPeConnect } from "@models/informations-access-token-pe-connect";

@Injectable({providedIn: 'root'})
export class EstimeApiService {

  private pathDemandeurEmploiService: string;

  constructor(
    private http: HttpClient,
    private environment: Environment) {

    this.pathDemandeurEmploiService = `${this.environment.apiEstimeURL}demandeurs_emploi/`;
  }

  public authentifier(informationAutorisationOIDC: InformationAutorisationOIDC): Promise<InformationsAccessTokenPeConnect> {
    return this.http.post<InformationsAccessTokenPeConnect>(`${this.pathDemandeurEmploiService}authentifier`, informationAutorisationOIDC).toPromise();
  }

  public simulerMesAides(demandeurEmploi: DemandeurEmploi): Promise<DemandeurEmploi> {
    return this.http.post<DemandeurEmploi>(`${this.pathDemandeurEmploiService}simuler_mes_aides`, demandeurEmploi).toPromise();
  }
}