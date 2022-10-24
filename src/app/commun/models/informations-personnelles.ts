import { Logement } from "./logement";

export class InformationsPersonnelles {
  dateNaissance: string;
  nationalite: string;
  nom: string;
  prenom: string;
  logement: Logement;
  hasTitreSejourEnFranceValide: boolean;
  hasRevenusImmobilier: boolean;
  hasPensionRetraite: boolean;
  isSalarie: boolean;
  isSansRessource: boolean;
  isMicroEntrepreneur: boolean;
  isTravailleurIndependant: boolean;
  isBeneficiaireACRE: boolean;
  dateRepriseCreationEntreprise: string;
}