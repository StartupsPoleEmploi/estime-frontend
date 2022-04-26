import { RessourceFinanciere } from "./ressource-financiere";

export class Aide extends RessourceFinanciere {
  conditionsAcces: string;
  detail: string;
  organisme: string;
  reportee: boolean;
  lienExterne: string;
}
