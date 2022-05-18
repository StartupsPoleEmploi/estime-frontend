class MonFuturContratTravailPage {

  public clickOnHasOffreEmploiOui(): void {
    cy.get('[data-testid=btn-situation-offre-emploi-oui]').click({ force: true });
  }

  public clickOnHasOffreEmploiNon(): void {
    cy.get('[data-testid=btn-situation-offre-emploi-non]').click({ force: true });
  }

  public clickOnIsDureeHebdoTempsPlein(): void {
    cy.get('[data-testid=btn-situation-duree-hebdo-temps-plein]').click({ force: true });
  }

  public clickOnIsDureeHebdoMiTemps(): void {
    cy.get('[data-testid=btn-situation-duree-hebdo-mi-temps]').click({ force: true });
  }

  public clickOnIsDureeHebdoAutre(): void {
    cy.get('[data-testid=btn-situation-duree-hebdo-autre]').click({ force: true });
  }

  public clickOnIsSalaireSouhaiteSMIC(): void {
    cy.get('[data-testid=btn-situation-salaire-souhaite-smic]').click({ force: true });
  }

  public clickOnIsSalaireSouhaiteAutre(): void {
    cy.get('[data-testid=btn-situation-salaire-souhaite-autre]').click({ force: true });
  }

  public clickOnTypeContratCDI(): void {
    cy.get('[data-testid=btn-type-contrat-cdi]').click({ force: true });
  }

  public clickOnTypeContratCDD(): void {
    cy.get('[data-testid=btn-type-contrat-cdd]').click({ force: true });
  }

  public selectNombreMoisCDD(nombreMois: string): void {
    cy.get('[data-testid=select-nombre-mois-cdd]').select(nombreMois);
  }

  public saisirDureeHebdomadaire(dureeHebdomadaire: string): void {
    cy.get('[data-testid=input-duree-hebdomadaire]').type(dureeHebdomadaire);
  }

  public saisirSalaireMensuelNet(salaire: string): void {
    cy.get('[data-testid=input-salaire-mensuel-net]').type(salaire);
  }

  public saisirSalaireMensuelBrut(salaire: string): void {
    cy.get('[data-testid=input-salaire-mensuel-brut]').type(salaire);
  }

  public saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail: string): void {
    cy.get('[data-testid=input-distance-domicile-lieu-travail]').type(distanceDomicileLieuTravail);
  }

  public saisirNombreTrajetsDomicileTravail(nombreTrajetsDomicileTravail: string): void {
    cy.get('[data-testid=input-nombre-trajets-domicile-travail]').type(nombreTrajetsDomicileTravail);
  }

  public clickOnSuivant(): void {
    cy.get('[data-testid=btn-futur-travail-suivant]').click();
  }
}
export default MonFuturContratTravailPage