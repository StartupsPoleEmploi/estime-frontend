class MireConsentementCookiesPage {

  clickToutAccepter() {
    cy.wait(3000);
    cy.get('[id=footer_tc_privacy_button_2]').click();
  }
}
export default MireConsentementCookiesPage