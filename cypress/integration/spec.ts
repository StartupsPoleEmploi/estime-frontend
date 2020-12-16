const specTitle = require("cypress-sonarqube-reporter/specTitle");

describe(specTitle('US - accès au service Estime'), () => {


  beforeEach(() => {
    cy.visit('/');
  });

  it('En tant que demandeur d\'emploi, je souhaite me connecter au service Estime en utilisant mon compte Pôle emploi', () => {

    cy.get('button[type="button"]').click();

    cy.wait(3000);

    cy.get('input[id="identifiant"]').type("CaroASS");
    cy.get('button[id="submit"]').click();
    cy.wait(3000);
    cy.get('input[id="password"]').type("Muscoli.1");
    cy.get('button[id="submit"]').click();

    cy.contains('Avant de commencer');
  });
});




