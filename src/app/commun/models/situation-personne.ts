export class SituationPersonne {
  isHandicape: boolean;
  isSalarie: boolean;
  hasRessourceAideEmploi: boolean;
  isSansRessource: boolean;

  constructor(isHandicape: boolean, isSalarie: boolean, hasRessourceAideEmploi: boolean, isSansRessource: boolean) {
    this.isHandicape = isHandicape;
    this.isSalarie = isSalarie;
    this.hasRessourceAideEmploi = hasRessourceAideEmploi;
    this.isSansRessource = isSansRessource;
  }
}