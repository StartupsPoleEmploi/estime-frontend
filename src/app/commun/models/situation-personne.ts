export class SituationPersonne {
  isHandicape: boolean;
  isSalarie: boolean;
  isSansEmploi: boolean;

  constructor(isHandicape: boolean, isSalarie: boolean, isSansEmploi: boolean) {
    this.isHandicape = isHandicape;
    this.isSalarie = isSalarie;
    this.isSansEmploi = isSansEmploi;
  }
}