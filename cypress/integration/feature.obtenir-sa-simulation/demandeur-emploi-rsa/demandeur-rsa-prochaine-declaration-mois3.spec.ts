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
import { DateUtileTests } from '../../../integration-commun/utile/date-utile-tests.service';

describe(specTitleSimulationDeASS('FEATURE - Obtenir ma simulation - Demandeurs d\'emploi RSA'), () => {


  beforeEach(() => {
    cy.visit(environment.urlApplication);
  });

  afterEach(() => {
    const estimeSessionService = new EstimeSessionService();
    estimeSessionService.clearEstimeSession();
  });

  it('demandeur célibataire, seul deuis plus de 18 mois, non propriétaire, sans enfant,' +
     'CDI 35h, salaire net 1231€,' +
     'RSA 500€, déclaration trimetrielle en M3, non travaillé au cours des 3 derniers mois' +
     'APL 310€' +
     'domicile->travail 10kms / 20 trajets', () => {

    // VARIABLES PAGE FUTUR CONTRAT
    const dureeHebdomadaire = "35";
    const salaire = "1231";
    const distanceDomicileLieuTravail = "10";
    const nombreTrajetsDomicileTravail = "20";
    // VARIABLES PAGE MA SITUATION
    const nationalite = NationalitesEnum.FRANCAISE;
    // VARIABLES PAGE MES RESSOURCES
    const montantMensuelRSA = "500";
    const prochaineDeclarationRSA = "3";
    const montantAPL = "310";
    // VARIABLES PAGE RESULTAT SIMULATION
    const montantRSA_M1_M2 = "500";
    const montantPrimeActivite_M3_M4_M5 = "116";
    const montantPrimeActivite_M6 = "174";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserRsaIdentifiant, environment.peConnectUserMotDePasse);

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
    maSituationPage.clickOnSituationFamilialeSeul();
    maSituationPage.clickOnVousVivezSeulDepuisPlusDe18MoisOui();
    maSituationPage.clickOnVousEtesProprietaireNon();
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirMontantMensuelRSA(montantMensuelRSA);
    ressourcesActuellesPage.selectOptionMoisProchaineDeclarationRSA(prochaineDeclarationRSA);
    ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirAllocationLogementFoyer(montantAPL);
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation(3000);

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M1_M2);
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M1_M2);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M3_M4_M5);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M3_M4_M5);

    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M3_M4_M5);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M6);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });

  it('demandeur en couple, non propriétaire,' +
     'CDI 15h, salaire net 500€,' +
     'RSA 350€, déclaration trimetrielle en M3, non travaillé au cours des 3 derniers mois' +
     'APL 490€, AF 130€, PAGE 170€' +
     'conjoint salaire 380€' +
     'enfant 2 ans, enfant 4 ans' +
     'domicile->travail 10kms / 20 trajets', () => {

    // VARIABLES PAGE FUTUR CONTRAT
    const dureeHebdomadaire = "15";
    const salaire = "500";
    const distanceDomicileLieuTravail = "10";
    const nombreTrajetsDomicileTravail = "20";
    // VARIABLES PAGE MA SITUATION
    const nationalite = NationalitesEnum.FRANCAISE;
    // VARIABLES PAGE PERSONNES A CHARGE
    const dateUtileTests = new DateUtileTests();
    const dateNaissancePersonne1 = dateUtileTests.getDateNaissanceFromAge(2);
    const dateNaissancePersonne2 = dateUtileTests.getDateNaissanceFromAge(4);
    // VARIABLES PAGE RESSOURCES
    const montantAF = "130";
    const montantAPL = "490";
    const montantPAGE = "170";
    const montantMensuelRSA = "350";
    const prochaineDeclarationRSA = "3";
    const salaireConjoint = "380";
    // VARIABLES PAGE RESULTAT SIMULATION
    const montantRSA_M1_M2 = "350";
    const montantRSA_M3_M4_M5 = "32";
    const montantPrimeActivite_M3_M4_M5 = "319";
    const montantPrimeActivite_M6 = "367";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserRsaIdentifiant, environment.peConnectUserMotDePasse);

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
    maSituationPage.clickOnSituationFamilialeCouple();
    maSituationPage.clickOnSituationConjointSalarie();
    maSituationPage.clickOnVousEtesProprietaireNon();
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnAjouterUnePersonneACharge();
    personnesAChargePage.saisirDateNaissance(dateNaissancePersonne1.jour, dateNaissancePersonne1.mois, dateNaissancePersonne1.annee);
    personnesAChargePage.clickOnValider();
    personnesAChargePage.clickOnAjouterUnePersonneACharge();
    personnesAChargePage.saisirDateNaissance(dateNaissancePersonne2.jour, dateNaissancePersonne2.mois, dateNaissancePersonne2.annee);
    personnesAChargePage.clickOnValider();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirMontantMensuelRSA(montantMensuelRSA);
    ressourcesActuellesPage.selectOptionMoisProchaineDeclarationRSA(prochaineDeclarationRSA);
    ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirSalaireConjoint(salaireConjoint);
    ressourcesActuellesPage.clickOnValiderRessourcesConjoint();

    ressourcesActuellesPage.saisirAllocationLogementFoyer(montantAPL);
    ressourcesActuellesPage.saisirAllocationFamilialeFoyer(montantAF);
    ressourcesActuellesPage.saisirPrestationAccueilJeuneEnfant(montantPAGE);
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation(3000);

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M1_M2);
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M1_M2);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M3_M4_M5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M3_M4_M5);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M3_M4_M5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M3_M4_M5);

    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M3_M4_M5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M3_M4_M5);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M6);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });

  it('demandeur célibataire, non propriétaire, 0 enfant' +
     'CDI 15h, salaire net 500€,' +
     'RSA 380€, déclaration trimetrielle en M3, travaillé au cours des 3 derniers mois avec salaire 380 juillet,  salaire 380 juin, salaire 0 mai' +
     'APL 310€' +
     'domicile->travail 10kms / 20 trajets', () => {

    // VARIABLES PAGE FUTUR CONTRAT
    const dureeHebdomadaire = "15";
    const salaire = "500";
    const distanceDomicileLieuTravail = "10";
    const nombreTrajetsDomicileTravail = "20";
    // VARIABLES PAGE MA SITUATION
    const nationalite = NationalitesEnum.FRANCAISE;
    // VARIABLES PAGE RESSOURCES
    const montantAPL = "310";
    const montantMensuelRSA = "380";
    const montantSalaireMoisMoins1 = "380";
    const montantSalaireMoisMoins2 = "380";
    const prochaineDeclarationRSA = "3";
    // VARIABLES PAGE RESULTAT SIMULATION
    const montantRSA_M1_M2 = "380";
    const montantRSA_M3_M4_M5 = "54";
    const montantRSA_M6 = "16";
    const montantPrimeActivite_M3_M4_M5 = "270";
    const montantPrimeActivite_M6 = "294";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserRsaIdentifiant, environment.peConnectUserMotDePasse);

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
    maSituationPage.clickOnSituationFamilialeSeul();
    maSituationPage.clickOnVousVivezSeulDepuisPlusDe18MoisOui();
    maSituationPage.clickOnVousEtesProprietaireNon();
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirMontantMensuelRSA(montantMensuelRSA);
    ressourcesActuellesPage.selectOptionMoisProchaineDeclarationRSA(prochaineDeclarationRSA);
    ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOui();
    ressourcesActuellesPage.saisirSalaireMoisMoins1AvantSimulation(montantSalaireMoisMoins1);
    ressourcesActuellesPage.saisirSalaireMoisMoins2AvantSimulation(montantSalaireMoisMoins2);
    ressourcesActuellesPage.clickOnPasDeSalaireMoisMoins3AvantSimulation();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirAllocationLogementFoyer(montantAPL);
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation(3000);

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M1_M2);
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M1_M2);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M3_M4_M5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M3_M4_M5);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M3_M4_M5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M3_M4_M5);

    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M3_M4_M5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M3_M4_M5);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M6);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });

  it('demandeur célibataire, non propriétaire, 0 enfant' +
     'CDI 15h, salaire net 500€,' +
     'RSA 380€, déclaration trimetrielle en M3, travaillé au cours des 3 derniers mois avec salaire 380 juillet,  salaire 380 juin, salaire 0 mai' +
     'APL 310€' +
     'domicile->travail 10kms / 20 trajets', () => {

    // VARIABLES PAGE FUTUR CONTRAT
    const dureeHebdomadaire = "15";
    const salaire = "500";
    const distanceDomicileLieuTravail = "10";
    const nombreTrajetsDomicileTravail = "20";
    // VARIABLES PAGE MA SITUATION
    const nationalite = NationalitesEnum.FRANCAISE;
    // VARIABLES PAGE RESSOURCES
    const montantAPL = "310";
    const montantMensuelRSA = "500";
    const montantSalaireMoisMoins2 = "380";
    const montantSalaireMoisMoins3 = "500";
    const prochaineDeclarationRSA = "3";
    // VARIABLES PAGE RESULTAT SIMULATION
    const montantRSA_M1_M2 = "500";
    const montantRSA_M3_M4_M5 = "176";
    const montantRSA_M6 = "16";
    const montantPrimeActivite_M3_M4_M5 = "196";
    const montantPrimeActivite_M6 = "294";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserRsaIdentifiant, environment.peConnectUserMotDePasse);

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
    maSituationPage.clickOnSituationFamilialeSeul();
    maSituationPage.clickOnVousVivezSeulDepuisPlusDe18MoisOui();
    maSituationPage.clickOnVousEtesProprietaireNon();
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirMontantMensuelRSA(montantMensuelRSA);
    ressourcesActuellesPage.selectOptionMoisProchaineDeclarationRSA(prochaineDeclarationRSA);
    ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOui();
    ressourcesActuellesPage.clickOnPasDeSalaireMoisMoins1AvantSimulation();
    ressourcesActuellesPage.saisirSalaireMoisMoins2AvantSimulation(montantSalaireMoisMoins2);
    ressourcesActuellesPage.saisirSalaireMoisMoins3AvantSimulation(montantSalaireMoisMoins3);
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirAllocationLogementFoyer(montantAPL);
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation(3000);

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M1_M2);
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M1_M2);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M3_M4_M5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M3_M4_M5);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M3_M4_M5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M3_M4_M5);

    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M3_M4_M5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M3_M4_M5);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M6);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M6);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });
});


