import { PeConnectAuthorization } from "./pe-connect-authorization";
import { BeneficiaireAidesSociales } from "@models/beneficiaire-aides-sociales";
import { RessourcesFinancieres } from "@models/ressources-financieres";

export class Individu {
  beneficiaireAidesSociales: BeneficiaireAidesSociales;
  idPoleEmploi: string;
  populationAutorisee: boolean;
  peConnectAuthorization: PeConnectAuthorization;
  ressourcesFinancieres: RessourcesFinancieres;
}