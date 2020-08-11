import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Environment } from '../../../commun/models/environment';
import { DemandeurEmploi } from '../../../commun/models/demandeur-emploi';
import { DonneesAutorisationOIDC } from '../../../commun/models/donnees-autorisation-oidc';

@Injectable({providedIn: 'root'})
export class DemandeurEmploiService {

  private pathDemandeurEmploiService: string;

  constructor(
    private http: HttpClient,
    private environment: Environment) {

    this.pathDemandeurEmploiService = `${this.environment.apiEstimeURL}demandeurs_emploi/`;
  }

  public authentifier(donneesAutorisationOIDC: DonneesAutorisationOIDC) {
    return this.http.post<DemandeurEmploi>(`${this.pathDemandeurEmploiService}authentifier`, donneesAutorisationOIDC).toPromise();
  }

  public simulerMesAides(demandeurEmploi: DemandeurEmploi) {
    return this.http.post<DemandeurEmploi>(`${this.pathDemandeurEmploiService}simuler_mes_aides`, demandeurEmploi).toPromise();
  }
}