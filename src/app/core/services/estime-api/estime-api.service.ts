import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PeConnectPayload } from '@app/commun/models/pe-connect-payload';
import { SimulationAidesSociales } from '@app/commun/models/simulation-aides-sociales';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { Environment } from '@models/environment';
import { PeConnectAuthorization } from '@models/pe-connect-authorization';
import { CookiesPeConnectAuthorizationService } from '../access-control/cookies-pe-connect-authorization.service';

@Injectable({ providedIn: 'root' })
export class EstimeApiService {

  private pathDemandeurEmploiService: string;

  constructor(
    private environment: Environment,
    private http: HttpClient,
    private cookiesPeConnectAuthorizationService: CookiesPeConnectAuthorizationService
  ) {

    this.pathDemandeurEmploiService = `${this.environment.apiEstimeURL}individus/`;
  }

  public authentifier(peConnectPayload: PeConnectPayload): Promise<PeConnectAuthorization> {
    return this.http.post<PeConnectAuthorization>(`${this.pathDemandeurEmploiService}authentifier`, peConnectPayload).toPromise();
  }

  public creerDemandeurEmploi(): Promise<DemandeurEmploi> {
    const options = this.getHttpHeaders();
    const peConnectAuthorization = this.cookiesPeConnectAuthorizationService.getFromCookies();
    return this.http.put<DemandeurEmploi>(`${this.pathDemandeurEmploiService}demandeur_emploi`, peConnectAuthorization, options).toPromise();
  }

  public simulerMesAides(demandeurEmploi: DemandeurEmploi): Promise<SimulationAidesSociales> {
    const options = this.getHttpHeaders();
    return this.http.post<SimulationAidesSociales>(`${this.pathDemandeurEmploiService}demandeur_emploi/simulation_aides_sociales`, demandeurEmploi, options).toPromise();
  }

  private getHttpHeaders() {
    const peConnectAuthorization = this.cookiesPeConnectAuthorizationService.getFromCookies();

    const optionRequete = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${peConnectAuthorization.idToken}`
      })
    };

    return optionRequete;
  }
}