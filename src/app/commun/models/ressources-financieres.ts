import { AllocationsPoleEmploi } from "@models/allocations-pole-emploi";
import { AllocationsCAF } from "@models/allocations-caf";
import { AllocationsCPAM } from "@models/allocations-cpam";
import { SalairesAvantPeriodeSimulation } from "@models/salaires-avant-periode-simulation";
import { Salaire } from "@models/salaire";

export class RessourcesFinancieres {
  allocationsCAF: AllocationsCAF;
  allocationsPoleEmploi: AllocationsPoleEmploi;
  allocationsCPAM : AllocationsCPAM;
  hasTravailleAuCoursDerniersMois: boolean;
  nombreMoisTravaillesDerniersMois: number;
  revenusCreateurEntreprise3DerniersMois: number;
  revenusImmobilier3DerniersMois: number;
  salairesAvantPeriodeSimulation: SalairesAvantPeriodeSimulation;
  salaire: Salaire;
}