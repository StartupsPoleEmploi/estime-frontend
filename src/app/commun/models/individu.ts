import { AccessTokenInfo } from "@models/access-token-info";

export class Individu {

  donneesAccessToken: AccessTokenInfo;
  nom: string;
  prenom: string;
  email: string;


  constructor(
    donneesAccessToken: AccessTokenInfo,
    nom: string,
    prenom: string,
    email: string
  ) {
    this.donneesAccessToken = donneesAccessToken;
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
  }
}
