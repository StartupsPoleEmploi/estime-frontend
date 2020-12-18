
class MaSituationPage {

  public selectNationalite(nationalite: string) {
    cy.get('[data-testid=select-nationalite]').select(nationalite);
  }

  public clickOnSituationFamilialeSeul() {
    cy.get('[data-testid=btn-situation-familiale-seul]').click();
  }

  public clickOnSuivant() {
    cy.get('[data-testid=btn-ma-situation-suivant]').click();
  }
}
export default MaSituationPage