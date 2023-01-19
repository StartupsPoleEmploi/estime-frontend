import { Coordonnees } from "./coordonnees";

export class Logement {
  coordonnees: Coordonnees;
  statutOccupationLogement: string;
  isCrous: boolean;
  isColloc: boolean;
  isConventionne: boolean;
  isChambre: boolean;
  montantLoyer: number;
}