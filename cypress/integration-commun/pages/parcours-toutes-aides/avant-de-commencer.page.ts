class AvantDeCommencerPage {

  clickOnContinuer() {
    cy.get('[data-testid=btn-je-continue-avant-commencer]').click();
    //wait chargement page car appel d'un service backend pour récupérer des données
    cy.wait(2000);
  }
}
export default AvantDeCommencerPage