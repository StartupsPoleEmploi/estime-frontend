class ResultatMaSimulationPage {

  //TODO JLA : somme variable à voir comment faire oour tester le montant réel
  public checkMontantRevenusEtAidesActuelles(): void {
    cy.get('[data-testid=montant_ressources_actuelles]').scrollIntoView().should('not.be.empty');
  }

  public checkMontantRessourceFinanciere(codeRessource: string, indexMois: number, montantToCheck: string): void {
    cy.get(`[data-testid=aide_${codeRessource}_mois_${indexMois}]`).scrollIntoView().contains(montantToCheck + ' €');
  }

  //TODO JLA : somme variable à voir comment faire oour tester le montant réel
  public checkMontantRessourceFinanciereNotEmpty(codeRessource: string, indexMois: number): void {
    cy.get(`[data-testid=aide_${codeRessource}_mois_${indexMois}]`).scrollIntoView().should('not.be.empty');
  }

  public clickOnMois(indexMois: number): void {
    cy.get(`[data-testid=detail_mois_${indexMois}]`).click();
  }

  public clickOnRetour(): void {
    cy.get('[data-testid=bouton_retour_detail_mois]').click();
  }
}
export default ResultatMaSimulationPage