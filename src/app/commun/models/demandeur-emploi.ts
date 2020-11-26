import { InformationsPersonnelles } from "@app/commun/models/informations-personnelles";
import { BeneficiaireAidesSociales } from "@models/beneficiaire-aides-sociales";
import { FuturTravail } from "@models/futur-travail";
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { SituationFamiliale } from "@models/situation-familiale";

export class DemandeurEmploi {
  idPoleEmploi: string;
  beneficiaireAidesSociales: BeneficiaireAidesSociales;
  futurTravail: FuturTravail;
  informationsPersonnelles: InformationsPersonnelles;
  ressourcesFinancieres: RessourcesFinancieres;
  situationFamiliale: SituationFamiliale;
}
