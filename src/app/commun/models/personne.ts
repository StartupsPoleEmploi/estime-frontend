import { InformationsPersonnelles } from "@models/informations-personnelles";
import { RessourcesFinancieres } from "@models/ressources-financieres";
import { BeneficiaireAidesSociales } from '@models/beneficiaire-aides-sociales';

export class Personne {
  beneficiaireAidesSociales: BeneficiaireAidesSociales
  informationsPersonnelles: InformationsPersonnelles;
  ressourcesFinancieres: RessourcesFinancieres;
}
