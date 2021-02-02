class MaSituationPage {

  public selectNationalite(nationalite: string) {
    cy.get('[data-testid=select-nationalite]').select(nationalite);
  }

  public clickOnSituationRevenuImmobilier() {
    cy.get('[data-testid=btn-situation-revenu-immobilier]').click();
  }

  public clickOnSituationCreateurEntreprise() {
    cy.get('[data-testid=btn-situation-createur-entreprise]').click();
  }

  public clickOnSituationAAH() {
    cy.get('[data-testid=btn-situation-aah]').click();
  }

  public clickOnSituationPensionInvalidite() {
    cy.get('[data-testid=btn-situation-pension-invalidite]').click();
  }

  public clickOnSituationFamilialeSeul() {
    cy.get('[data-testid=btn-situation-familiale-seul]').click();
  }

  public clickOnSituationFamilialeCouple() {
    cy.get('[data-testid=btn-situation-familiale-seul]').click();
  }

  public clickOnSituationConjointSalarie() {
    cy.get('[data-testid=btn-situation-conjoint-salarie]').click();
  }

  public clickOnSituationConjointARE() {
    cy.get('[data-testid=btn-situation-conjoint-are]').click();
  }

  public clickOnSituationConjointASS() {
    cy.get('[data-testid=btn-situation-conjoint-ass]').click();
  }

  public clickOnSituationConjointRSA() {
    cy.get('[data-testid=btn-situation-conjoint-rsa]').click();
  }

  public clickOnSituationConjointAAH() {
    cy.get('[data-testid=btn-situation-conjoint-aah]').click();
  }

  public clickOnSituationConjointPensionInvalidite() {
    cy.get('[data-testid=btn-situation-conjoint-pension-invalidite]').click();
  }

  public clickOnSituationConjointAucuneRessource() {
    cy.get('[data-testid=btn-situation-conjoint-aucune-ressource').click();
  }

  public clickOnSuivant() {
    cy.get('[data-testid=btn-ma-situation-suivant]').click();
  }
}
export default MaSituationPage