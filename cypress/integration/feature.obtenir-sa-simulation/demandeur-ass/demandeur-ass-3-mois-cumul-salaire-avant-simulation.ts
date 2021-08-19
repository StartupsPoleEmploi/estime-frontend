const specTitleSimulationDeASS = require("cypress-sonarqube-reporter/specTitle");
import { NationalitesEnum } from '../../../../src/app/commun/enumerations/nationalites.enum';
import { environment } from '../../../environment';
import AvantDeCommencerPage from '../../../integration-commun/pages/avant-de-commencer.page';
import HomePage from '../../../integration-commun/pages/home.page';
import MaSituationPage from '../../../integration-commun/pages/ma-situation.page';
import MonFuturContratTravailPage from '../../../integration-commun/pages/mon-futur-contrat-travail.page';
import PersonnesAChargePage from '../../../integration-commun/pages/personnes-a-charge.page';
import EstimeSessionService from '../../../integration-commun/utile/estime-session.service';
import { DateUtileTests } from "../../../integration-commun/utile/date-utile-tests.service";
import RessourcesActuellesPage from '../../../integration-commun/pages/ressources-actuelles.page';
import ResultatMaSimulationPage from '../../../integration-commun/pages/resultat-ma-simulation.page';
import { CodesRessourcesFinancieresEnum } from '@app/commun/enumerations/codes-ressources-financieres.enum';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import HeaderSection from '../../../integration-commun/sections/header.section';

describe(specTitleSimulationDeASS('FEATURE - Obtenir ma simulation - Demandeurs d\'emploi ASS avec des enfants'), () => {

  beforeEach(() => {
    cy.visit(environment.urlApplication);
  });

  afterEach(() => {
    const estimeSessionService = new EstimeSessionService();
    estimeSessionService.clearEstimeSession();
  });

  it('En tant que demandeur emploi célibataire,' +
     'enfant à charge de 9 ans, asf 117€,' +
     'montant net journalier ASS = 16,89€,' +
     'travaillé avant simulation : M0 850€, M-1 1000€, M-2 800€' +
     'futur contrat CDI, salaire 1245€ net, 20h/semaine,' +
     'kilométrage domicile -> taf = 80kms + 12 trajets', () => {

      // VARIABLES PAGE FUTUR CONTRAT
    const dureeHebdomadaire = "20";
    const salaireNet = "1245";
    const distanceDomicileLieuTravail = "80";
    const nombreTrajetsDomicileTravail = "12";
    // VARIABLES PAGE MA SITUATION
    const nationalite = NationalitesEnum.FRANCAISE;
    // VARIABLES PAGE PERSONNES A CHARGE
    const dateUtileTests = new DateUtileTests();
    const dateNaissancePersonne1 = dateUtileTests.getDateNaissanceFromAge(9);
    // VARIABLES PAGE MES RESSOURCES
    const allocationJournaliereNetASS = "16.49";
    const dateDerniereOuvertureDroitASS = {
      "jour":"16",
      "mois":"05",
      "annee":"2019"
    };
    const salaireMoisMoins1AvantSimulation = "850";
    const salaireMoisMoins2AvantSimulation = "1000";
    const salaireMoisMoins3AvantSimulation = "800";
    const allocationSoutienFamiliale = "117";
    // VARIABLES PAGE RESULTAT SIMULATION
    const montantAideMobilite = "450";
    const montantAgepi = "400";
    const montantPrimeActiviteM2_M3_M4 = "140";
    const montantPrimeActiviteM5_M6 = "421";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAssIdentifiant, environment.peConnectUserMotDePasse);

    const avantDeCommencerPage = new AvantDeCommencerPage();
    avantDeCommencerPage.clickOnJeCommence();

    const monFuturContratTravailPage = new MonFuturContratTravailPage();
    monFuturContratTravailPage.clickOnTypeContratCDI();
    monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
    monFuturContratTravailPage.saisirSalaireMensuelNet(salaireNet);
    monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
    monFuturContratTravailPage.saisirNombreTrajetsDomicileTravail(nombreTrajetsDomicileTravail);
    monFuturContratTravailPage.clickOnSuivant();

    const maSituationPage = new MaSituationPage();
    maSituationPage.selectNationalite(nationalite);
    maSituationPage.clickOnSituationFamilialeSeul();
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnAjouterUnePersonneACharge();
    personnesAChargePage.saisirDateNaissance(dateNaissancePersonne1.jour, dateNaissancePersonne1.mois, dateNaissancePersonne1.annee);
    personnesAChargePage.clickOnValider();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirAllocationJournaliereNetASS(allocationJournaliereNetASS);
    ressourcesActuellesPage.saisirDateDerniereOuvertureDroitASS(dateDerniereOuvertureDroitASS.jour, dateDerniereOuvertureDroitASS.mois, dateDerniereOuvertureDroitASS.annee);
    ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOui();
    ressourcesActuellesPage.saisirSalaireMoisMoins1AvantSimulation(salaireMoisMoins1AvantSimulation);
    ressourcesActuellesPage.saisirSalaireMoisMoins2AvantSimulation(salaireMoisMoins2AvantSimulation);
    ressourcesActuellesPage.saisirSalaireMoisMoins3AvantSimulation(salaireMoisMoins3AvantSimulation);
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirAllocationSoutienFamilialeFoyer(allocationSoutienFamiliale);
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation(3000);

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaireNet);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, montantAideMobilite);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI, montantAgepi);
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaireNet);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActiviteM2_M3_M4);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaireNet);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActiviteM2_M3_M4);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaireNet);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActiviteM2_M3_M4);
    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaireNet);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActiviteM5_M6);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaireNet);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActiviteM5_M6);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();

  });


});