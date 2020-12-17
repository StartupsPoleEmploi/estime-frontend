const specTitleSimulationDeASS = require("cypress-sonarqube-reporter/specTitle");
import HomePage from '../../../support/page-objects/home.page';
import MonFuturContratTravailPage from '../../../support/page-objects/mon-futur-contrat-travail.page';
import MaSituationPage from '../../../support/page-objects/ma-situation.page'
import { NationalitesEnum } from '../../../../src/app/commun/enumerations/nationalites.enum'
import PersonnesAChargePage from '../../../support/page-objects/personnes-a-charge.page';
import RessourcesActuellesPage from '../../../support/page-objects/ressources-actuelles.page'
import ResultatMaSimulationPage from '../../../support/page-objects/resultat-ma-simulation.page'
import AvantDeCommencerPage from '../../../support/page-objects/avant-de-commencer.page'
import HeaderSection from '../../../support/section-objects/header.section'

describe(specTitleSimulationDeASS('FEATURE - Obtenir ma simulation - Demandeurs d\'emploi ASS'), () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.window().then(window => window.sessionStorage.clear());
    cy.visit('http://localhost.estime:9001/');
  });

  afterEach(() => {
    let cookieValue: any = document.cookie.split('; ').find(row => row.startsWith('estime.peConnectIndividu')).split('=')[1];

    cookieValue = cookieValue.replaceAll('%7B', '{');
    cookieValue = cookieValue.replaceAll('%22', '"');
    cookieValue = cookieValue.replaceAll('%7D', '}');
    cookieValue = cookieValue.replaceAll('%3A', ':');
    cookieValue = cookieValue.replaceAll('%2C', ',');
    console.log(cookieValue);
    const individu = JSON.parse(cookieValue);
    console.log(individu);
  });


  it('En tant que demandeur emploi célibataire, sans enfant, CDI 20h, salaire=1150 €, domicile->travail=35km / 20 trajets, ASS=16.49 €, je souhaite obtenir ma simulation', () => {

    const salaire = "1150";
    const primeActivite = "61";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi('CaroASS', 'Muscoli.1');

    const avantDeCommencerPage = new AvantDeCommencerPage();
    avantDeCommencerPage.clickOnJeCommence();

    const monFuturContratTravailPage = new MonFuturContratTravailPage();
    monFuturContratTravailPage.clickOnTypeContratCDI();
    monFuturContratTravailPage.saisirDureeHebdomadaire("20");
    monFuturContratTravailPage.saisirSalaireMensuelNet(salaire);
    monFuturContratTravailPage.saisirDistanceDomicileLieuTravail("35");
    monFuturContratTravailPage.saisirNombreTrajetsDomicileTravail("20");
    monFuturContratTravailPage.clickOnSuivant();

    const maSituationPage = new MaSituationPage();
    maSituationPage.selectNationalite(NationalitesEnum.FRANCAISE);
    maSituationPage.clickOnSituationFamilialeSeul();
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirAllocationJournaliereNetASS("16,49");
    ressourcesActuellesPage.saisirDateDerniereOuvertureDroitASS("16", "05", "2019");
    ressourcesActuellesPage.clickOnCumuleAssEtSalaireNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation();

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantASS();
    resultatMaSimulationPage.checkMontantAideMobilite("346");
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantASS();
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantASS();
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantPrimeActivite(primeActivite);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantPrimeActivite(primeActivite);

    cy.wait(3000);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });

  it('En tant que demandeur emploi célibataire, sans enfant, CDI 20h, salaire=1150 €, domicile->travail=35km / 20 trajets, ASS=16.49 €, APL=120 €, je souhaite obtenir ma simulation', () => {

    const salaire = "1150";
    const primeActivite = "61";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi('CaroASS', 'Muscoli.1');

    const avantDeCommencerPage = new AvantDeCommencerPage();
    avantDeCommencerPage.clickOnJeCommence();

    const monFuturContratTravailPage = new MonFuturContratTravailPage();
    monFuturContratTravailPage.clickOnTypeContratCDI();
    monFuturContratTravailPage.saisirDureeHebdomadaire("20");
    monFuturContratTravailPage.saisirSalaireMensuelNet(salaire);
    monFuturContratTravailPage.saisirDistanceDomicileLieuTravail("35");
    monFuturContratTravailPage.saisirNombreTrajetsDomicileTravail("20");
    monFuturContratTravailPage.clickOnSuivant();

    const maSituationPage = new MaSituationPage();
    maSituationPage.selectNationalite(NationalitesEnum.FRANCAISE);
    maSituationPage.clickOnSituationFamilialeSeul();
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirAllocationJournaliereNetASS("16,49");
    ressourcesActuellesPage.saisirDateDerniereOuvertureDroitASS("16", "05", "2019");
    ressourcesActuellesPage.clickOnCumuleAssEtSalaireNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirAllocationLogementFoyer("120");
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation();

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantASS();
    resultatMaSimulationPage.checkMontantAideMobilite("346");
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantASS();
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantASS();
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantPrimeActivite(primeActivite);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantPrimeActivite(primeActivite);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });

  it('En tant que demandeur emploi célibataire, 1 enfant de 9 ans, CDI 20h, salaire=1150 €, domicile->travail=35km / 20 trajets, ASS=16.49 €, APL=120 €, je souhaite obtenir ma simulation', () => {

    const salaire = "1150";
    const primeActivite = "104";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi('CaroASS', 'Muscoli.1');

    const avantDeCommencerPage = new AvantDeCommencerPage();
    avantDeCommencerPage.clickOnJeCommence();

    const monFuturContratTravailPage = new MonFuturContratTravailPage();
    monFuturContratTravailPage.clickOnTypeContratCDI();
    monFuturContratTravailPage.saisirDureeHebdomadaire("20");
    monFuturContratTravailPage.saisirSalaireMensuelNet(salaire);
    monFuturContratTravailPage.saisirDistanceDomicileLieuTravail("35");
    monFuturContratTravailPage.saisirNombreTrajetsDomicileTravail("20");
    monFuturContratTravailPage.clickOnSuivant();

    const maSituationPage = new MaSituationPage();
    maSituationPage.selectNationalite(NationalitesEnum.FRANCAISE);
    maSituationPage.clickOnSituationFamilialeSeul();
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnAjouterUnePersonneACharge();
    personnesAChargePage.saisirDateNaissance("05", "08", "2011");
    personnesAChargePage.clickOnValider();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirAllocationJournaliereNetASS("16,49");
    ressourcesActuellesPage.saisirDateDerniereOuvertureDroitASS("16", "05", "2019");
    ressourcesActuellesPage.clickOnCumuleAssEtSalaireNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirAllocationLogementFoyer("120");
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation();

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantASS();
    resultatMaSimulationPage.checkMontantAideMobilite("346");
    resultatMaSimulationPage.checkMontantAGEPI("400");
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantASS();
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantASS();
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantPrimeActivite(primeActivite);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantPrimeActivite(primeActivite);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });

  it('En tant que demandeur emploi célibataire, 2 enfant de 9 ans et 12 ans, CDI 20h, salaire=1150€, domicile->travail=35km / 20 trajets, ASS=16.49€, APL=120€, AF=250€, je souhaite obtenir ma simulation', () => {

    const salaire = "1150";
    const primeActivite = "84";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi('CaroASS', 'Muscoli.1');

    const avantDeCommencerPage = new AvantDeCommencerPage();
    avantDeCommencerPage.clickOnJeCommence();

    const monFuturContratTravailPage = new MonFuturContratTravailPage();
    monFuturContratTravailPage.clickOnTypeContratCDI();
    monFuturContratTravailPage.saisirDureeHebdomadaire("20");
    monFuturContratTravailPage.saisirSalaireMensuelNet(salaire);
    monFuturContratTravailPage.saisirDistanceDomicileLieuTravail("35");
    monFuturContratTravailPage.saisirNombreTrajetsDomicileTravail("20");
    monFuturContratTravailPage.clickOnSuivant();

    const maSituationPage = new MaSituationPage();
    maSituationPage.selectNationalite(NationalitesEnum.FRANCAISE);
    maSituationPage.clickOnSituationFamilialeSeul();
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnAjouterUnePersonneACharge();
    personnesAChargePage.saisirDateNaissance("05", "08", "2011");
    personnesAChargePage.clickOnValider();
    personnesAChargePage.clickOnAjouterUnePersonneACharge();
    personnesAChargePage.saisirDateNaissance("05", "08", "2011");
    personnesAChargePage.clickOnValider();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirAllocationJournaliereNetASS("16,49");
    ressourcesActuellesPage.saisirDateDerniereOuvertureDroitASS("16", "05", "2019");
    ressourcesActuellesPage.clickOnCumuleAssEtSalaireNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirAllocationLogementFoyer("120");
    ressourcesActuellesPage.saisirAllocationFamilialeFoyer("250");
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation();

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantASS();
    resultatMaSimulationPage.checkMontantAideMobilite("346");
    resultatMaSimulationPage.checkMontantAGEPI("460");
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantASS();
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantASS();
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantPrimeActivite(primeActivite);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantSalaire(salaire);
    resultatMaSimulationPage.checkMontantPrimeActivite(primeActivite);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });
});










