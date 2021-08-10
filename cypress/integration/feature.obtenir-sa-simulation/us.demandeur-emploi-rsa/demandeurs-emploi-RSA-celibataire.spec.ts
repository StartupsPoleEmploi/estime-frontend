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

describe(specTitleSimulationDeASS('FEATURE - Obtenir ma simulation - Demandeurs d\'emploi RSA'), () => {


  beforeEach(() => {
    cy.visit(environment.urlApplication);
  });

  afterEach(() => {
    const estimeSessionService = new EstimeSessionService();
    estimeSessionService.clearEstimeSession();
  });

  it('En tant que demandeur emploi célibataire, sans enfant, CDI 20h, salaire=1150 €, domicile->travail=35km / 20 trajets, RSA=500 €, prochaine déclaration dans 3 mois, je souhaite obtenir ma simulation', () => {

    // VARIABLES PAGE FUTUR CONTRAT
    const dureeHebdomadaire = "20";
    const salaire = "1150";
    const distanceDomicileLieuTravail = "35";
    const nombreTrajetsDomicileTravail = "20";
    // VARIABLES PAGE MA SITUATION
    const nationalite = NationalitesEnum.FRANCAISE;
    // VARIABLES PAGE MES RESSOURCES
    const montantMensuelRSA = "500";
    const prochaineDeclarationRSA = "3";
    // VARIABLES PAGE RESULTAT SIMULATION
    const montantAideMobilite = "346";
    const primeActivite = "163";
    const primeActiviteB = "246";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserIdentifiant, environment.peConnectUserMotDePasse);

    const avantDeCommencerPage = new AvantDeCommencerPage();
    avantDeCommencerPage.clickOnJeCommence();

    const monFuturContratTravailPage = new MonFuturContratTravailPage();
    monFuturContratTravailPage.clickOnTypeContratCDI();
    monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
    monFuturContratTravailPage.saisirSalaireMensuelNet(salaire);
    monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
    monFuturContratTravailPage.saisirNombreTrajetsDomicileTravail(nombreTrajetsDomicileTravail);
    monFuturContratTravailPage.clickOnSuivant();

    const maSituationPage = new MaSituationPage();
    maSituationPage.selectNationalite(nationalite);
    maSituationPage.clickOnSituationRSA();
    // on décoche la situation ASS
    maSituationPage.clickOnSituationASS();
    maSituationPage.clickOnSituationFamilialeSeul();
    maSituationPage.clickOnVousVivezSeulNon();
    maSituationPage.clickOnVousEtesProprietaireNon();
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirMontantMensuelRSA(montantMensuelRSA);
    ressourcesActuellesPage.selectOptionMoisProchaineDeclarationRSA(prochaineDeclarationRSA);
    ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation(3000);

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.RSA);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, montantAideMobilite);
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.RSA);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);
    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActiviteB);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });

  it('En tant que demandeur emploi célibataire, sans enfant, CDI 20h, salaire=1150 €, domicile->travail=35km / 20 trajets, RSA=500 €, APL=120 €, je souhaite obtenir ma simulation', () => {

    // VARIABLES PAGE FUTUR CONTRAT
    const dureeHebdomadaire = "20";
    const salaire = "1150";
    const distanceDomicileLieuTravail = "35";
    const nombreTrajetsDomicileTravail = "20";
    // VARIABLES PAGE MA SITUATION
    const nationalite = NationalitesEnum.FRANCAISE;
    // VARIABLES PAGE MES RESSOURCES
    const montantMensuelRSA = "500";
    const prochaineDeclarationRSA = "3";
    const allocationLogementFoyer = "120";
    // VARIABLES PAGE RESULTAT SIMULATION
    const montantAideMobilite = "346";
    const primeActivite = "123";
    const primeActiviteB = "184";
    const rsa = "500"

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserIdentifiant, environment.peConnectUserMotDePasse);

    const avantDeCommencerPage = new AvantDeCommencerPage();
    avantDeCommencerPage.clickOnJeCommence();

    const monFuturContratTravailPage = new MonFuturContratTravailPage();
    monFuturContratTravailPage.clickOnTypeContratCDI();
    monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
    monFuturContratTravailPage.saisirSalaireMensuelNet(salaire);
    monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
    monFuturContratTravailPage.saisirNombreTrajetsDomicileTravail(nombreTrajetsDomicileTravail);
    monFuturContratTravailPage.clickOnSuivant();

    const maSituationPage = new MaSituationPage();
    maSituationPage.selectNationalite(nationalite);
    maSituationPage.clickOnSituationRSA();
    // on décoche la situation ASS
    maSituationPage.clickOnSituationASS();
    maSituationPage.clickOnSituationFamilialeSeul();
    maSituationPage.clickOnVousVivezSeulNon();
    maSituationPage.clickOnVousEtesProprietaireNon();
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirMontantMensuelRSA(montantMensuelRSA);
    ressourcesActuellesPage.selectOptionMoisProchaineDeclarationRSA(prochaineDeclarationRSA);
    ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirAllocationLogementFoyer(allocationLogementFoyer);
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation(3000);

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE,montantAideMobilite);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA,rsa);
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA,rsa);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);
    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActiviteB);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });

  it('En tant que demandeur emploi célibataire, 1 enfant de 9 ans, CDI 20h, salaire=1150 €, domicile->travail=35km / 20 trajets, RSA=500 €, APL=120 €, je souhaite obtenir ma simulation', () => {

    // VARIABLES PAGE FUTUR CONTRAT
    const dureeHebdomadaire = "20";
    const salaire = "1150";
    const distanceDomicileLieuTravail = "35";
    const nombreTrajetsDomicileTravail = "20";
    // VARIABLES PAGE PERSONNES A CHARGE
    const dateDeNaissancePersonne1 = {
      "jour":"01",
      "mois":"01",
      "annee":"2012"
    };
    // VARIABLES PAGE MA SITUATION
    const nationalite = NationalitesEnum.FRANCAISE;
    // VARIABLES PAGE MES RESSOURCES
    const montantMensuelRSA = "500";
    const prochaineDeclarationRSA = "3";
    const allocationLogementFoyer = "120";
    // VARIABLES PAGE RESULTAT SIMULATION
    const montantAideMobilite = "346";
    const montantAGEPI = "400";
    const primeActivite = "288";
    const primeActiviteB = "431";
    const rsa = "500";
    const rsaB = "15";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserIdentifiant, environment.peConnectUserMotDePasse);

    const avantDeCommencerPage = new AvantDeCommencerPage();
    avantDeCommencerPage.clickOnJeCommence();

    const monFuturContratTravailPage = new MonFuturContratTravailPage();
    monFuturContratTravailPage.clickOnTypeContratCDI();
    monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
    monFuturContratTravailPage.saisirSalaireMensuelNet(salaire);
    monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
    monFuturContratTravailPage.saisirNombreTrajetsDomicileTravail(nombreTrajetsDomicileTravail);
    monFuturContratTravailPage.clickOnSuivant();

    const maSituationPage = new MaSituationPage();
    maSituationPage.selectNationalite(nationalite);
    maSituationPage.clickOnSituationRSA();
    // on décoche la situation ASS
    maSituationPage.clickOnSituationASS();
    maSituationPage.clickOnSituationFamilialeSeul();
    maSituationPage.clickOnVousVivezSeulNon();
    maSituationPage.clickOnVousEtesProprietaireNon();
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnAjouterUnePersonneACharge();
    personnesAChargePage.saisirDateNaissance(dateDeNaissancePersonne1.jour, dateDeNaissancePersonne1.mois, dateDeNaissancePersonne1.annee);
    personnesAChargePage.clickOnValider();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirMontantMensuelRSA(montantMensuelRSA);
    ressourcesActuellesPage.selectOptionMoisProchaineDeclarationRSA(prochaineDeclarationRSA);
    ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirAllocationLogementFoyer(allocationLogementFoyer);
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation(3000);

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE,montantAideMobilite);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI,montantAGEPI);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.RSA);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA,rsa);
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.RSA);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA,rsa);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.RSA);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA,rsaB);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.RSA);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA,rsaB);
    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.RSA);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA,rsaB);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActiviteB);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });

  it('En tant que demandeur emploi célibataire, 2 enfant de 9 ans et 12 ans, CDI 20h, salaire=1150€, domicile->travail=35km / 20 trajets,  RSA=500 €, APL=120€, AF=250€, je souhaite obtenir ma simulation', () => {

    // VARIABLES PAGE FUTUR CONTRAT
    const dureeHebdomadaire = "20";
    const salaire = "1150";
    const distanceDomicileLieuTravail = "35";
    const nombreTrajetsDomicileTravail = "20";
    // VARIABLES PAGE MA SITUATION
    const nationalite = NationalitesEnum.FRANCAISE;
    // VARIABLES PAGE PERSONNES A CHARGE
    const dateDeNaissancePersonne1 = {
      "jour":"01",
      "mois":"01",
      "annee":"2012"
    };
    const dateDeNaissancePersonne2 = {
      "jour":"01",
      "mois":"01",
      "annee":"2009"
    };
    // VARIABLES PAGE MES RESSOURCES
    const montantMensuelRSA = "500";
    const prochaineDeclarationRSA = "3";
    const allocationLogementFoyer = "120";
    const allocationFamilialeFoyer = "250";
    // VARIABLES PAGE RESULTAT SIMULATION
    const montantAideMobilite = "346";
    const montantAGEPI = "400";
    const primeActivite = "295";
    const primeActiviteB = "442";
    const rsa = "500";
    const rsaB = "31";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserIdentifiant, environment.peConnectUserMotDePasse);

    const avantDeCommencerPage = new AvantDeCommencerPage();
    avantDeCommencerPage.clickOnJeCommence();

    const monFuturContratTravailPage = new MonFuturContratTravailPage();
    monFuturContratTravailPage.clickOnTypeContratCDI();
    monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
    monFuturContratTravailPage.saisirSalaireMensuelNet(salaire);
    monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
    monFuturContratTravailPage.saisirNombreTrajetsDomicileTravail(nombreTrajetsDomicileTravail);
    monFuturContratTravailPage.clickOnSuivant();

    const maSituationPage = new MaSituationPage();
    maSituationPage.selectNationalite(nationalite);
    maSituationPage.clickOnSituationRSA();
    // on décoche la situation ASS
    maSituationPage.clickOnSituationASS();
    maSituationPage.clickOnSituationFamilialeSeul();
    maSituationPage.clickOnVousVivezSeulNon();
    maSituationPage.clickOnVousEtesProprietaireNon();
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnAjouterUnePersonneACharge();
    personnesAChargePage.saisirDateNaissance(dateDeNaissancePersonne1.jour, dateDeNaissancePersonne1.mois, dateDeNaissancePersonne1.annee);
    personnesAChargePage.clickOnValider();
    personnesAChargePage.clickOnAjouterUnePersonneACharge();
    personnesAChargePage.saisirDateNaissance(dateDeNaissancePersonne2.jour, dateDeNaissancePersonne2.mois, dateDeNaissancePersonne2.annee);
    personnesAChargePage.clickOnValider();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirMontantMensuelRSA(montantMensuelRSA);
    ressourcesActuellesPage.selectOptionMoisProchaineDeclarationRSA(prochaineDeclarationRSA);
    ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirAllocationLogementFoyer(allocationLogementFoyer);
    ressourcesActuellesPage.saisirAllocationFamilialeFoyer(allocationFamilialeFoyer);
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation(3000);

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE,montantAideMobilite);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI,montantAGEPI);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.RSA);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA,rsa);
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.RSA);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA,rsa);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.RSA);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA,rsaB);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.RSA);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA,rsaB);
    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.RSA);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA,rsaB);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActiviteB);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });
});










