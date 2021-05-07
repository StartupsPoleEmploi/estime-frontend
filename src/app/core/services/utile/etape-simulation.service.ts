import { Injectable } from '@angular/core';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { EtapeSimulation } from "@models/etape-simulation";

@Injectable({providedIn: 'root'})
export class EtapeSimulationService {

  etapesSimulation = [
    { numero: 1, titre: "Offre d'emploi", pathRoute: `/${RoutesEnum.ETAPES_SIMULATION}/${RoutesEnum.CONTRAT_TRAVAIL}` },
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

  public isPathRouteEtapesSimulation(pathRouteActivated: string): boolean {
    let isPathRouteEtapesSimulation = false;
    if(pathRouteActivated === RoutesEnum.CONTRAT_TRAVAIL ||
       pathRouteActivated === RoutesEnum.MA_SITUATION ||
       pathRouteActivated === RoutesEnum.MES_PERSONNES_A_CHARGE  ||
       pathRouteActivated === RoutesEnum.RESSOURCES_ACTUELLES ||
       pathRouteActivated === RoutesEnum.RESULTAT_SIMULATION ) {
        isPathRouteEtapesSimulation = true;
    }
    return isPathRouteEtapesSimulation;
  }
}