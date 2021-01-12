import MirePeConnectPage from './mire-pe-connect.page'


class ResultatMaSimulationPage {

  //TODO JLA : somme variable à voir comment faire oour tester le montant réel
  public checkMontantRevenusEtAidesActuelles(): void {
    cy.get('[data-testid=span-revenus-aides-actuelles]').should('not.be.empty');
  }

  public checkMontantRessourceFinanciere(codeRessource: string, montantToCheck: string): void {
    cy.get(`[ng-reflect-code-ressource=${codeRessource}]`).children('[data-testid=row-montant-ressource]').children('[data-testid=col-montant-ressource]').children('[data-testid=div-span-montant-ressource]').children('[data-testid=span-montant-ressource]').contains(montantToCheck + ' €');
  }

  //TODO JLA : somme variable à voir comment faire oour tester le montant réel
  public checkMontantRessourceFinanciereNotEmpty(codeRessource: string): void {
    cy.get(`[ng-reflect-code-ressource=${codeRessource}]`).children('[data-testid=row-montant-ressource]').children('[data-testid=col-montant-ressource]').children('[data-testid=div-span-montant-ressource]').children('[data-testid=span-montant-ressource]').should('not.be.empty');
  }

  public clickOnMois(indexMois: number): void {
    cy.get('[data-testid=card-simulation-mensuel]').eq(indexMois).click();
  }
}
export default ResultatMaSimulationPage