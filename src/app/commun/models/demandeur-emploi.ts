import { Individu } from "@models/individu";
import { DetailIndemnisation } from "@models/detail-indemnisation";
import { AccessTokenInfo } from "@models/access-token-info";

export class DemandeurEmploi extends Individu {

  detailIndemnisation: DetailIndemnisation;

  constructor(
    accessTokenInfo: AccessTokenInfo,
    nom: string,
    prenom: string,
    email: string
  ) {
    super(accessTokenInfo, nom, prenom, email);
  }
}
