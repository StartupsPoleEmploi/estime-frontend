const specTitleSimulationRapide = require("cypress-sonarqube-reporter/specTitle");
import { environment } from '../../../environment';
import MaSituationPage from '../../../integration-commun/pages/parcours-complement-are/ma-situation.page';
import EstimeSessionService from '../../../integration-commun/utile/estime-session.service';
import ActiviteReprisePage from '../../../integration-commun/pages/parcours-complement-are/activite-reprise.page';
import ResultatMaSimulationPage from '../../../integration-commun/pages/parcours-complement-are/resultat-ma-simulation.page';
import ChoixTypeSimulationPage from '../../../integration-commun/pages/choix-type-simulation.page';

describe(specTitleSimulationRapide('FEATURE - Obtenir ma simulation parcours complément ARE - non éligible au complement ARE'), () => {

  beforeEach(() => {
    cy.visit(environment.urlApplication);

    const choixTypeSimulation = new ChoixTypeSimulationPage();
    choixTypeSimulation.clickOnJeCommenceSimulationRapide();
  });

  afterEach(() => {
    const estimeSessionService = new EstimeSessionService();
    estimeSessionService.clearEstimeSession();
  });


  it('En tant que demandeur emploi bénéficiaire de l\'ARE,' +
    'Dégressif :, ' +
    'taux réduit, ' +
    'SJR : 150€, ' +
    'AJ : 100€' +
    'futur contrat : 1000€ brut', () => {

      if (environment.enableParcoursComplementARE) {
        cy.intercept('POST', '**/simulation_complement_are', { fixture: 'mocks/parcours-complement-are/demandeur-non-eligible/non-eligible.json' })

        // VARIABLES PAGE MA SITUATION
        const degressivite = "non";
        const sjr = "50";
        const allocationJournaliere = "32";
        // VARIABLES PAGE ACTIVITE REPRISE
        const futurSalaireBrut = "1500";
        const futurSalaireNet = "1165";
        // VARIABLES PAGE RESULTAT SIMULATION
        const montantComplementARE = "2300";
        const montantCRC = "103,5";
        const montantCSG = "133,86";
        const montantCRDS = "10,81";


        const maSituationPage = new MaSituationPage();
        maSituationPage.clickOnDegressiviteARENon();
        maSituationPage.saisirSalaireJournalierReference(sjr);
        maSituationPage.saisirAllocationJournaliereBruteAre(allocationJournaliere);
        maSituationPage.clickOnSuivant();

        const activiteReprisePage = new ActiviteReprisePage();
        activiteReprisePage.saisirSalaireMensuelBrut(futurSalaireBrut);
        activiteReprisePage.clickOnObtenirMaSimulation();

        const resultatMaSimulationPage = new ResultatMaSimulationPage();
        resultatMaSimulationPage.checkNonEligibleComplementARE();

        cy.intercept('POST', '**/simulation_complement_are', { fixture: 'mocks/parcours-complement-are/demandeur-eligible-complement-are/non-degressif.json' })

        resultatMaSimulationPage.clickOnModificationCriteres();

        maSituationPage.saisirSalaireJournalierReference(sjr);
        maSituationPage.saisirAllocationJournaliereBruteAre(allocationJournaliere);
        activiteReprisePage.saisirSalaireMensuelBrut(futurSalaireBrut);
        resultatMaSimulationPage.clickOnMettreAJourSimulation();

        resultatMaSimulationPage.checkMontantComplementARE(montantComplementARE);
        resultatMaSimulationPage.checkMontantCRC(montantCRC);
        resultatMaSimulationPage.checkMontantCRDS(montantCRDS);
        resultatMaSimulationPage.checkMontantCSG(montantCSG);

        resultatMaSimulationPage.checkCritereDegressiviteARE(degressivite);
        resultatMaSimulationPage.checkCritereSJR(sjr);
        resultatMaSimulationPage.checkCritereAllocationJournaliere(allocationJournaliere);
        resultatMaSimulationPage.checkCritereFuturSalaire(futurSalaireNet);
      }
    });
});