import { Logement } from "./logement";
import { MicroEntreprise } from "./micro-entreprise";

export class InformationsPersonnelles {
  dateNaissance: string;
  nationalite: string;
  nom: string;
  prenom: string;
  logement: Logement;
  microEntreprise: MicroEntreprise;
  hasTitreSejourEnFranceValide: boolean;
  hasRevenusImmobilier: boolean;
  hasPensionRetraite: boolean;
  isSalarie: boolean;
  isSansRessource: boolean;
  isMicroEntrepreneur: boolean;
  isTravailleurIndependant: boolean;
  isBeneficiaireACRE: boolean;
}