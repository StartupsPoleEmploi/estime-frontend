describe('En tant qu\'utilisateur, lorsque j\'accède au service Estime sur https//estime.beta.pole-emploi.fr', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('alors la page d\'accueil s\'affiche.', () => {
    cy.contains('Estime calcule le montant de vos allocations et des aides auxquelles vous pourriez prétendre.');
  });
});
