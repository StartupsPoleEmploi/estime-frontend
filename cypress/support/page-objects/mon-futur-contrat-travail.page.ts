import MirePeConnectPage from './mire-pe-connect.page'

class MonFuturContratTravailPage {

  public clickOnTypeContratCDI(): void {
    cy.get('[data-testid=btn-type-contrat-cdi]').click({force: true});
  }

  public clickOnTypeContratCDD(): void {
    cy.get('[data-testid=btn-type-contrat-cdd]').click({force: true});
  }

  public saisirDureeHebdomadaire(dureeHebdomadaire: string): void {
    cy.get('[data-testid=input-duree-hebdomadaire]').type(dureeHebdomadaire);
  }

  public saisirSalaireMensuelNet(salaire: string): void {
    cy.get('[data-testid=input-salaire-mensuel-net]').type(salaire);
  }

  public saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail: string): void {
    cy.get('[data-testid=input-distance-domicile-lieu-travail]').type(distanceDomicileLieuTravail);
  }

  public saisirNombreTrajetsDomicileTravail(nombreTrajetsDomicileTravail: string): void {
    cy.get('[data-testid=input-nombre-trajets-domicile-travail]').type(nombreTrajetsDomicileTravail);
  }

  public clickOnSuivant(): void {
    cy.get('[data-testid=btn-futur-travail-suivant]').click();
    cy.wait(1000);
  }
}
export default MonFuturContratTravailPage