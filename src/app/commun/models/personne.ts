import { InformationsPersonnelles } from "@models/informations-personnelles";
import { RessourcesFinancieres } from "@models/ressources-financieres";
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';

export class Personne {
  beneficiaireAides: BeneficiaireAides
  informationsPersonnelles: InformationsPersonnelles;
  ressourcesFinancieres: RessourcesFinancieres;
}
