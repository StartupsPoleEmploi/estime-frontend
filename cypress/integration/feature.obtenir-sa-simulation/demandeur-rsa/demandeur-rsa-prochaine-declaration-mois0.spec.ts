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

  it('demandeur célibataire, seul deuis plus de 18 mois, non propriétaire, sans enfant,' +
     'CDI 35h, salaire net 1231€,' +
     'RSA 500€, déclaration trimetrielle en M, non travaillé au cours des 3 derniers mois' +
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
    const prochaineDeclarationTrimestrielle = "0";
    const montantAPL = "310";
    // VARIABLES PAGE RESULTAT SIMULATION
    const montantRSA_M1_M2_M3 = "497";
    const montantPrimeActivite_M4_M5_M6 = "116";

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
    ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielle(prochaineDeclarationTrimestrielle);
    ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
    ressourcesActuellesPage.clickOnVousEtesProprietaireNon();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.saisirAllocationLogementFoyer(montantAPL);
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation(4000);

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

  it('demandeur en couple, non propriétaire, 0 enfant,' +
    'CDI 35h, salaire net 1231€,' +
    'RSA 710€, déclaration trimetrielle en M, non travaillé au cours des 3 derniers mois' +
    'APL 370€' +
    'conjoint sans ressource' +
    'domicile->travail 10kms / 20 trajets', () => {

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaire = "1231";
      const distanceDomicileLieuTravail = "10";
      const nombreTrajetsDomicileTravail = "20";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE PERSONNES A CHARGE
      // VARIABLES PAGE MES RESSOURCES
      const montantAPL = "370";
      const montantMensuelRSA = "710";
      const prochaineDeclarationTrimestrielle = "0";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantRSA_M1_M2_M3 = "712";
      const montantPrimeActivite_M4_M5_M6 = "256";

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
      maSituationPage.clickOnSituationConjointAucuneRessource();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.saisirMontantMensuelRSAFoyer(montantMensuelRSA);
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.saisirAllocationLogementFoyer(montantAPL);
      ressourcesActuellesPage.clickOnVousEtesProprietaireNonFoyer();
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation(4000);

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

  it('demandeur célibataire, seul deuis plus de 18 mois, non propriétaire, sans enfant,' +
    'CDI 15h, salaire net 500€,' +
    'RSA 500€, déclaration trimetrielle en M, travaillé au cours des 3 derniers mois avec salaire 0 juillet,  salaire 380 juin, salaire 0 mai' +
    'APL 310€' +
    'domicile->travail 10kms / 20 trajets', () => {

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "15";
      const salaire = "500";
      const distanceDomicileLieuTravail = "10";
      const nombreTrajetsDomicileTravail = "20";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE MES RESSOURCES
      const montantMensuelRSA = "500";
      const prochaineDeclarationTrimestrielle = "0";
      const montantAPL = "310";
      const montantSalaireMoisMoins2 = "380";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantRSA_M1_M2_M3 = "497";
      const montantRSA_M4_M5_M6 = "176";
      const montantPrimeActivite_M4_M5_M6 = "196";

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
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielle(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOui();
      ressourcesActuellesPage.clickOnPasDeSalaireMoisMoins1AvantSimulation();
      ressourcesActuellesPage.saisirSalaireMoisMoins2AvantSimulation(montantSalaireMoisMoins2);
      ressourcesActuellesPage.clickOnPasDeSalaireMoisMoins3AvantSimulation();
      ressourcesActuellesPage.clickOnVousEtesProprietaireNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.saisirAllocationLogementFoyer(montantAPL);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation(4000);

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
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M4_M5_M6);
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M4_M5_M6);
      //sixième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M4_M5_M6);

      const headerSection = new HeaderSection();
      headerSection.clickOnSeDeconnecter();
    });

    it('demandeur célibataire, seul deuis plus de 18 mois, non propriétaire, sans enfant,' +
    'CDI 15h, salaire net 500€,' +
    'RSA 500€, déclaration trimetrielle en M, travaillé au cours des 3 derniers mois avec salaire 380 juillet,  salaire 380 juin, salaire 380 mai' +
    'APL 310€' +
    'domicile->travail 10kms / 20 trajets', () => {

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "15";
      const salaire = "500";
      const distanceDomicileLieuTravail = "10";
      const nombreTrajetsDomicileTravail = "20";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE MES RESSOURCES
      const montantMensuelRSA = "500";
      const prochaineDeclarationTrimestrielle = "0";
      const montantAPL = "310";
      const montantSalaireMoisMoins1 = "380";
      const montantSalaireMoisMoins2 = "380";
      const montantSalaireMoisMoins3 = "380";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantRSA_M1_M2_M3 = "375";
      const montantRSA_M4_M5_M6 = "54";
      const montantPrimeActivite_M4_M5_M6 = "270";

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
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielle(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOui();
      ressourcesActuellesPage.saisirSalaireMoisMoins1AvantSimulation(montantSalaireMoisMoins1);
      ressourcesActuellesPage.saisirSalaireMoisMoins2AvantSimulation(montantSalaireMoisMoins2);
      ressourcesActuellesPage.saisirSalaireMoisMoins3AvantSimulation(montantSalaireMoisMoins3);
      ressourcesActuellesPage.clickOnVousEtesProprietaireNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.saisirAllocationLogementFoyer(montantAPL);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation(4000);

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
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M4_M5_M6);
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M4_M5_M6);
      //sixième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, montantPrimeActivite_M4_M5_M6);

      const headerSection = new HeaderSection();
      headerSection.clickOnSeDeconnecter();
    });

});



