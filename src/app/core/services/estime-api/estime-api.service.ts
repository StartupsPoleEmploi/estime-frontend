import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Aide } from '@app/commun/models/aide';
import { QueryParamEnum } from "@enumerations/query-param.enum";
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { Environment } from '@models/environment';
import { Individu } from '@models/individu';
import { OptionsHTTP } from "@models/options-http";
import { PeConnectPayload } from '@models/pe-connect-payload';
import { Simulation } from '@app/commun/models/simulation';
import { Observable } from 'rxjs';

import { IndividuConnectedService } from '../connexion/individu-connected.service';

@Injectable({ providedIn: 'root' })
export class EstimeApiService {

  private pathDemandeurEmploiService: string;

  constructor(
    private environment: Environment,
    private http: HttpClient,
    private individuConnectedService: IndividuConnectedService
  ) {

    this.pathDemandeurEmploiService = this.environment.apiEstimeURL;
  }

  public authentifier(peConnectPayload: PeConnectPayload): Observable<Individu> {
    return this.http.post<Individu>(`${this.pathDemandeurEmploiService}individus/authentifier`, peConnectPayload);
  }

  public creerEmail(email: string): Observable<string> {
    const options = this.getHttpHeaders(false);
    return this.http.put<string>(`${this.pathDemandeurEmploiService}emails`, email, options);
  }

  public creerDemandeurEmploi(): Observable<DemandeurEmploi> {
    const options = this.getHttpHeaders(true);
    const individuConnected = this.individuConnectedService.getIndividuConnected();
    return this.http.put<DemandeurEmploi>(`${this.pathDemandeurEmploiService}demandeurs_emploi`, individuConnected, options);
  }

  public getAideByCode(codeAide: string): Observable<Aide> {
    const options = this.getHttpHeaders(false);
    return this.http.get<Aide>(`${this.pathDemandeurEmploiService}aides/${codeAide}`, options);
  }

  public simulerMesAides(demandeurEmploi: DemandeurEmploi): Observable<Simulation> {
    const options = this.getHttpHeaders(true);
    this.setPeConnectAuthorization(demandeurEmploi);
    return this.http.post<Simulation>(`${this.pathDemandeurEmploiService}demandeurs_emploi/simulation_aides`, demandeurEmploi, options);
  }

  public supprimerDonneesSuiviParcoursDemandeur(idPoleEmploi: string): Observable<Object> {
    const options = this.getHttpHeaders(true);
    options.params = new HttpParams().set(QueryParamEnum.ID_POLE_EMPLOI, idPoleEmploi);

    return this.http.delete(`${this.pathDemandeurEmploiService}demandeurs_emploi/suivi_parcours`, options);
  }

  private getHttpHeaders(withAuthorization: boolean) {
    const optionRequete = new OptionsHTTP();
    if (withAuthorization) {
      const individuConnected = this.individuConnectedService.getIndividuConnected();
      optionRequete.headers = new HttpHeaders({
        'Authorization': `Bearer ${individuConnected.peConnectAuthorization.idToken}`,
        'Content-Type': 'application/json'
      });
    } else {
      optionRequete.headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
    return optionRequete;
  }

  private setPeConnectAuthorization(demandeurEmploi: DemandeurEmploi): void {
    const individuConnected = this.individuConnectedService.getIndividuConnected();
    demandeurEmploi.peConnectAuthorization = individuConnected.peConnectAuthorization;
  }
}

