class PersonnesAChargePage {

  public clickOnSuivant(): void {
    cy.get('[data-testid=btn-personnes-charge-suivant]').click();
  }

  public clickOnValider(): void {
    cy.get('[data-testid=btn-valider-personne-charge]').click();
  }

  clickOnAjouterUnePersonneACharge(): void {
    cy.get('[data-testid=btn-ajouter-personne-charge]').click();
  }

  public saisirDateNaissance(jour: string, mois: string, annee: string): void {
    cy.get('[data-testid=input-jour-date]').type(jour);
    cy.get('[data-testid=input-mois-date]').type(mois);
    cy.get('[data-testid=input-annee-date]').type(annee);
  }
}
export default PersonnesAChargePage