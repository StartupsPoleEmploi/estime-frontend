class HomePage {

  clickOnCommencerSimulation() {
    cy.get('[data-testid=btn-je-commence]').click();
  }
}
export default HomePage