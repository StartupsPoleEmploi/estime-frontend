export class SituationPersonne {
  isHandicape: boolean;
  isSalarie: boolean;
  isSansEmploiAvecRessource: boolean;
  isSansEmploiSansRessource: boolean;

  constructor(isHandicape: boolean, isSalarie: boolean, isSansEmploiAvecRessource: boolean, isSansEmploiSansRessource: boolean) {
    this.isHandicape = isHandicape;
    this.isSalarie = isSalarie;
    this.isSansEmploiAvecRessource = isSansEmploiAvecRessource;
    this.isSansEmploiSansRessource = isSansEmploiSansRessource;
  }
}