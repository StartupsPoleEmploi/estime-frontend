import { Logement } from "./logement";

export class InformationsPersonnelles {
  dateNaissance: string;
  email: string;
  hasRevenusImmobilier: boolean;
  travailleurIndependant: boolean;
  microEntrepreneur: boolean;
  logement: Logement;
  salarie: boolean;
  sansRessource: boolean;
  nationalite: string;
  nom: string;
  prenom: string;
  titreSejourEnFranceValide: boolean;
}