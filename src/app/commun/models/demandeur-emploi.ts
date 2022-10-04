import { InformationsPersonnelles } from "@models/informations-personnelles";
import { BeneficiaireAides } from "@app/commun/models/beneficiaire-aides";
import { FuturTravail } from "@models/futur-travail";
import { RessourcesFinancieresAvantSimulation } from '@app/commun/models/ressources-financieres-avant-simulation';
import { SituationFamiliale } from "@models/situation-familiale";
import { PeConnectAuthorization } from "./pe-connect-authorization";

export class DemandeurEmploi {
  idEstime: string;
  idPoleEmploi: string;
  beneficiaireAides: BeneficiaireAides;
  futurTravail: FuturTravail;
  informationsPersonnelles: InformationsPersonnelles;
  peConnectAuthorization: PeConnectAuthorization;
  ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation;
  situationFamiliale: SituationFamiliale;
}
