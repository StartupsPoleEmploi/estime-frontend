import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PeConnectPayload } from '@app/commun/models/pe-connect-payload';
import { SimulationAidesSociales } from '@app/commun/models/simulation-aides-sociales';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { Environment } from '@models/environment';
import { Individu } from '@models/individu';
import { CookiesIndividuService } from '../access-control/cookies-individu.service';

@Injectable({ providedIn: 'root' })
export class EstimeApiService {

  private pathDemandeurEmploiService: string;

  constructor(
    private environment: Environment,
    private http: HttpClient,
    private cookiesIndividuService: CookiesIndividuService
  ) {

    this.pathDemandeurEmploiService = `${this.environment.apiEstimeURL}individus/`;
  }

  public authentifier(peConnectPayload: PeConnectPayload): Promise<Individu> {
    return this.http.post<Individu>(`${this.pathDemandeurEmploiService}authentifier`, peConnectPayload).toPromise();
  }

  public creerDemandeurEmploi(): Promise<DemandeurEmploi> {
    const options = this.getHttpHeaders();
    const individu = this.cookiesIndividuService.getFromCookies();
    return this.http.put<DemandeurEmploi>(`${this.pathDemandeurEmploiService}demandeur_emploi`, individu, options).toPromise();
  }

  public simulerMesAides(demandeurEmploi: DemandeurEmploi): Promise<SimulationAidesSociales> {
    const options = this.getHttpHeaders();
    return this.http.post<SimulationAidesSociales>(`${this.pathDemandeurEmploiService}demandeur_emploi/simulation_aides_sociales`, demandeurEmploi, options).toPromise();
  }

  private getHttpHeaders() {
    const individu = this.cookiesIndividuService.getFromCookies();

    const optionRequete = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${individu.peConnectAuthorization.idToken}`
      })
    };

    return optionRequete;
  }
}