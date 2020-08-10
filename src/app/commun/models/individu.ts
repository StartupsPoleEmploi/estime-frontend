import { AccessTokenInfo } from "@models/access-token-info";

export class Individu {

  accessTokenInfo: AccessTokenInfo;
  nom: string;
  prenom: string;
  email: string;


  constructor(
    accessTokenInfo: AccessTokenInfo,
    nom: string,
    prenom: string,
    email: string
  ) {
    this.accessTokenInfo = accessTokenInfo;
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
  }
}
