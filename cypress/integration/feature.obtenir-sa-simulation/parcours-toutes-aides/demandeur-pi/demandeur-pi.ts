const specTitleSimulationDePI = require("cypress-sonarqube-reporter/specTitle");
import HomePage from '../../../../integration-commun/pages/home.page';
import MonFuturContratTravailPage from '../../../../integration-commun/pages/parcours-toutes-aides/mon-futur-contrat-travail.page';
import MaSituationPage from '../../../../integration-commun/pages/parcours-toutes-aides/ma-situation.page'
import { NationalitesEnum } from '../../../../../src/app/commun/enumerations/nationalites.enum'
import PersonnesAChargePage from '../../../../integration-commun/pages/parcours-toutes-aides/personnes-a-charge.page';
import RessourcesActuellesPage from '../../../../integration-commun/pages/parcours-toutes-aides/ressources-actuelles.page'
import ResultatMaSimulationPage from '../../../../integration-commun/pages/parcours-toutes-aides/resultat-ma-simulation.page'
import AvantDeCommencerPage from '../../../../integration-commun/pages/avant-de-commencer.page'
import EstimeSessionService from '../../../../integration-commun/utile/estime-session.service'
import { environment } from '../../../../environment'
import { CodesAidesEnum } from "../../../../../src/app/commun/enumerations/codes-aides.enum";

describe(specTitleSimulationDePI('FEATURE - Obtenir ma simulation - Demandeurs d\'emploi pension d\'invalidité'), () => {


  beforeEach(() => {
    cy.visit(environment.urlApplication);
  });

  afterEach(() => {
    const estimeSessionService = new EstimeSessionService();
    estimeSessionService.clearEstimeSession();
  });

  it('demandeur célibataire, non propriétaire, sans enfant,' +
    'CDI 35h, salaire net 1000€,' +
    'domicile->travail 10kms / 20 trajets' +
    'PI : 800€' +
    'APL 310€', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/parcours-toutes-aides/demandeur-pi/pi-simple.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaire = "1000";
      const distanceDomicileLieuTravail = "8";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE MES RESSOURCES
      const montantPensionInvalidite = "800";
      const montantAPL = "310";
      const montantLoyer = "500";
      const prochaineDeclarationTrimestrielle = "1";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantALS_M2_M3_M4_M5_M6 = "272";

      const homePage = new HomePage();
      homePage.clickOnCommencerSansSeConnecter();

      const avantDeCommencerPage = new AvantDeCommencerPage();
      avantDeCommencerPage.clickOnJeCommenceSimulationComplete();

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
      monFuturContratTravailPage.selectSalaireMensuelNet();
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaire);
      monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.saisirCodePostal();
      maSituationPage.saisirDateNaissance();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationBeneficiaire(CodesAidesEnum.PENSION_INVALIDITE);
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.saisirPensionInvalidite(montantPensionInvalidite);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.selectionnerLocataireNonMeuble();
      ressourcesActuellesPage.selectionnerAPL();
      ressourcesActuellesPage.saisirAPL(montantAPL);
      ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT, 1, montantAPL);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PENSION_INVALIDITE, 1, montantPensionInvalidite);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 2, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PENSION_INVALIDITE, 2, montantPensionInvalidite);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 3, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PENSION_INVALIDITE, 3, montantPensionInvalidite);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 4, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PENSION_INVALIDITE, 4, montantPensionInvalidite);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 5, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PENSION_INVALIDITE, 5, montantPensionInvalidite);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 6, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PENSION_INVALIDITE, 6, montantPensionInvalidite);
      resultatMaSimulationPage.clickOnRetour();
    });
});



