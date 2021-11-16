class RessourcesActuellesPage {

  public saisirAllocationJournaliereNetASS(montant: string): void {
    cy.get('[data-testid=input-allocation-journaliere-net-ass]').type(montant);
  }

  public saisirMontantMensuelAAH(montant: string): void {
    cy.get('[data-testid=input-allocation-mensuelle-aah]').type(montant);
  }

  public saisirMontantMensuelRSA(montant: string): void {
    cy.get('[data-testid=input-allocation-mensuelle-net-rsa]').type(montant);
  }

  public selectOptionMoisProchaineDeclarationTrimestrielle(value: string): void {
    cy.get('[data-testid=select-prochaine-declaration-trimestrielle]').select(value)
  }

  public saisirMontantMensuelRSAFoyer(montant: string): void {
    cy.get('[data-testid=input-allocation-mensuelle-net-rsa-foyer]').type(montant);
  }

  public selectOptionMoisProchaineDeclarationTrimestrielleFoyer(value: string): void {
    cy.get('[data-testid=select-prochaine-declaration-rsa-foyer]').select(value)
  }

  public saisirPensionInvalidite(montant: string): void {
    cy.get('[data-testid=input-pension-invalidite]').type(montant);
  }

  public selectionnerLocataireNonMeuble(): void {
    cy.get('[data-testid=btn-situation-locataire-non-meuble]').click();
  }

  public selectionnerLocataireMeuble(): void {
    cy.get('[data-testid=btn-situation-locataire-meuble]').click();
  }

  public selectionnerLocataireHLM(): void {
    cy.get('[data-testid=btn-situation-locataire-hlm]').click();
  }

  public selectionnerLogeGratuitement(): void {
    cy.get('[data-testid=btn-situation-loge-gratuitement]').click();
  }

  public selectionnerProprietaire(): void {
    cy.get('[data-testid=btn-situation-proprietaire]').click();
  }

  public selectionnerProprietaireAvecEmprunt(): void {
    cy.get('[data-testid=btn-situation-proprietaire-avec-emprunt]').click();
  }

  public selectionnerIsCrous(): void {
    cy.get('[data-testid=btn-situation-logement-crous]').click();
  }

  public selectionnerIsConventionne(): void {
    cy.get('[data-testid=btn-situation-logement-conventionne]').click();
  }

  public selectionnerisColloc(): void {
    cy.get('[data-testid=btn-situation-colloc]').click();
  }

  public selectionnerIsChambre(): void {
    cy.get('[data-testid=btn-situation-chambre]').click();
  }

  public selectionnerAucunCas(): void {
    cy.get('[data-testid=btn-situation-aucun-cas]').click();
  }

  public selectionnerAPL(): void {
    cy.get('[data-testid=btn-beneficiaire-apl]').click();
  }

  public selectionnerALF(): void {
    cy.get('[data-testid=btn-beneficiaire-alf]').click();
  }

  public selectionnerALS(): void {
    cy.get('[data-testid=btn-beneficiaire-als]').click();
  }

  public saisirAPL(montant: string): void {
    this.saisirAPLFoyerMoisMoins1(montant);
    this.saisirAPLFoyerMoisMoins2(montant);
    this.saisirAPLFoyerMoisMoins3(montant);
  }

  public saisirAPLFoyerMoisMoins1(montant: string): void {
    cy.get('[data-testid=input-apl-mois-moins-1]').type(montant);
  }

  public saisirAPLFoyerMoisMoins2(montant: string): void {
    cy.get('[data-testid=input-apl-mois-moins-2]').type(montant);
  }

  public saisirAPLFoyerMoisMoins3(montant: string): void {
    cy.get('[data-testid=input-apl-mois-moins-3]').type(montant);
  }

  public saisirALF(montant: string): void {
    this.saisirALFFoyerMoisMoins1(montant);
    this.saisirALFFoyerMoisMoins2(montant);
    this.saisirALFFoyerMoisMoins3(montant);
  }

  public saisirALFFoyerMoisMoins1(montant: string): void {
    cy.get('[data-testid=input-alf-mois-moins-1]').type(montant);
  }

  public saisirALFFoyerMoisMoins2(montant: string): void {
    cy.get('[data-testid=input-alf-mois-moins-2]').type(montant);
  }

  public saisirALFFoyerMoisMoins3(montant: string): void {
    cy.get('[data-testid=input-alf-mois-moins-3]').type(montant);
  }

  public saisirALS(montant: string): void {
    this.saisirALSFoyerMoisMoins1(montant);
    this.saisirALSFoyerMoisMoins2(montant);
    this.saisirALSFoyerMoisMoins3(montant);
  }

  public saisirALSFoyerMoisMoins1(montant: string): void {
    cy.get('[data-testid=input-als-mois-moins-1]').type(montant);
  }

  public saisirALSFoyerMoisMoins2(montant: string): void {
    cy.get('[data-testid=input-als-mois-moins-2]').type(montant);
  }

  public saisirALSFoyerMoisMoins3(montant: string): void {
    cy.get('[data-testid=input-als-mois-moins-3]').type(montant);
  }


  public saisirMontantLoyer(montant: string): void {
    cy.get('[data-testid=input-montant-loyer]').type(montant);
  }

  public saisirMontantCharges(montant: string): void {
    cy.get('[data-testid=input-montant-charges]').type(montant);
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
    cy.get('[data-testid=btn-has-travaille-au-cours-derniers-mois-non]').click({ force: true });
  }

  public clickOnAvezVousTravailleAuCoursDesDerniersMoisOui(): void {
    cy.get('[data-testid=btn-has-travaille-au-cours-derniers-mois-oui]').click({ force: true });
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