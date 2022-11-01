import { CodesAidesEnum } from "@app/commun/enumerations/codes-aides.enum";

class MaSituationPage {

  public saisirCodePostal() {
    cy.get('[data-testid=code-postal]').type('44000');

  }

  public saisirDateNaissance(jour: string = '01', mois: string = '01', annee: string = '1990'): void {
    cy.get('[data-testid=input-jour-date-naissance-demandeur]').type(jour);
    cy.get('[data-testid=input-mois-date-naissance-demandeur]').type(mois);
    cy.get('[data-testid=input-annee-date-naissance-demandeur]').type(annee);
  }

  public selectNationalite(nationalite: string) {
    cy.get('[data-testid=select-nationalite]').select(nationalite);
  }

  public clickOnSituationRevenuImmobilier() {
    cy.get('[data-testid=btn-situation-revenu-immobilier]').click();
  }

  public clickOnSituationMicroEntreprise() {
    cy.get('[data-testid=btn-situation-micro-entrepreneur]').click();
  }

  public clickOnSituationBeneficiaire(codeAide: CodesAidesEnum) {
    switch (codeAide) {
      case CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE:
        this.clickOnSituationASS();
        break;
      case CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES:
        this.clickOnSituationAAH();
        break;
      case CodesAidesEnum.RSA:
        this.clickOnSituationRSA();
        break;
      case CodesAidesEnum.AIDE_RETOUR_EMPLOI:
        this.clickOnSituationARE();
        break;
      case CodesAidesEnum.PENSION_INVALIDITE:
        this.clickOnSituationPensionInvalidite();
        break;
    }
  }

  public clickOnSituationAAH() {
    cy.get('[data-testid=btn-situation-aah]').click();
  }

  public clickOnSituationARE() {
    cy.get('[data-testid=btn-situation-are]').click();
  }

  public clickOnSituationASS() {
    cy.get('[data-testid=btn-situation-ass]').click();
  }

  public clickOnSituationRSA() {
    cy.get('[data-testid=btn-situation-rsa]').click();
  }

  public clickOnSituationPensionInvalidite() {
    cy.get('[data-testid=btn-situation-pension-invalidite]').click();
  }

  public clickOnSituationFamilialeSeul() {
    cy.get('[data-testid=btn-situation-familiale-seul]').click();
  }

  public clickOnSituationFamilialeCouple() {
    cy.get('[data-testid=btn-situation-familiale-couple]').click();
  }

  public clickOnSituationConjointSalarie() {
    cy.get('[data-testid=btn-situation-conjoint-salarie]').click();
  }

  public clickOnSituationConjointARE() {
    cy.get('[data-testid=btn-situation-conjoint-are]').click();
  }

  public clickOnSituationConjointASS() {
    cy.get('[data-testid=btn-situation-conjoint-ass]').click();
  }

  public clickOnSituationConjointRSA() {
    cy.get('[data-testid=btn-situation-conjoint-rsa]').click();
  }

  public clickOnSituationConjointAAH() {
    cy.get('[data-testid=btn-situation-conjoint-aah]').click();
  }

  public clickOnSituationConjointPensionInvalidite() {
    cy.get('[data-testid=btn-situation-conjoint-pension-invalidite]').click();
  }

  public clickOnSituationConjointAucuneRessource() {
    cy.get('[data-testid=btn-situation-conjoint-sans-ressource]').click();
  }

  public clickOnVousVivezSeulDepuisPlusDe18MoisOui(): void {
    cy.get('[data-testid=btn-is-seul-plus-de-18-mois-oui]').click({ force: true });
  }

  public clickOnVousVivezSeulDepuisPlusDe18MoisNon(): void {
    cy.get('[data-testid=btn-is-seul-plus-de-18-mois-non]').click({ force: true });
  }

  public clickOnSituationBeneficiaireACREOui() {
    cy.get('[data-testid=btn-is-beneficiaire-acre-oui]').click();
  }

  public clickOnSituationBeneficiaireACRENon() {
    cy.get('[data-testid=btn-is-beneficiaire-acre-non]').click();
  }

  public saisirDateCreationRepriseEntreprise(jour: string, mois: string, annee: string): void {
    cy.get('[data-testid=input-jour-date-reprise-creation-entreprise]').type(jour);
    cy.get('[data-testid=input-mois-date-reprise-creation-entreprise]').type(mois);
    cy.get('[data-testid=input-annee-date-reprise-creation-entreprise]').type(annee);
  }

  public clickOnSuivant() {
    cy.get('[data-testid=btn-ma-situation-suivant]').click();
  }
}
export default MaSituationPage