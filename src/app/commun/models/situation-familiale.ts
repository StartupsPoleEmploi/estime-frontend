import { Personne } from "@models/personne";

export class SituationFamiliale {
  conjoint: Personne;
  isEnCouple: boolean;
  nombrePersonnesACharge: number;
  personnesACharge: Array<Personne>;
}