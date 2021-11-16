import { Logement } from "./logement";

export class InformationsPersonnelles {
  codePostal: string;
  dateNaissance: string;
  email: string;
  hasRevenusImmobilier: boolean;
  travailleurIndependant: boolean;
  microEntrepreneur: boolean;
  logement: Logement;
  habiteDansDOM: boolean;
  salarie: boolean;
  sansRessource: boolean;
  nationalite: string;
  nom: string;
  prenom: string;
  titreSejourEnFranceValide: boolean;
}