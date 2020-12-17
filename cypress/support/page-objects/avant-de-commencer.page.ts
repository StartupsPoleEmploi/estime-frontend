class AvantDeCommencerPage {

  clickOnJeCommence() {
    cy.get('[data-testid=btn-je-continue-avant-commencer]').click();
    cy.wait(3000);
  }
}
export default AvantDeCommencerPage