import MirePeConnectPage from './mire-pe-connect.page'


class ResultatMaSimulationPage {

  //TODO JLA : somme variable à voir comment faire oour tester le montant réel
  public checkMontantRevenusEtAidesActuelles(): void {
    cy.get('[data-testid=span-revenus-aides-actuelles]').should('not.be.empty');
  }

  public checkMontantSalaire(montantToCheck: string) {
    cy.get('[codeRessource=PAIE]').children('[data-testid=row-montant-ressource]').children('[data-testid=col-montant-ressource]').children('[data-testid=span-montant-ressource]').contains(montantToCheck + ' €');
  }

  //TODO JLA : somme variable à voir comment faire oour tester le montant réel
  public checkMontantASS(): void {
    cy.get('[codeRessource=ASS]').children('[data-testid=row-montant-ressource]').children('[data-testid=col-montant-ressource]').children('[data-testid=span-montant-ressource]').should('not.be.empty');
  }

  public checkMontantAideMobilite(montantToCheck: string): void {
    cy.get('[ng-reflect-code-ressource=AM]').children('[data-testid=row-montant-ressource]').children('[data-testid=col-montant-ressource]').children('[data-testid=span-montant-ressource]').contains(montantToCheck + ' €');
  }

  public checkMontantAGEPI(montantToCheck: string): void {
    cy.get('[ng-reflect-code-ressource=AGEPI]').children('[data-testid=row-montant-ressource]').children('[data-testid=col-montant-ressource]').children('[data-testid=span-montant-ressource]').contains(montantToCheck + ' €');
  }

  public checkMontantPrimeActivite(montantToCheck: string): void {
    cy.get('[ng-reflect-code-ressource=PA]').children('[data-testid=row-montant-ressource]').children('[data-testid=col-montant-ressource]').children('[data-testid=span-montant-ressource]').contains(montantToCheck + ' €');
  }

  public clickOnMois(indexMois: number): void {
    cy.get('[data-testid=card-simulation-mensuel]').eq(indexMois).click();
  }

}
export default ResultatMaSimulationPage