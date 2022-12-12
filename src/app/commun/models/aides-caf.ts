import { AidesFamiliales } from "@models/aides-familiales";
import { AidesLogement } from "./aides-logement";

export class AidesCAF {
  allocationAAH: number;
  allocationRSA: number;
  primeActivite: number;
  hasPrimeActivite: number;
  aidesFamiliales: AidesFamiliales;
  aidesLogement: AidesLogement;
  prochaineDeclarationTrimestrielle: number;
}