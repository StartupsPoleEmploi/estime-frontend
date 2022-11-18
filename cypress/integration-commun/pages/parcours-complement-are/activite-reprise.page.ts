class ActiviteReprisePage {

  public selectSalaireMensuelNet(): void {
    cy.get('[data-testid=select-type-salaire]').select('mensuel_net');
  }

  public saisirSalaireMensuelNet(salaire: string): void {
    cy.get('[data-testid=input-salaire-mensuel-net]').clear();
    cy.get('[data-testid=input-salaire-mensuel-net]').type(salaire);
  }

  public saisirSalaireMensuelBrut(salaire: string): void {
    cy.get('[data-testid=input-salaire-mensuel-brut]').clear();
    cy.get('[data-testid=input-salaire-mensuel-brut]').type(salaire);
  }

  public clickOnObtenirMaSimulation(): void {
    cy.get("[data-testid=btn-obtenir-simulation-parcours-complement-are]").click();
  }
}
export default ActiviteReprisePage