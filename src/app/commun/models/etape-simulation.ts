export class EtapeSimulation {
  numero: number;
  titre: string;
  pathRoute: string;

  constructor(numero: number, pathRoute: string, titre: string) {
    this.numero = numero;
    this.pathRoute = pathRoute;
    this.titre= titre;
  }
}
