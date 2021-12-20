import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Aide } from '@app/commun/models/aide';
import { Commune } from '@app/commun/models/commune';
import { QueryParamEnum } from "@enumerations/query-param.enum";
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { Environment } from '@models/environment';
import { Individu } from '@models/individu';
import { OptionsHTTP } from "@models/options-http";
import { PeConnectPayload } from '@models/pe-connect-payload';
import { SimulationAides } from '@models/simulation-aides';
import { Observable } from 'rxjs';

import { IndividuConnectedService } from '../connexion/individu-connected.service';

@Injectable({ providedIn: 'root' })
export class EstimeApiService {

  private pathDemandeurEmploiService: string;
  private pathApiCommunes: string;

  constructor(
    private environment: Environment,
    private http: HttpClient,
    private individuConnectedService: IndividuConnectedService
  ) {

    this.pathDemandeurEmploiService = this.environment.apiEstimeURL;
    this.pathApiCommunes = 'https://geo.api.gouv.fr/communes?codePostal=';
  }

  public authentifier(peConnectPayload: PeConnectPayload): Promise<Individu> {
    return this.http.post<Individu>(`${this.pathDemandeurEmploiService}individus/authentifier`, peConnectPayload).toPromise();
  }

  public creerDemandeurEmploi(): Promise<DemandeurEmploi> {
    const options = this.getHttpHeaders();
    const individuConnected = this.individuConnectedService.getIndividuConnected();
    return this.http.put<DemandeurEmploi>(`${this.pathDemandeurEmploiService}individus/demandeur_emploi`, individuConnected, options).toPromise();
  }

  public simulerMesAides(demandeurEmploi: DemandeurEmploi): Promise<SimulationAides> {
    const options = this.getHttpHeaders();
    return this.http.post<SimulationAides>(`${this.pathDemandeurEmploiService}individus/demandeur_emploi/simulation_aides`, demandeurEmploi, options).toPromise();
  }

  public supprimerDonneesSuiviParcoursDemandeur(idPoleEmploi: string): Promise<Object> {
    const options = this.getHttpHeaders();
    options.params = new HttpParams().set(QueryParamEnum.ID_POLE_EMPLOI, idPoleEmploi);

    return this.http.delete(`${this.pathDemandeurEmploiService}individus/demandeur_emploi/suivi_parcours`, options).toPromise();
  }

  public getDetailAide(codeAide: string): Promise<Aide> {
    let response = this.http.get<Aide>(`${this.pathDemandeurEmploiService}aides/${codeAide}/details`).toPromise();
    return response;
  }


  public getCommuneFromCodePostal(codePostal: string): Observable<Commune[]> {
    return this.http.get<Array<Commune>>(`${this.pathApiCommunes}${codePostal}&fields=code`, { observe: 'body', responseType: 'json' });
  }

  private getHttpHeaders() {
    const individuConnected = this.individuConnectedService.getIndividuConnected();

    const optionRequete = new OptionsHTTP();
    optionRequete.headers = new HttpHeaders({
      'Authorization': `Bearer ${individuConnected.peConnectAuthorization.idToken}`,
      'Content-Type': 'application/json'
    });


    return optionRequete;
  }
}