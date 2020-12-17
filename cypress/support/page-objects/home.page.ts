import MirePeConnectPage from './mire-pe-connect.page'


class HomePage {

  clickOnSeConnecterAvecPoleEmploi(nomUtilisateur: string, motDePasse: string) {
    cy.get('[data-testid=btn-pe-connect]').click();;

    cy.wait(3000);

    const mirePeConnectPage = new MirePeConnectPage();
    mirePeConnectPage.saisirNomUtilisateur(nomUtilisateur);
    mirePeConnectPage.clickOnPoursuivre();
    mirePeConnectPage.saisirMotDePasse(motDePasse);
    mirePeConnectPage.clickOnSeConnecter();
  }
}
export default HomePage