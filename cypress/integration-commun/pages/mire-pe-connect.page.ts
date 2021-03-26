class MirePeConnectPage {

  clickOnPoursuivre() {
    cy.get('[type=submit]').click();
    cy.wait(1000);
  }

  saisirNomUtilisateur(nom: string) {
    cy.get('input[type="text"]').type(nom);
  }

  saisirMotDePasse(mdp: string) {
    cy.get('input[type="password"]').type(mdp);
  }

  clickOnSeConnecter() {
    cy.get('[type=submit]').click();
    cy.wait(5000);
  }
}
export default MirePeConnectPage