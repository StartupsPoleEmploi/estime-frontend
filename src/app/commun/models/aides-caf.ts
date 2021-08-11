import { AllocationsLogement } from "@models/allocations-logement";
import { AidesFamiliales } from "@models/aides-familiales";

export class AidesCAF {
  allocationAAH: number;
  allocationRSA: number;
  aidesFamiliales: AidesFamiliales
  allocationsLogement: AllocationsLogement;
  prochaineDeclarationRSA: number;
}