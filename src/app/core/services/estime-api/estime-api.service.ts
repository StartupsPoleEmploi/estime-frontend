import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { Environment } from '@models/environment';
import { Individu } from '@models/individu';
import { PeConnectPayload } from '@models/pe-connect-payload';
import { SimulationAidesSociales } from '@models/simulation-aides-sociales';
import { IndividuConnectedService } from '../connexion/individu-connected.service';

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

  private getHttpHeaders() {
    const individuConnected = this.individuConnectedService.getIndividuConnected();

    const optionRequete = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${individuConnected.peConnectAuthorization.idToken}`
      })
    };
    return optionRequete;
  }
}