class ResultatMaSimulationPage {

  public checkMontantComplementARE(montantToCheck: string): void {
    cy.get(`[data-testid=montant_complement_are]`).scrollIntoView().contains(montantToCheck + ' € brut');
  }

  public checkMontantCSG(csg: string): void {
    cy.get(`[data-testid=montant_csg]`).scrollIntoView().contains(csg);
  }

  public checkMontantCRC(crc: string): void {
    cy.get(`[data-testid=montant_crc]`).scrollIntoView().contains(crc);
  }

  public checkMontantCRDS(crds: string): void {
    cy.get(`[data-testid=montant_crds]`).scrollIntoView().contains(crds);
  }

  public checkCritereDegressiviteARE(degressivite: string): void {
    cy.get(`[data-testid=critere_degressivite]`).scrollIntoView().contains(`Dégressivité : ${degressivite}`);
  }

  public checkCritereSJR(sjr: string): void {
    cy.get(`[data-testid=critere_sjr]`).scrollIntoView().contains(`Salaire journalier de référence : ${sjr}€`);
  }

  public checkCritereAllocationJournaliere(allocationJournaliere: string): void {
    cy.get(`[data-testid=critere_allocation_journaliere]`).scrollIntoView().contains(`Allocation journalière : ${allocationJournaliere}€`);
  }

  public checkCritereFuturSalaire(futurSalaire: string): void {
    cy.get(`[data-testid=critere_futur_salaire]`).scrollIntoView().contains(`Salaire de l'activité reprise : ${futurSalaire}€`);
  }

  public checkNonEligibleComplementARE(): void {
    cy.get(`[data-testid=non-eligible-complement-are]`).scrollIntoView().contains("Selon les critères de votre simulation, vous n'êtes pas éligible au complément ARE.");
  }

  public clickOnModificationCriteres(): void {
    cy.get('[data-testid=btn-modification-criteres]').click();
  }

  public clickOnMettreAJourSimulation(): void {
    cy.get('[data-testid=btn-mettre-a-jour-simulation]').click();
  }
}
export default ResultatMaSimulationPage