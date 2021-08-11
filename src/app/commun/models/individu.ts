import { PeConnectAuthorization } from "./pe-connect-authorization";
import { BeneficiaireAides } from "@app/commun/models/beneficiaire-aides";
import { RessourcesFinancieres } from "@models/ressources-financieres";

export class Individu {
  beneficiaireAides: BeneficiaireAides;
  idPoleEmploi: string;
  populationAutorisee: boolean;
  peConnectAuthorization: PeConnectAuthorization;
  ressourcesFinancieres: RessourcesFinancieres;
}