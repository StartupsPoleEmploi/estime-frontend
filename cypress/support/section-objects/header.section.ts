class HeaderSection {

  clickOnSeDeconnecter() {
    cy.get('[data-testid=btn-se-deconnecter]').click();
    cy.wait(3000);
  }
}
export default HeaderSection