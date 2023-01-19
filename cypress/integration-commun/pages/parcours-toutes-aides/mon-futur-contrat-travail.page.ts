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

  public selectSalaireMensuelNet(): void {
    cy.get('[data-testid=select-type-salaire]').select('mensuel_net');
  }

  public saisirSalaireMensuelNet(salaire: string): void {
    cy.get('[data-testid=input-salaire-mensuel-net]').type(salaire);
  }

  public saisirSalaireMensuelBrut(salaire: string): void {
    cy.get('[data-testid=input-salaire-mensuel-brut]').type(salaire);
  }

  public clickOnNombreTrajetsParSemaine(nombreTrajetsParSemaine: string): void {
    switch (nombreTrajetsParSemaine) {
      case '1':
        this.clickOnNombreTrajets1JourParSemaine();
        break
      case '2':
        this.clickOnNombreTrajets2JoursParSemaine();
        break
      case '3':
        this.clickOnNombreTrajets3JoursParSemaine();
        break
      case '4':
        this.clickOnNombreTrajets4JoursParSemaine();
        break
      case '5':
        this.clickOnNombreTrajets5JoursParSemaine();
        break
    }
  }

  private clickOnNombreTrajets1JourParSemaine(): void {
    cy.get('[data-testid=btn-nombres-trajets-1-jour-semaine]').click({ force: true });
  }
  private clickOnNombreTrajets2JoursParSemaine(): void {
    cy.get('[data-testid=btn-nombres-trajets-2-jours-semaine]').click({ force: true });
  }
  private clickOnNombreTrajets3JoursParSemaine(): void {
    cy.get('[data-testid=btn-nombres-trajets-3-jours-semaine]').click({ force: true });
  }
  private clickOnNombreTrajets4JoursParSemaine(): void {
    cy.get('[data-testid=btn-nombres-trajets-4-jours-semaine]').click({ force: true });
  }
  private clickOnNombreTrajets5JoursParSemaine(): void {
    cy.get('[data-testid=btn-nombres-trajets-5-jours-semaine]').click({ force: true });
  }

  public saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail: string): void {
    cy.get('[data-testid=input-distance-domicile-lieu-travail]').type(distanceDomicileLieuTravail);
  }

  public clickDistanceDomicileTravailEntre0Et9(): void {
    cy.get('[data-testid=btn-distance-envisagee-0-9]').click({ force: true });
  }

  public clickDistanceDomicileTravailEntre10Et19(): void {
    cy.get('[data-testid=btn-distance-envisagee-10-19]').click({ force: true });
  }

  public clickDistanceDomicileTravailEntre20Et30(): void {
    cy.get('[data-testid=btn-distance-envisagee-20-30]').click({ force: true });
  }

  public clickDistanceDomicileTravailPlusDe30(): void {
    cy.get('[data-testid=btn-distance-envisagee-plus-de-30]').click({ force: true });
  }

  public clickOnSuivant(): void {
    cy.get('[data-testid=btn-futur-travail-suivant]').click();
  }
}
export default MonFuturContratTravailPage