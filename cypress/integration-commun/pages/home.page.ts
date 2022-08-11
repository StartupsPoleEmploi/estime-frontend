import MirePeConnectPage from './mire-pe-connect.page'

class HomePage {

  clickOnSeConnecterAvecPoleEmploi(nomUtilisateur: string, motDePasse: string) {
    cy.get('[data-testid=btn-je-commence]').click();
    cy.get('[data-testid=btn-se-connecter]').click();

    //wait pour affichage mise PE Connect
    cy.wait(3000);

    const mirePeConnectPage = new MirePeConnectPage();
    mirePeConnectPage.saisirNomUtilisateur(nomUtilisateur);
    mirePeConnectPage.clickOnPoursuivre();
    mirePeConnectPage.saisirMotDePasse(motDePasse);
    mirePeConnectPage.clickOnSeConnecter();
  }

  clickOnCommencerSansSeConnecter(nomUtilisateur: string, motDePasse: string) {
    cy.get('[data-testid=btn-je-commence]').click();
    cy.get('[data-testid=btn-commencer-sans-connexion]').click();

    //wait pour affichage mise PE Connect
    cy.wait(3000);

    const mirePeConnectPage = new MirePeConnectPage();
    mirePeConnectPage.saisirNomUtilisateur(nomUtilisateur);
    mirePeConnectPage.clickOnPoursuivre();
    mirePeConnectPage.saisirMotDePasse(motDePasse);
    mirePeConnectPage.clickOnSeConnecter();
  }
}
export default HomePage