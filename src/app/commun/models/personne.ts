import { InformationsPersonnelles } from "@models/informations-personnelles";
import { RessourcesFinancieresAvantSimulation } from "@app/commun/models/ressources-financieres-avant-simulation";
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';

export class Personne {
  beneficiaireAides: BeneficiaireAides
  informationsPersonnelles: InformationsPersonnelles;
  ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation;
}
