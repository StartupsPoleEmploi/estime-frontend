class RessourcesActuellesPage {

  public saisirAllocationJournaliereNetASS(montant: string): void {
    cy.get('[data-testid=input-allocation-journaliere-net-ass]').type(montant);
  }

  public saisirMontantMensuelAAH(montant : string): void {
    cy.get('[data-testid=input-allocation-mensuelle-aah]').type(montant);
  }

  public saisirMontantMensuelRSA(montant : string): void {
    cy.get('[data-testid=input-allocation-mensuelle-net-rsa]').type(montant);
  }

  public selectOptionMoisProchaineDeclarationRSA(value: string): void {
    cy.get('[data-testid=select-prochaine-declaration-rsa]').select(value)
  }

  public saisirPensionInvalidite(montant : string): void {
    cy.get('[data-testid=input-pension-invalidite]').type(montant);
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

  public saisirAllocationSoutienFamilialeFoyer(montant: string): void {
    cy.get('[data-testid=input-asf]').type(montant);
  }

  public saisirDateDerniereOuvertureDroitASS(jour: string, mois: string, annee: string): void {
    cy.get('[data-testid=input-jour-date]').type(jour);
    cy.get('[data-testid=input-mois-date]').type(mois);
    cy.get('[data-testid=input-annee-date]').type(annee);
  }

  public clickOnAvezVousTravailleAuCoursDesDerniersMoisNon(): void {
    cy.get('[data-testid=btn-has-travaille-au-cours-derniers-mois-non]').click({force: true});
  }

  public clickOnAvezVousTravailleAuCoursDesDerniersMoisOui(): void {
    cy.get('[data-testid=btn-has-travaille-au-cours-derniers-mois-oui]').click({force: true});
  }

  public selectOptionNombreMoisTravaillesAvantSimulation(value: string): void {
    cy.get('[data-testid=select-nombre-mois-travailles-avant-simulation]').select(value)
  }

  public saisirSalaireConjoint(montantSalaire: string): void {
    cy.get('[data-testid=input-salaire-conjoint]').type(montantSalaire);
  }

  public saisirSalaireMoisMoins1AvantSimulation(montantSalaire: string): void {
    cy.get('[data-testid=input-salaire-mois-moins-1-avant-simulation]').type(montantSalaire);
  }

  public clickOnPasDeSalaireMoisMoins1AvantSimulation(): void {
    cy.get('[data-testid=checkbox-pas-de-salaire-mois-moins-1-avant-simulation]').click();
  }

  public saisirSalaireMoisMoins2AvantSimulation(montantSalaire: string): void {
    cy.get('[data-testid=input-salaire-mois-moins-2-avant-simulation]').type(montantSalaire);
  }

  public clickOnPasDeSalaireMoisMoins2AvantSimulation(): void {
    cy.get('[data-testid=checkbox-pas-de-salaire-mois-moins-2-avant-simulation]').click();
  }

  public saisirSalaireMoisMoins3AvantSimulation(montantSalaire: string): void {
    cy.get('[data-testid=input-salaire-mois-moins-3-avant-simulation]').type(montantSalaire);
  }

  public saisirPrestationAccueilJeuneEnfant(montantPAGE: string): void {
    cy.get('[data-testid=input-prestation-accueil-jeune-enfant]').type(montantPAGE);
  }

  public clickOnPasDeSalaireMoisMoins3AvantSimulation(): void {
    cy.get('[data-testid=checkbox-pas-de-salaire-mois-moins-3-avant-simulation]').click();
  }

  public clickOnValiderRessourcesConjoint(): void {
    cy.get('[data-testid=btn-ressources-conjoint-valider]').click();
  }

  public clickOnValiderRessourcesFoyer(): void {
    cy.get('[data-testid=btn-ressources-foyer-valider]').click();
  }

  public clickOnValiderVosRessources(): void {
    cy.get('[data-testid=btn-vos-ressources-valider]').click();
  }




  public clickOnObtenirMaSimulation(waitingTime: number) {
    cy.get('[data-testid=btn-obtenir-simulation]').click();
    //wait pour attendre le retour du service effectuant la simulation
    cy.wait(waitingTime);
  }
}
export default RessourcesActuellesPage