import { Injectable } from '@angular/core';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { Observable, Subject } from 'rxjs';
import { EtapeSimulation } from "@models/etape-simulation";

@Injectable({providedIn: 'root'})
export class EtapeSimulationService {

  etapesSimulation = [
    { numero: 1, titre: "Contrat<br>de travail", pathRoute: `/${RoutesEnum.ETAPES_SIMULATION}/${RoutesEnum.CONTRAT_TRAVAIL}` },
    { numero: 2, titre: "Ma situation", pathRoute: `/${RoutesEnum.ETAPES_SIMULATION}/${RoutesEnum.MA_SITUATION}` },
    { numero: 3, titre: "Mes personnes<br>à charge", pathRoute: `/${RoutesEnum.ETAPES_SIMULATION}/${RoutesEnum.MES_PERSONNES_A_CHARGE}` },
    { numero: 4, titre: "Les ressources<br>actuelles", pathRoute: `/${RoutesEnum.ETAPES_SIMULATION}/${RoutesEnum.RESSOURCES_ACTUELLES}` },
    { numero: 5, titre: "Résultat<br>simulation", pathRoute: `/${RoutesEnum.ETAPES_SIMULATION}/${RoutesEnum.RESULTAT_SIMULATION}` }
  ];

  public getEtapesSimulation():Array<EtapeSimulation>  {
    return this.etapesSimulation;
  }

  public getNumeroEtapeByPathRoute(pathRoute: string): number {
    let numero = null;
    this.etapesSimulation.forEach(etapeSimulation => {
      if (etapeSimulation.pathRoute === pathRoute) {
        numero = etapeSimulation.numero;
      }
    });
    return numero;
  }
}