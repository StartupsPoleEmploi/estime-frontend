const specTitleSimulationDeASS = require("cypress-sonarqube-reporter/specTitle");
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
import { CodesRessourcesFinancieresEnum } from "../../../../src/app/commun/enumerations/codes-ressources-financieres.enum";

describe(specTitleSimulationDeASS('FEATURE - Obtenir ma simulation - Demandeurs d\'emploi ASS'), () => {


  beforeEach(() => {
    cy.visit(environment.urlApplication);
  });

  afterEach(() => {
    const estimeSessionService = new EstimeSessionService();
    estimeSessionService.clearEstimeSession();
  });

  it('En tant que demandeur emploi célibataire, sans enfant, CDI 20h, salaire=1150 €, domicile->travail=35km / 20 trajets, ASS=16.49 €, je souhaite obtenir ma simulation', () => {

    const salaire = "1150";
    const primeActivite = "84";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserIdentifiant, environment.peConnectUserMotDePasse);

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
    ressourcesActuellesPage.clickOnAvezTavailleAuCoursDesDerniersMoisNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation();

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, "346");
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });

  it('En tant que demandeur emploi célibataire, sans enfant, CDI 20h, salaire=1150 €, domicile->travail=35km / 20 trajets, ASS=16.49 €, APL=120 €, je souhaite obtenir ma simulation', () => {

    const salaire = "1150";
    const primeActivite = "61";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserIdentifiant, environment.peConnectUserMotDePasse);

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
    ressourcesActuellesPage.clickOnAvezTavailleAuCoursDesDerniersMoisNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirAllocationLogementFoyer("120");
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation();

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE,"346");
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });

  it('En tant que demandeur emploi célibataire, 1 enfant de 9 ans, CDI 20h, salaire=1150 €, domicile->travail=35km / 20 trajets, ASS=16.49 €, APL=120 €, je souhaite obtenir ma simulation', () => {

    const salaire = "1150";
    const primeActivite = "105";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserIdentifiant, environment.peConnectUserMotDePasse);

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
    ressourcesActuellesPage.clickOnAvezTavailleAuCoursDesDerniersMoisNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirAllocationLogementFoyer("120");
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation();

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE,"346");
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI,"400");
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });

  it('En tant que demandeur emploi célibataire, 2 enfant de 9 ans et 12 ans, CDI 20h, salaire=1150€, domicile->travail=35km / 20 trajets, ASS=16.49€, APL=120€, AF=250€, je souhaite obtenir ma simulation', () => {

    const salaire = "1150";
    const primeActivite = "85";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserIdentifiant, environment.peConnectUserMotDePasse);

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
    ressourcesActuellesPage.clickOnAvezTavailleAuCoursDesDerniersMoisNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirAllocationLogementFoyer("120");
    ressourcesActuellesPage.saisirAllocationFamilialeFoyer("250");
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation();

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE,"346");
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI,"460");
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });
});










