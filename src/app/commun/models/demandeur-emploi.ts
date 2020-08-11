import { Individu } from "@models/individu";
import { DetailIndemnisation } from "@models/detail-indemnisation";
import { AccessTokenInfo } from "@models/access-token-info";
import { Aide } from '@models/aide';

export class DemandeurEmploi extends Individu {

  detailIndemnisation: DetailIndemnisation;
  mesAides: Array<Aide>;

  constructor(
    donneesAccessToken: AccessTokenInfo,
    nom: string,
    prenom: string,
    email: string
  ) {
    super(donneesAccessToken, nom, prenom, email);
  }
}
