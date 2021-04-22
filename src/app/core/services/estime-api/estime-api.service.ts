import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { Environment } from '@models/environment';
import { Individu } from '@models/individu';
import { PeConnectPayload } from '@models/pe-connect-payload';
import { SimulationAidesSociales } from '@models/simulation-aides-sociales';
import { IndividuConnectedService } from '../connexion/individu-connected.service';
import { QueryParamEnum } from "@enumerations/query-param.enum";
import { OptionsHTTP } from "@models/options-http";

@Injectable({ providedIn: 'root' })
export class EstimeApiService {

  private pathDemandeurEmploiService: string;

  constructor(
    private environment: Environment,
    private http: HttpClient,
    private individuConnectedService: IndividuConnectedService
  ) {

    this.pathDemandeurEmploiService = `${this.environment.apiEstimeURL}individus/`;
  }

  public authentifier(peConnectPayload: PeConnectPayload): Promise<Individu> {
    return this.http.post<Individu>(`${this.pathDemandeurEmploiService}authentifier`, peConnectPayload).toPromise();
  }

  public creerDemandeurEmploi(): Promise<DemandeurEmploi> {
    const options = this.getHttpHeaders();
    const individuConnected = this.individuConnectedService.getIndividuConnected();
    return this.http.put<DemandeurEmploi>(`${this.pathDemandeurEmploiService}demandeur_emploi`, individuConnected, options).toPromise();
  }

  public simulerMesAides(demandeurEmploi: DemandeurEmploi): Promise<SimulationAidesSociales> {
    const options = this.getHttpHeaders();
    return this.http.post<SimulationAidesSociales>(`${this.pathDemandeurEmploiService}demandeur_emploi/simulation_aides_sociales`, demandeurEmploi, options).toPromise();
  }

  public supprimerDonneesSuiviParcoursDemandeur(idPoleEmploi: string): Promise<Object> {
    const options = this.getHttpHeaders();
    options.params = new HttpParams().set(QueryParamEnum.ID_POLE_EMPLOI, idPoleEmploi);

    return this.http.delete(`${this.pathDemandeurEmploiService}demandeur_emploi/suivi_parcours`, options).toPromise();
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