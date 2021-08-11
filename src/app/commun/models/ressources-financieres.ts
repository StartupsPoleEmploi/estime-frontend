import { AidesPoleEmploi } from "@models/aides-pole-emploi";
import { AidesCAF } from "@models/aides-caf";
import { AidesCPAM } from "@models/aides-cpam";
import { SalairesAvantPeriodeSimulation } from "@models/salaires-avant-periode-simulation";
import { Salaire } from "@models/salaire";

export class RessourcesFinancieres {
  aidesCAF: AidesCAF;
  aidesPoleEmploi: AidesPoleEmploi;
  aidesCPAM : AidesCPAM;
  hasTravailleAuCoursDerniersMois: boolean;
  nombreMoisTravaillesDerniersMois: number;
  beneficesTravailleurIndependantDernierExercice: number;
  revenusMicroEntreprise3DerniersMois: number;
  revenusImmobilier3DerniersMois: number;
  salairesAvantPeriodeSimulation: SalairesAvantPeriodeSimulation;
  salaire: Salaire;
}