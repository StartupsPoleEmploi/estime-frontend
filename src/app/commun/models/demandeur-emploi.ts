import { BeneficiaireAidesSociales } from "@models/beneficiaire-aides-sociales";
import { FuturTravail } from "@models/futur-travail";
import { InformationsPersonnelles } from "@app/commun/models/informations-personnelles";
import { SituationFamiliale } from "@models/situation-familiale";
import { RessourcesFinancieres } from './ressources-financieres';
import { SimulationAidesSociales } from "@models/simulation-aides-sociales";

export class DemandeurEmploi {
  beneficiaireAidesSociales: BeneficiaireAidesSociales;
  futurTravail: FuturTravail;
  informationsPersonnelles: InformationsPersonnelles;
  ressourcesFinancieres: RessourcesFinancieres;
  simulationAidesSociales: SimulationAidesSociales;
  situationFamiliale: SituationFamiliale;
}
