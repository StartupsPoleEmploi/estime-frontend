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
    cy.get('[data-testid=btn-situation-aah]').click({ force: true });
  }

  public clickOnSituationARE() {
    cy.get('[data-testid=btn-situation-are]').click({ force: true });
  }

  public clickOnSituationASS() {
    cy.get('[data-testid=btn-situation-ass]').click({ force: true });
  }

  public clickOnSituationRSA() {
    cy.get('[data-testid=btn-situation-rsa]').click({ force: true });
  }

  public clickOnSituationSalarie() {
    cy.get('[data-testid=btn-situation-salarie]').click({ force: true });
  }

  public clickOnSituationPensionInvalidite() {
    cy.get('[data-testid=btn-situation-pension-invalidite]').click({ force: true });
  }

  public clickOnSituationRevenuImmobilier() {
    cy.get('[data-testid=btn-situation-revenu-immobilier]').click({ force: true });
  }

  public clickOnSituationMicroEntreprise() {
    cy.get('[data-testid=btn-situation-micro-entrepreneur]').click({ force: true });
  }

  public clickOnSituationFamilialeSeul() {
    cy.get('[data-testid=btn-situation-familiale-seul]').click({ force: true });
  }

  public clickOnSituationFamilialeCouple() {
    cy.get('[data-testid=btn-situation-familiale-couple]').click({ force: true });
  }

  public clickOnSituationConjointSalarie() {
    cy.get('[data-testid=btn-situation-conjoint-salarie]').click({ force: true });
  }

  public clickOnSituationConjointARE() {
    cy.get('[data-testid=btn-situation-conjoint-are]').click({ force: true });
  }

  public clickOnSituationConjointASS() {
    cy.get('[data-testid=btn-situation-conjoint-ass]').click({ force: true });
  }

  public clickOnSituationConjointRSA() {
    cy.get('[data-testid=btn-situation-conjoint-rsa]').click({ force: true });
  }

  public clickOnSituationConjointAAH() {
    cy.get('[data-testid=btn-situation-conjoint-aah]').click({ force: true });
  }

  public clickOnSituationConjointPensionInvalidite() {
    cy.get('[data-testid=btn-situation-conjoint-pension-invalidite]').click({ force: true });
  }

  public clickOnSituationConjointAucuneRessource() {
    cy.get('[data-testid=btn-situation-conjoint-sans-ressource]').click({ force: true });
  }

  public clickOnVousVivezSeulDepuisPlusDe18MoisOui(): void {
    cy.get('[data-testid=btn-is-seul-plus-de-18-mois-oui]').click({ force: true });
  }

  public clickOnVousVivezSeulDepuisPlusDe18MoisNon(): void {
    cy.get('[data-testid=btn-is-seul-plus-de-18-mois-non]').click({ force: true });
  }

  public clickOnSituationBeneficiaireACREOui() {
    cy.get('[data-testid=btn-is-beneficiaire-acre-oui]').click({ force: true });
  }

  public clickOnSituationBeneficiaireACRENon() {
    cy.get('[data-testid=btn-is-beneficiaire-acre-non]').click({ force: true });
  }

  public clickOnSituationCumulAncienEtNouveauSalaireOui() {
    cy.get('[data-testid=btn-has-cumul-ancien-et-nouveau-salaire-oui]').click({ force: true });
  }

  public clickOnSituationCumulAncienEtNouveauSalaireNon() {
    cy.get('[data-testid=btn-has-cumul-ancien-et-nouveau-salaire-non]').click({ force: true });
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