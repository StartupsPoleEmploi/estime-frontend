import { AidesPoleEmploi } from "@models/aides-pole-emploi";
import { AidesCAF } from "@models/aides-caf";
import { AidesCPAM } from "@models/aides-cpam";
import { PeriodeTravailleeAvantSimulation } from "@app/commun/models/periode-travaillee-avant-simulation";
import { Salaire } from "@models/salaire";

export class RessourcesFinancieres {
  aidesCAF: AidesCAF;
  aidesPoleEmploi: AidesPoleEmploi;
  aidesCPAM : AidesCPAM;
  hasTravailleAuCoursDerniersMois: boolean;
  nombreMoisTravaillesDerniersMois: number;
  chiffreAffairesIndependantDernierExercice: number;
  beneficesMicroEntrepriseDernierExercice: number;
  revenusImmobilier3DerniersMois: number;
  periodeTravailleeAvantSimulation: PeriodeTravailleeAvantSimulation;
  salaire: Salaire;
}