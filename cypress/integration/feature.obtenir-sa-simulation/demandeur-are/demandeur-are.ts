const specTitleSimulationDeARE = require("cypress-sonarqube-reporter/specTitle");
import HomePage from '../../../integration-commun/pages/home.page';
import MonFuturContratTravailPage from '../../../integration-commun/pages/mon-futur-contrat-travail.page';
import MaSituationPage from '../../../integration-commun/pages/ma-situation.page'
import { NationalitesEnum } from '../../../../src/app/commun/enumerations/nationalites.enum'
import PersonnesAChargePage from '../../../integration-commun/pages/personnes-a-charge.page';
import RessourcesActuellesPage from '../../../integration-commun/pages/ressources-actuelles.page'
import ResultatMaSimulationPage from '../../../integration-commun/pages/resultat-ma-simulation.page'
import AvantDeCommencerPage from '../../../integration-commun/pages/avant-de-commencer.page'
import HeaderSection from '../../../integration-commun/sections/header.section'
import EstimeSessionService from '../../../integration-commun/utile/estime-session.service'
import { environment } from '../../../environment'
import { CodesAidesEnum } from "../../../../src/app/commun/enumerations/codes-aides.enum";

describe(specTitleSimulationDeARE('FEATURE - Obtenir ma simulation - Demandeurs d\'emploi ARE'), () => {


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
    'ARE : SJR : 48, jours restants : 15, Allocation journalière brute : 37' +
    'APL 310€', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/demandeur-are/complement-are-4-mois.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaire = "1000";
      const distanceDomicileLieuTravail = "8";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE MES RESSOURCES
      const salaireJournalierReference = "48";
      const nombreDeJoursRestants = "15";
      const allocationJournaliereBrute = "37";
      const montantAPL = "310";
      const montantLoyer = "500";
      const montantCharges = "30";
      const prochaineDeclarationTrimestrielle = "1";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantARECalculé = "1102";
      const montantComplementARE = "142";
      const montantComplementAREReduit = "106";
      const montantPrimeActivite_M5_M6 = "62";
      const montantALS_M2_M3_M4_M5_M6 = "271";

      const homePage = new HomePage();
      homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAssIdentifiant, environment.peConnectUserMotDePasse);

      const avantDeCommencerPage = new AvantDeCommencerPage();
      avantDeCommencerPage.clickOnJeCommence();

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaire);
      monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationARE();
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.saisirSalaireJournalierReference(salaireJournalierReference);
      ressourcesActuellesPage.saisirNombreJoursRestants(nombreDeJoursRestants);
      ressourcesActuellesPage.saisirAllocationJournaliereBruteAre(allocationJournaliereBrute);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.selectionnerLocataireNonMeuble();
      ressourcesActuellesPage.selectionnerAPL();
      ressourcesActuellesPage.saisirAPL(montantAPL);
      ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
      ressourcesActuellesPage.saisirMontantCharges(montantCharges);
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT, 1, montantAPL);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_RETOUR_EMPLOI, 1, montantARECalculé);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.COMPLEMENT_AIDE_RETOUR_EMPLOI, 2, montantComplementARE);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 2, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.COMPLEMENT_AIDE_RETOUR_EMPLOI, 3, montantComplementARE);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 3, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.COMPLEMENT_AIDE_RETOUR_EMPLOI, 4, montantComplementAREReduit);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 4, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 5, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActivite_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 6, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActivite_M5_M6);
      resultatMaSimulationPage.clickOnRetour();

      const headerSection = new HeaderSection();
      headerSection.clickOnSeDeconnecter();
    });

  it('demandeur célibataire, non propriétaire, sans enfant,' +
    'CDI 35h, salaire net 1000€,' +
    'domicile->travail 10kms / 20 trajets' +
    'ARE : SJR : 48, jours restants : 45, Allocation journalière brute : 37' +
    'APL 310€', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/demandeur-are/complement-are-6-mois.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaire = "1000";
      const distanceDomicileLieuTravail = "8";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE PERSONNES A CHARGE
      // VARIABLES PAGE MES RESSOURCES
      const salaireJournalierReference = "48";
      const nombreDeJoursRestants = "45";
      const allocationJournaliereBrute = "37";
      const montantAPL = "310";
      const montantLoyer = "500";
      const montantCharges = "30";
      const prochaineDeclarationTrimestrielle = "1";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantARECalculé = "1102";
      const montantComplementARE = "142";
      const montantPrimeActivite_M5_M6 = "62";
      const montantALS_M2_M3_M4_M5_M6 = "271";

      const homePage = new HomePage();
      homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAssIdentifiant, environment.peConnectUserMotDePasse);

      const avantDeCommencerPage = new AvantDeCommencerPage();
      avantDeCommencerPage.clickOnJeCommence();

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaire);
      monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationARE();
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.saisirSalaireJournalierReference(salaireJournalierReference);
      ressourcesActuellesPage.saisirNombreJoursRestants(nombreDeJoursRestants);
      ressourcesActuellesPage.saisirAllocationJournaliereBruteAre(allocationJournaliereBrute);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.selectionnerLocataireNonMeuble();
      ressourcesActuellesPage.selectionnerAPL();
      ressourcesActuellesPage.saisirAPL(montantAPL);
      ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
      ressourcesActuellesPage.saisirMontantCharges(montantCharges);
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_RETOUR_EMPLOI, 1, montantARECalculé);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT, 1, montantAPL);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.COMPLEMENT_AIDE_RETOUR_EMPLOI, 2, montantComplementARE);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 2, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.COMPLEMENT_AIDE_RETOUR_EMPLOI, 3, montantComplementARE);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 3, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.COMPLEMENT_AIDE_RETOUR_EMPLOI, 4, montantComplementARE);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 4, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.COMPLEMENT_AIDE_RETOUR_EMPLOI, 5, montantComplementARE);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 5, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActivite_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.COMPLEMENT_AIDE_RETOUR_EMPLOI, 6, montantComplementARE);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 6, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActivite_M5_M6);
      resultatMaSimulationPage.clickOnRetour();

      const headerSection = new HeaderSection();
      headerSection.clickOnSeDeconnecter();
    });

  it('demandeur célibataire, non propriétaire, sans enfant,' +
    'CDI 35h, salaire net 1200€,' +
    'domicile->travail 10kms / 20 trajets' +
    'ARE : SJR : 48, jours restants : 45, Allocation journalière brute : 37' +
    'APL 310€', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/demandeur-are/pas-de-complement-are.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaire = "1200";
      const distanceDomicileLieuTravail = "8";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE MES RESSOURCES
      const salaireJournalierReference = "48";
      const nombreDeJoursRestants = "15";
      const allocationJournaliereBrute = "37";
      const montantAPL = "310";
      const montantLoyer = "500";
      const montantCharges = "30";
      const prochaineDeclarationTrimestrielle = "1";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantARECalculé = "1102";
      const montantPrimeActivite_M5_M6 = "174";
      const montantALS_M2_M3_M4_M5_M6 = "271";

      const homePage = new HomePage();
      homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAssIdentifiant, environment.peConnectUserMotDePasse);

      const avantDeCommencerPage = new AvantDeCommencerPage();
      avantDeCommencerPage.clickOnJeCommence();

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaire);
      monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationARE();
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.saisirSalaireJournalierReference(salaireJournalierReference);
      ressourcesActuellesPage.saisirNombreJoursRestants(nombreDeJoursRestants);
      ressourcesActuellesPage.saisirAllocationJournaliereBruteAre(allocationJournaliereBrute);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.selectionnerLocataireNonMeuble();
      ressourcesActuellesPage.selectionnerAPL();
      ressourcesActuellesPage.saisirAPL(montantAPL);
      ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
      ressourcesActuellesPage.saisirMontantCharges(montantCharges);
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT, 1, montantAPL);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_RETOUR_EMPLOI, 1, montantARECalculé);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 2, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 3, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 4, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 5, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActivite_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 6, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActivite_M5_M6);
      resultatMaSimulationPage.clickOnRetour();

      const headerSection = new HeaderSection();
      headerSection.clickOnSeDeconnecter();
    });

  it('demandeur célibataire, non propriétaire, sans enfant,' +
    'CDI 35h, salaire net 1200€,' +
    'domicile->travail 10kms / 20 trajets' +
    'ARE : SJR : 140, jours restants : 45, Allocation journalière brute : 82, Degressivite ARE taux reduit' +
    'APL 310€', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/demandeur-are/pas-de-complement-are.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaire = "1200";
      const distanceDomicileLieuTravail = "8";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE MES RESSOURCES
      const salaireJournalierReference = "140";
      const nombreDeJoursRestants = "15";
      const allocationJournaliereBrute = "82";
      const montantAPL = "310";
      const montantLoyer = "500";
      const montantCharges = "30";
      const prochaineDeclarationTrimestrielle = "1";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantARECalculé = "1102";
      const montantPrimeActivite_M5_M6 = "174";
      const montantALS_M2_M3_M4_M5_M6 = "271";

      const homePage = new HomePage();
      homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAssIdentifiant, environment.peConnectUserMotDePasse);

      const avantDeCommencerPage = new AvantDeCommencerPage();
      avantDeCommencerPage.clickOnJeCommence();

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaire);
      monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationARE();
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.saisirSalaireJournalierReference(salaireJournalierReference);
      ressourcesActuellesPage.saisirNombreJoursRestants(nombreDeJoursRestants);
      ressourcesActuellesPage.clickOnDegressiviteAREOui();
      ressourcesActuellesPage.clickOnTauxReduitDegressiviteARE();
      ressourcesActuellesPage.saisirAllocationJournaliereBruteAre(allocationJournaliereBrute);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.selectionnerLocataireNonMeuble();
      ressourcesActuellesPage.selectionnerAPL();
      ressourcesActuellesPage.saisirAPL(montantAPL);
      ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
      ressourcesActuellesPage.saisirMontantCharges(montantCharges);
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT, 1, montantAPL);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_RETOUR_EMPLOI, 1, montantARECalculé);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 2, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 3, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 4, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 5, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActivite_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 6, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActivite_M5_M6);
      resultatMaSimulationPage.clickOnRetour();

      const headerSection = new HeaderSection();
      headerSection.clickOnSeDeconnecter();
    });

  it('demandeur célibataire, non propriétaire, sans enfant,' +
    'Pas d\'offre d\'emploi en vue, - temps plein SMIC' +
    'domicile->travail 10kms / 20 trajets' +
    'ARE : SJR : 48, jours restants : 45, Allocation journalière brute : 37, Degressivite ARE taux reduit' +
    'APL 310€', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/demandeur-are/pas-de-complement-are-offre-emploi-non-smic-35h.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const salaire = "1269"
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE MES RESSOURCES
      const salaireJournalierReference = "48";
      const nombreDeJoursRestants = "15";
      const allocationJournaliereBrute = "37";
      const montantAPL = "310";
      const montantLoyer = "500";
      const montantCharges = "30";
      const prochaineDeclarationTrimestrielle = "1";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantARECalculé = "1102";
      const montantPrimeActivite_M5_M6 = "170";
      const montantALS_M2_M3_M4_M5_M6 = "271";

      const homePage = new HomePage();
      homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAssIdentifiant, environment.peConnectUserMotDePasse);

      const avantDeCommencerPage = new AvantDeCommencerPage();
      avantDeCommencerPage.clickOnJeCommence();

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiNon();
      monFuturContratTravailPage.clickOnIsDureeHebdoTempsPlein();
      monFuturContratTravailPage.clickOnIsSalaireSouhaiteSMIC();
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationARE();
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.saisirSalaireJournalierReference(salaireJournalierReference);
      ressourcesActuellesPage.saisirNombreJoursRestants(nombreDeJoursRestants);
      ressourcesActuellesPage.saisirAllocationJournaliereBruteAre(allocationJournaliereBrute);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.selectionnerLocataireNonMeuble();
      ressourcesActuellesPage.selectionnerAPL();
      ressourcesActuellesPage.saisirAPL(montantAPL);
      ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
      ressourcesActuellesPage.saisirMontantCharges(montantCharges);
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT, 1, montantAPL);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_RETOUR_EMPLOI, 1, montantARECalculé);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 2, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 3, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 4, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 5, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActivite_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 6, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActivite_M5_M6);
      resultatMaSimulationPage.clickOnRetour();

      const headerSection = new HeaderSection();
      headerSection.clickOnSeDeconnecter();
    });


  it('demandeur célibataire, non propriétaire, sans enfant,' +
    'Pas d\'offre d\'emploi en vue, - temps plein SMIC' +
    'domicile->travail 10kms / 20 trajets' +
    'ARE : SJR : 48, jours restants : 45, Allocation journalière brute : 37, Degressivite ARE taux reduit' +
    'APL 310€' +
    'Modification de critères', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/demandeur-are/pas-de-complement-are-cdd-3-mois.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaire = "1500";
      const salaireMisAJour = "1269";
      const distanceDomicileLieuTravail = "8";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE MES RESSOURCES
      const salaireJournalierReference = "48";
      const nombreDeJoursRestants = "15";
      const allocationJournaliereBrute = "37";
      const montantAPL = "310";
      const montantLoyer = "500";
      const montantCharges = "30";
      const prochaineDeclarationTrimestrielle = "1";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantARECalculé = "1102";
      const montantPrimeActivite_M5_M6 = "170";
      const montantALS_M2_M3_M4_M5_M6 = "271";

      const homePage = new HomePage();
      homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAssIdentifiant, environment.peConnectUserMotDePasse);

      const avantDeCommencerPage = new AvantDeCommencerPage();
      avantDeCommencerPage.clickOnJeCommence();

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDD();
      monFuturContratTravailPage.selectNombreMoisCDD('3');
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaire);
      monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationARE();
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.saisirSalaireJournalierReference(salaireJournalierReference);
      ressourcesActuellesPage.saisirNombreJoursRestants(nombreDeJoursRestants);
      ressourcesActuellesPage.saisirAllocationJournaliereBruteAre(allocationJournaliereBrute);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.selectionnerLocataireNonMeuble();
      ressourcesActuellesPage.selectionnerAPL();
      ressourcesActuellesPage.saisirAPL(montantAPL);
      ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
      ressourcesActuellesPage.saisirMontantCharges(montantCharges);
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT, 1, montantAPL);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_RETOUR_EMPLOI, 1, montantARECalculé);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 2, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 3, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/demandeur-are/pas-de-complement-are-offre-emploi-non-smic-35h.json' })

      resultatMaSimulationPage.clickOnModificationCriteres();
      monFuturContratTravailPage.clickOnHasOffreEmploiNon();
      monFuturContratTravailPage.clickOnIsDureeHebdoTempsPlein();
      monFuturContratTravailPage.clickOnIsSalaireSouhaiteSMIC();
      resultatMaSimulationPage.clickOnMettreAJourSimulation();

      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaireMisAJour);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT, 1, montantAPL);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_RETOUR_EMPLOI, 1, montantARECalculé);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaireMisAJour);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 2, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaireMisAJour);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 3, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaireMisAJour);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 4, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaireMisAJour);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 5, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActivite_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaireMisAJour);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 6, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActivite_M5_M6);
      resultatMaSimulationPage.clickOnRetour();

      const headerSection = new HeaderSection();
      headerSection.clickOnSeDeconnecter();
    });
});



