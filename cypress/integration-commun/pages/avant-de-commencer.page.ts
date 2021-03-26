class AvantDeCommencerPage {

  clickOnJeCommence() {
    cy.get('[data-testid=btn-je-continue-avant-commencer]').click();
    //wait chargement page car appel d'un service backend pour récupérer des données
    cy.wait(5000);
  }
}
export default AvantDeCommencerPage