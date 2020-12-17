class PersonnesAChargePage {

  public clickOnSuivant(): void {
    cy.get('[data-testid=btn-personnes-charge-suivant]').click();
    cy.wait(1000);
  }

  public clickOnValider(): void {
    cy.get('[data-testid=btn-valider-personne-charge]').click();
    cy.wait(1000);
  }

  clickOnAjouterUnePersonneACharge(): void {
    cy.get('[data-testid=btn-ajouter-personne-charge]').click();
  }

  public saisirDateNaissance(jour: string, mois: string, annee: string): void {
    cy.get('[data-testid=input-jour-date-naissance]').type(jour);
    cy.get('[data-testid=input-mois-date-naissance]').type(mois);
    cy.get('[data-testid=input-annee-date-naissance]').type(annee);
  }
}
export default PersonnesAChargePage