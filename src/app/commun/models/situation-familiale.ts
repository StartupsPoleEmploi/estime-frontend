import { Personne } from "@models/personne";

export class SituationFamiliale {
  conjoint: Personne;
  isEnCouple: boolean;
  personnesACharge: Array<Personne>;
}