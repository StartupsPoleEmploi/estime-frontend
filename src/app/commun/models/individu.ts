import { PeConnectAuthorization } from "./pe-connect-authorization";
import { BeneficiaireAides } from "@app/commun/models/beneficiaire-aides";
import { RessourcesFinancieresAvantSimulation } from "@app/commun/models/ressources-financieres-avant-simulation";

export class Individu {
  beneficiaireAides: BeneficiaireAides;
  idPoleEmploi: string;
  populationAutorisee: boolean;
  peConnectAuthorization: PeConnectAuthorization;
  ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation;
}