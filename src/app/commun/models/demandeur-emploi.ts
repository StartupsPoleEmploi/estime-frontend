import { BeneficiaireAidesSociales } from "@models/beneficiaire-aides-sociales";
import { FuturTravail } from "@models/futur-travail";
import { InformationsIdentite } from "@models/informations-identite";
import { SituationFamiliale } from "@models/situation-familiale";
import { RessourcesFinancieres } from './ressources-financieres';


export class DemandeurEmploi {

  beneficiaireAidesSociales: BeneficiaireAidesSociales;
  futurTravail: FuturTravail;
  informationsIdentite: InformationsIdentite;
  ressourcesFinancieres: RessourcesFinancieres;
  situationFamiliale: SituationFamiliale;

  constructor() {
  }
}
