import { AllocationsPoleEmploi } from "@models/allocations-pole-emploi";
import { AllocationsCAF } from "@models/allocations-caf";
import { AllocationsCPAM } from "@models/allocations-cpam";
import { SalairesAvantPeriodeSimulation } from "@models/salaires-avant-periode-simulation";

export class RessourcesFinancieres {
  allocationsCAF: AllocationsCAF;
  allocationsPoleEmploi: AllocationsPoleEmploi;
  allocationsCPAM : AllocationsCPAM;
  hasTravailleAuCours6DerniersMois: boolean;
  nombreMoisTravailles6DerniersMois: number;
  salaireNet: number;
  revenusCreateurEntreprise3DerniersMois: number;
  revenusImmobilier3DerniersMois: number;
  salairesAvantPeriodeSimulation: SalairesAvantPeriodeSimulation;
}