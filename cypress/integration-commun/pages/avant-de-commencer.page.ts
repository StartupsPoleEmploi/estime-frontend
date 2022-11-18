class AvantDeCommencerPage {

  clickOnJeCommenceSimulationComplete() {
    cy.get('[data-testid=btn-effectuer-simulation-complete]').click();
    cy.get('[data-testid=btn-je-continue-avant-commencer]').click();
    //wait chargement page car appel d'un service backend pour récupérer des données
    cy.wait(2000);
  }

  clickOnJeCommenceSimulationRapide() {
    cy.get('[data-testid=btn-effectuer-simulation-rapide]').click();
    //wait chargement page car appel d'un service backend pour récupérer des données
    cy.wait(2000);
  }
}
export default AvantDeCommencerPage