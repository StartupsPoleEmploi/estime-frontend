import { Personne } from "@models/personne";

export class SituationFamiliale {
  conjoint: Personne;
  isEnCouple: boolean;
  isSeulPlusDe18Mois: boolean;
  personnesACharge: Array<Personne>;
}