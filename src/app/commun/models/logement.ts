import { Coordonnees } from "./coordonnees";
import { StatutOccupationLogement } from "./statut-occupation-logement";

export class Logement {
  coordonnees: Coordonnees;
  statutOccupationLogement: StatutOccupationLogement;
  isCrous: boolean;
  isColloc: boolean;
  isConventionne: boolean;
  isChambre: boolean;
  montantLoyer: number;
  montantCharges: number;
}