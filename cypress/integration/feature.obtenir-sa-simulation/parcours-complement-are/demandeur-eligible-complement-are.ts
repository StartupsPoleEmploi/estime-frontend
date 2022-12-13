const specTitleSimulationRapide = require("cypress-sonarqube-reporter/specTitle");
import { environment } from '../../../environment';
import EstimeSessionService from '../../../integration-commun/utile/estime-session.service';
import ResultatMaSimulationPage from '../../../integration-commun/pages/parcours-complement-are/resultat-ma-simulation.page';
import MaSituationPage from '../../../integration-commun/pages/parcours-complement-are/ma-situation.page';
import ActiviteReprisePage from '../../../integration-commun/pages/parcours-complement-are/activite-reprise.page';
import ChoixTypeSimulationPage from '../../../integration-commun/pages/choix-type-simulation.page';

describe(specTitleSimulationRapide('FEATURE - Obtenir ma simulation parcours complément ARE - éligible au complement ARE'), () => {

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
    'Non dégressif :, ' +
    'SJR : 150€, ' +
    'AJ : 100€' +
    'futur contrat : 1000€ brut', () => {

      if (environment.enableParcoursComplementARE) {
        cy.intercept('POST', '**/simulation_complement_are', { fixture: 'mocks/parcours-complement-are/demandeur-eligible-complement-are/non-degressif.json' })

        // VARIABLES PAGE MA SITUATION
        const degressivite = "non";
        const sjr = "150";
        const allocationJournaliere = "100";
        // VARIABLES PAGE ACTIVITE REPRISE
        const futurSalaireBrut = "1000";
        const futurSalaireNet = "770";
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

  it('En tant que demandeur emploi bénéficiaire de l\'ARE,' +
    'Dégressif :, ' +
    'taux réduit, ' +
    'SJR : 150€, ' +
    'AJ : 100€' +
    'futur contrat : 1000€ brut', () => {

      if (environment.enableParcoursComplementARE) {
        cy.intercept('POST', '**/simulation_complement_are', { fixture: 'mocks/parcours-complement-are/demandeur-eligible-complement-are/degressif-taux-reduit.json' })

        // VARIABLES PAGE MA SITUATION
        const degressivite = "oui";
        const sjr = "150";
        const allocationJournaliereTauxPlein = "120";
        const allocationJournaliere = "100";
        // VARIABLES PAGE ACTIVITE REPRISE
        const futurSalaireBrut = "1000";
        const futurSalaireNet = "770";
        // VARIABLES PAGE RESULTAT SIMULATION
        const montantComplementARE = "2400";
        const montantCRC = "108";
        const montantCSG = "139,68";
        const montantCRDS = "11,28";


        const maSituationPage = new MaSituationPage();
        maSituationPage.clickOnDegressiviteAREOui();
        maSituationPage.clickOnTauxReduitDegressiviteARE();
        maSituationPage.saisirSalaireJournalierReference(sjr);
        maSituationPage.saisirAllocationJournaliereBruteTauxPleinAre(allocationJournaliereTauxPlein);
        maSituationPage.saisirAllocationJournaliereBruteAre(allocationJournaliere);
        maSituationPage.clickOnSuivant();

        const activiteReprisePage = new ActiviteReprisePage();
        activiteReprisePage.saisirSalaireMensuelBrut(futurSalaireBrut);
        activiteReprisePage.clickOnObtenirMaSimulation();

        const resultatMaSimulationPage = new ResultatMaSimulationPage();

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

  it('En tant que demandeur emploi bénéficiaire de l\'ARE,' +
    'Dégressif :, ' +
    'Taux plein, ' +
    'SJR : 150€, ' +
    'AJ : 100€' +
    'futur contrat : 1000€ net', () => {

      if (environment.enableParcoursComplementARE) {
        cy.intercept('POST', '**/simulation_complement_are', { fixture: 'mocks/parcours-complement-are/demandeur-eligible-complement-are/degressif-taux-plein.json' })

        // VARIABLES PAGE MA SITUATION
        const degressivite = "oui";
        const sjr = "150";
        const allocationJournaliere = "100";
        // VARIABLES PAGE ACTIVITE REPRISE
        const futurSalaireNet = "1000";
        // VARIABLES PAGE RESULTAT SIMULATION
        const montantComplementARE = "2100";
        const montantCRC = "94,5";
        const montantCSG = "122,22";
        const montantCRDS = "9,87";


        const maSituationPage = new MaSituationPage();
        maSituationPage.clickOnDegressiviteAREOui();
        maSituationPage.clickOnTauxPleinDegressiviteARE();
        maSituationPage.saisirSalaireJournalierReference(sjr);
        maSituationPage.saisirAllocationJournaliereBruteAre(allocationJournaliere);
        maSituationPage.clickOnSuivant();

        const activiteReprisePage = new ActiviteReprisePage();
        activiteReprisePage.selectSalaireMensuelNet();
        activiteReprisePage.saisirSalaireMensuelNet(futurSalaireNet);
        activiteReprisePage.clickOnObtenirMaSimulation();


        const resultatMaSimulationPage = new ResultatMaSimulationPage();

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