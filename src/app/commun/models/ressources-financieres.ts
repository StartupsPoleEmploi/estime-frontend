import { AllocationsPoleEmploi } from "@models/allocations-pole-emploi";
import { AllocationsCAF } from "@models/allocations-caf";

export class RessourcesFinancieres {
  allocationsCAF: AllocationsCAF;
  allocationsPoleEmploi: AllocationsPoleEmploi;
  salaireNet: number;
  revenusCreateurEntreprise3DerniersMois: number;
  revenusImmobilier3DerniersMois: number;
}