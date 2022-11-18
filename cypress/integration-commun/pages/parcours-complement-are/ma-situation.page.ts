class MaSituationPage {

  public clickOnDegressiviteAREOui(): void {
    cy.get('[data-testid=btn-has-degressivite-are-oui]').click();
  }

  public clickOnDegressiviteARENon(): void {
    cy.get('[data-testid=btn-has-degressivite-are-non]').click();
  }

  public clickOnTauxPleinDegressiviteARE(): void {
    cy.get('[data-testid=btn-taux-plein-degressivite-are]').click();
  }

  public clickOnTauxReduitDegressiviteARE(): void {
    cy.get('[data-testid=btn-taux-reduit-degressivite-are]').click();
  }

  public saisirSalaireJournalierReference(montant: string): void {
    cy.get('[data-testid=input-salaire-journalier-reference-are]').clear();
    cy.get('[data-testid=input-salaire-journalier-reference-are]').type(montant);
  }

  public saisirAllocationJournaliereBruteTauxPleinAre(montant: string): void {
    cy.get('[data-testid=input-montant-allocation-journaliere-brut-taux-plein-are]').clear();
    cy.get('[data-testid=input-montant-allocation-journaliere-brut-taux-plein-are]').type(montant);
  }

  public saisirAllocationJournaliereBruteAre(montant: string): void {
    cy.get('[data-testid=input-montant-allocation-journaliere-brut-are]').clear();
    cy.get('[data-testid=input-montant-allocation-journaliere-brut-are]').type(montant);
  }

  public clickOnSuivant(): void {
    cy.get('[data-testid=btn-ma-situation-suivant]').click();
  }
}
export default MaSituationPage