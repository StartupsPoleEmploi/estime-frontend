import { InformationsPersonnelles } from "@models/informations-personnelles";
import { BeneficiaireAides } from "@app/commun/models/beneficiaire-aides";
import { FuturTravail } from "@models/futur-travail";
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { SituationFamiliale } from "@models/situation-familiale";
import { PeConnectAuthorization } from "./pe-connect-authorization";

export class DemandeurEmploi {
  idPoleEmploi: string;
  beneficiaireAides: BeneficiaireAides;
  futurTravail: FuturTravail;
  informationsPersonnelles: InformationsPersonnelles;
  ressourcesFinancieres: RessourcesFinancieres;
  situationFamiliale: SituationFamiliale;
  peConnectAuthorization: PeConnectAuthorization;
}
