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
     'RSA 500€, déclaration trimetrielle en M1, non travaillé au cours des 3 derniers mois' +
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
    const montantAPL = "310";
    const montantMensuelRSA = "500";
    const prochaineDeclarationRSA = "1";
    // VARIABLES PAGE RESULTAT SIMULATION
    const montantRSA_M1_M2_M3 = "497";
    const montantPrimeActivite_M4_M5_M6 = "174";

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
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirMontantMensuelRSA(montantMensuelRSA);
    ressourcesActuellesPage.selectOptionMoisProchaineDeclarationRSA(prochaineDeclarationRSA);
    ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
    ressourcesActuellesPage.clickOnVousEtesProprietaireNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirAllocationLogementFoyer(montantAPL);
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation(3000);

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M1_M2_M3);
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M1_M2_M3);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M1_M2_M3);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M4_M5_M6);

    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M4_M5_M6);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M4_M5_M6);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });

  it('demandeur en couple, non propriétaire, enfant de 4ans,' +
     'CDI 35h, salaire net 1231€,' +
     'RSA 500€, déclaration trimetrielle en M1, non travaillé au cours des 3 derniers mois' +
     'APL 420€' +
     'conjoint salaire 700€' +
     'domicile->travail 10kms / 20 trajets', () => {

    // VARIABLES PAGE FUTUR CONTRAT
    const dureeHebdomadaire = "35";
    const salaire = "1231";
    const distanceDomicileLieuTravail = "10";
    const nombreTrajetsDomicileTravail = "20";
    // VARIABLES PAGE MA SITUATION
    const nationalite = NationalitesEnum.FRANCAISE;
    // VARIABLES PAGE PERSONNES A CHARGE
    const dateUtileTests = new DateUtileTests();
    const dateNaissancePersonne1 = dateUtileTests.getDateNaissanceFromAge(4);
    // VARIABLES PAGE MES RESSOURCES
    const montantAPL = "420";
    const montantMensuelRSA = "170";
    const prochaineDeclarationRSA = "1";
    const salaireConjoint = "700";
    // VARIABLES PAGE RESULTAT SIMULATION
    const montantRSA_M1_M2_M3 = "175";
    const montantPrimeActivite_M1_M2_M3 = "429";
    const montantPrimeActivite_M4_M5_M6 = "273";

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
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnAjouterUnePersonneACharge();
    personnesAChargePage.saisirDateNaissance(dateNaissancePersonne1.jour, dateNaissancePersonne1.mois, dateNaissancePersonne1.annee);
    personnesAChargePage.clickOnValider();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirSalaireConjoint(salaireConjoint);
    ressourcesActuellesPage.clickOnValiderRessourcesConjoint();

    ressourcesActuellesPage.saisirAllocationLogementFoyer(montantAPL);
    ressourcesActuellesPage.saisirMontantMensuelRSAFoyer(montantMensuelRSA);
    ressourcesActuellesPage.selectOptionMoisProchaineDeclarationRSAFoyer(prochaineDeclarationRSA);
    ressourcesActuellesPage.clickOnVousEtesProprietaireNonFoyer();
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation(3000);

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M1_M2_M3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M1_M2_M3);
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M1_M2_M3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M1_M2_M3);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M1_M2_M3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M1_M2_M3);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M4_M5_M6);

    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M4_M5_M6);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M4_M5_M6);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });
});



