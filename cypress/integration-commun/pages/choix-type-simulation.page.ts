import MirePeConnectPage from './mire-pe-connect.page'

class ChoixTypeSimulationPage {

    clickOnJeCommenceSimulationComplete() {
        cy.get('[data-testid=btn-effectuer-simulation-complete]').click();
    }

    clickOnJeCommenceSimulationRapide() {
        cy.get('[data-testid=btn-effectuer-simulation-rapide]').click();
        //wait chargement page car appel d'un service backend pour récupérer des données
        cy.wait(2000);
    }

    clickOnSeConnecterAvecPoleEmploi(nomUtilisateur: string, motDePasse: string) {
        cy.get('[data-testid=btn-se-connecter]').click();

        //wait pour affichage mire PE Connect
        cy.wait(3000);

        const mirePeConnectPage = new MirePeConnectPage();
        mirePeConnectPage.saisirNomUtilisateur(nomUtilisateur);
        mirePeConnectPage.clickOnPoursuivre();
        mirePeConnectPage.saisirMotDePasse(motDePasse);
        mirePeConnectPage.clickOnSeConnecter();
    }

    clickOnCommencerSansSeConnecter() {
        cy.get('[data-testid=btn-commencer-sans-connexion]').click();
    }
}
export default ChoixTypeSimulationPage