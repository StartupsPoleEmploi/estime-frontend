import { StatutOccupationLogement } from "./statut-occupation-logement";

export class Logement {
  codeInsee: string;
  isDeMayotte: boolean;
  statutOccupationLogement: StatutOccupationLogement;
  isCrous: boolean;
  isColloc: boolean;
  isConventionne: boolean;
  isChambre: boolean;
  montantLoyer: number;
  montantCharges: number;
}