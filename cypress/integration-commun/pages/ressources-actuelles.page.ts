class RessourcesActuellesPage {

  public saisirAllocationJournaliereNetASS(montant: string): void {
    cy.get('[data-testid=input-allocation-journaliere-net-ass]').type(montant);
  }

  public saisirAAH(montant : string): void {
    cy.get('[data-testid=input-aah').type(montant);
  }

  public saisirPensionInvalidite(montant : string): void {
    cy.get('[data-testid=input-pension-invalidite').type(montant);
  }

  public saisirAllocationLogementFoyer(montant: string): void {
    this.saisirAllocationsLogementFoyerMoisMoins1(montant);
    this.saisirAllocationsLogementFoyerMoisMoins2(montant);
    this.saisirAllocationsLogementFoyerMoisMoins3(montant);
  }

  public saisirAllocationsLogementFoyerMoisMoins1(montant : string): void {
    cy.get('[data-testid=input-apl-mois-moins-1]').type(montant);
  }

  public saisirAllocationsLogementFoyerMoisMoins2(montant : string): void {
    cy.get('[data-testid=input-apl-mois-moins-2]').type(montant);
  }

  public saisirAllocationsLogementFoyerMoisMoins3(montant : string): void {
    cy.get('[data-testid=input-apl-mois-moins-3]').type(montant);
  }

  public saisirAllocationFamilialeFoyer(montant: string): void {
    cy.get('[data-testid=input-af]').type(montant);
  }

  public saisirDateDerniereOuvertureDroitASS(jour: string, mois: string, annee: string): void {
    cy.get('[data-testid=input-jour-date]').type(jour);
    cy.get('[data-testid=input-mois-date]').type(mois);
    cy.get('[data-testid=input-annee-date]').type(annee);
  }

  public clickOnAvezTavailleAuCoursDesDerniersMoisNon(): void {
    cy.get('[data-testid=btn-has-travaille-au-cours-derniers-mois-non]').click({force: true});
  }

  public clickOnValiderRessourcesFoyer(): void {
    cy.get('[data-testid=btn-ressources-foyer-valider]').click();
  }

  public clickOnValiderVosRessources(): void {
    cy.get('[data-testid=btn-vos-ressources-valider]').click();
  }

  public clickOnObtenirMaSimulation(): void {
    cy.get('[data-testid=btn-obtenir-simulation]').click();
    //wait pour attendre le retour du service effectuant la simulation
    cy.wait(3000);
  }
}
export default RessourcesActuellesPage