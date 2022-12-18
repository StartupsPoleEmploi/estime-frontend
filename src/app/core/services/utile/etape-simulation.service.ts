import { Injectable } from '@angular/core';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { EtapeSimulation } from "@models/etape-simulation";

@Injectable({ providedIn: 'root' })
export class EtapeSimulationService {

  etapesSimulationToutesAides = [
    { numero: 1, titre: "Offre d'emploi", pathRoute: `/${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.CONTRAT_TRAVAIL}` },
    { numero: 2, titre: "Ma situation", pathRoute: `/${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.SITUATION}` },
    { numero: 3, titre: "Mes personnes à charge", pathRoute: `/${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.PERSONNES_A_CHARGE}` },
    { numero: 4, titre: "Les ressources actuelles", pathRoute: `/${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.RESSOURCES_ACTUELLES}` },
    { numero: 5, titre: "Résultat simulation", pathRoute: `/${RoutesEnum.PARCOURS_TOUTES_AIDES}/${RoutesEnum.RESULTAT_SIMULATION}` }
  ];

  etapesSimulationComplementARE = [
    { numero: 1, titre: "Ma situation", pathRoute: `/${RoutesEnum.PARCOURS_COMPLEMENT_ARE}/${RoutesEnum.SITUATION}` },
    { numero: 2, titre: "Activité reprise", pathRoute: `/${RoutesEnum.PARCOURS_COMPLEMENT_ARE}/${RoutesEnum.ACTIVITE_REPRISE}` },
    { numero: 3, titre: "Résultat simulation", pathRoute: `/${RoutesEnum.PARCOURS_COMPLEMENT_ARE}/${RoutesEnum.RESULTAT_SIMULATION}` }
  ];

  public getEtapesSimulationParcoursToutesAides(): Array<EtapeSimulation> {
    return this.etapesSimulationToutesAides;
  }

  public getEtapesSimulationParcoursComplementARE(): Array<EtapeSimulation> {
    return this.etapesSimulationComplementARE;
  }

  public getNumeroEtapeParcoursToutesAidesByPathRoute(pathRoute: string) {
    return this.getNumeroEtapeByPathRoute(pathRoute, this.etapesSimulationToutesAides);
  }

  public getNumeroEtapeParcoursComplementAREByPathRoute(pathRoute: string) {
    return this.getNumeroEtapeByPathRoute(pathRoute, this.etapesSimulationComplementARE);
  }

  public getNumeroEtapeByPathRoute(pathRoute: string, etapesSimulation: Array<EtapeSimulation>): number {
    let numero = null;
    etapesSimulation.forEach(etapeSimulation => {
      if (etapeSimulation.pathRoute === pathRoute) {
        numero = etapeSimulation.numero;
      }
    });
    return numero;
  }

  public isPathRouteEtapesSimulationParcoursToutesAides(pathRouteActivated: string): boolean {
    let isPathRouteEtapesSimulationToutesAides = false;
    if (pathRouteActivated === RoutesEnum.CONTRAT_TRAVAIL ||
      pathRouteActivated === RoutesEnum.SITUATION ||
      pathRouteActivated === RoutesEnum.PERSONNES_A_CHARGE ||
      pathRouteActivated === RoutesEnum.RESSOURCES_ACTUELLES ||
      pathRouteActivated === RoutesEnum.RESULTAT_SIMULATION) {
      isPathRouteEtapesSimulationToutesAides = true;
    }
    return isPathRouteEtapesSimulationToutesAides;
  }

  public isPathRouteEtapesSimulationParcoursComplementARE(pathRouteActivated: string): boolean {
    let isPathRouteEtapesSimulationComplementARE = false;
    if (pathRouteActivated === RoutesEnum.SITUATION ||
      pathRouteActivated === RoutesEnum.ACTIVITE_REPRISE ||
      pathRouteActivated === RoutesEnum.RESULTAT_SIMULATION) {
      isPathRouteEtapesSimulationComplementARE = true;
    }
    return isPathRouteEtapesSimulationComplementARE;
  }
}