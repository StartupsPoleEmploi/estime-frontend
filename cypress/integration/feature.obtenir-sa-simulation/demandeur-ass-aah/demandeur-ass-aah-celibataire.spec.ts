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

describe(specTitleSimulationDeASS('FEATURE - Obtenir ma simulation - Demandeurs d\'emploi ASS et AAH'), () => {


  beforeEach(() => {
    cy.visit(environment.urlApplication);
  });

  afterEach(() => {
    const estimeSessionService = new EstimeSessionService();
    estimeSessionService.clearEstimeSession();
  });

  it('En tant que demandeur emploi célibataire, sans enfant, CDI 20h, salaire=1150 €, domicile->travail=35km / 20 trajets, ASS=16.49 €, AAH=500 €, ayant travaillé 5 mois sur les 6 derniers mois dont 2 mois lors des trois derniers mois avec 500€ net de salaire, je souhaite obtenir ma simulation', () => {

    // VARIABLES PAGE FUTUR CONTRAT
    const dureeHebdomadaire = "20";
    const salaire = "1150";
    const distanceDomicileLieuTravail = "35";
    const nombreTrajetsDomicileTravail = "20";
    // VARIABLES PAGE MA SITUATION
    const nationalite = NationalitesEnum.FRANCAISE;
    // VARIABLES PAGE PERSONNES A CHARGE
    // VARIABLES PAGE MES RESSOURCES
    const allocationJournaliereNetASS = "16.49";
    const dateDerniereOuvertureDroitASS = {
      "jour": "16",
      "mois": "05",
      "annee": "2019"
    };
    const montantMensuelAAH = "500";
    const prochaineDeclarationTrimestrielle = "0";
    const nombreMoisTravaillesAvantSimulation = "5";
    const salaireNetAvantSimulation = "500"
    // VARIABLES PAGE RESULTAT SIMULATION
    const montantAideMobilite = "346";
    const primeActivite = "69";
    const primeActiviteB = "185";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAssIdentifiant, environment.peConnectUserMotDePasse);

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
    maSituationPage.clickOnSituationAAH();
    maSituationPage.clickOnSituationFamilialeSeul();
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirAllocationJournaliereNetASS(allocationJournaliereNetASS);
    ressourcesActuellesPage.saisirDateDerniereOuvertureDroitASS(dateDerniereOuvertureDroitASS.jour, dateDerniereOuvertureDroitASS.mois, dateDerniereOuvertureDroitASS.annee);
    ressourcesActuellesPage.saisirMontantMensuelAAH(montantMensuelAAH);
    ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOui();
    ressourcesActuellesPage.selectOptionNombreMoisTravaillesAvantSimulation(nombreMoisTravaillesAvantSimulation);
    ressourcesActuellesPage.clickOnPasDeSalaireMoisMoins1AvantSimulation();
    ressourcesActuellesPage.saisirSalaireMoisMoins2AvantSimulation(salaireNetAvantSimulation);
    ressourcesActuellesPage.saisirSalaireMoisMoins3AvantSimulation(salaireNetAvantSimulation);
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.selectionnerProprietaire();
    ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation(4000);

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, montantAideMobilite);
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
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

  it('En tant que demandeur emploi célibataire, sans enfant, CDI 20h, salaire=1150 €, domicile->travail=35km / 20 trajets, ASS=16.49 €, AAH=500 €, ayant travaillé 4 mois sur les 6 derniers mois dont 1 mois lors des trois derniers mois avec 500€ net de salaire, APL=120 €, je souhaite obtenir ma simulation', () => {

    // VARIABLES PAGE FUTUR CONTRAT
    const dureeHebdomadaire = "20";
    const salaire = "1150";
    const distanceDomicileLieuTravail = "35";
    const nombreTrajetsDomicileTravail = "20";
    // VARIABLES PAGE MA SITUATION
    const nationalite = NationalitesEnum.FRANCAISE;
    // VARIABLES PAGE MES RESSOURCES
    const allocationJournaliereNetASS = "16.49";
    const dateDerniereOuvertureDroitASS = {
      "jour": "16",
      "mois": "05",
      "annee": "2019"
    };
    const montantMensuelAAH = "500";
    const prochaineDeclarationTrimestrielle = "0";
    const nombreMoisTravaillesAvantSimulation = "4";
    const salaireNetAvantSimulation = "500"
    const montantAPL = "120";
    const montantLoyer = "500";
    const montantCharges = "30";
    // VARIABLES PAGE RESULTAT SIMULATION
    const montantAideMobilite = "346";
    const montantALS_M1_M2_M3_M4_M5_M6 = "271";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAssIdentifiant, environment.peConnectUserMotDePasse);

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
    maSituationPage.clickOnSituationAAH();
    maSituationPage.clickOnSituationFamilialeSeul();
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirAllocationJournaliereNetASS(allocationJournaliereNetASS);
    ressourcesActuellesPage.saisirDateDerniereOuvertureDroitASS(dateDerniereOuvertureDroitASS.jour, dateDerniereOuvertureDroitASS.mois, dateDerniereOuvertureDroitASS.annee);
    ressourcesActuellesPage.saisirMontantMensuelAAH(montantMensuelAAH);
    ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOui();
    ressourcesActuellesPage.selectOptionNombreMoisTravaillesAvantSimulation(nombreMoisTravaillesAvantSimulation);
    ressourcesActuellesPage.clickOnPasDeSalaireMoisMoins1AvantSimulation();
    ressourcesActuellesPage.clickOnPasDeSalaireMoisMoins1AvantSimulation();
    ressourcesActuellesPage.saisirSalaireMoisMoins3AvantSimulation(salaireNetAvantSimulation);
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.selectionnerLocataireNonMeuble();
    ressourcesActuellesPage.selectionnerAPL();
    ressourcesActuellesPage.saisirAPL(montantAPL);
    ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
    ressourcesActuellesPage.saisirMontantCharges(montantCharges);
    ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation(4000);

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, montantALS_M1_M2_M3_M4_M5_M6);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, montantAideMobilite);
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, montantALS_M1_M2_M3_M4_M5_M6);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, montantALS_M1_M2_M3_M4_M5_M6);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, montantALS_M1_M2_M3_M4_M5_M6);
    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, montantALS_M1_M2_M3_M4_M5_M6);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, montantALS_M1_M2_M3_M4_M5_M6);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });

  it('En tant que demandeur emploi célibataire, 1 enfant de 9 ans, CDI 20h, salaire=1150 €, domicile->travail=35km / 20 trajets, ASS=16.49 €, AAH=500 €, ayant travaillé 3 mois sur les 6 derniers mois dont 3 mois lors des trois derniers mois avec 500€ net de salaire, APL=120 €, je souhaite obtenir ma simulation', () => {

    // VARIABLES PAGE FUTUR CONTRAT
    const dureeHebdomadaire = "20";
    const salaire = "1150";
    const distanceDomicileLieuTravail = "35";
    const nombreTrajetsDomicileTravail = "20";
    // VARIABLES PAGE MA SITUATION
    const nationalite = NationalitesEnum.FRANCAISE;
    // VARIABLES PAGE PERSONNES A CHARGE
    const dateDeNaissancePersonne1 = {
      "jour": "05",
      "mois": "08",
      "annee": "2019"
    };
    // VARIABLES PAGE MES RESSOURCES
    const allocationJournaliereNetASS = "16.49";
    const dateDerniereOuvertureDroitASS = {
      "jour": "16",
      "mois": "05",
      "annee": "2019"
    };
    const montantMensuelAAH = "500";
    const prochaineDeclarationTrimestrielle = "0";
    const nombreMoisTravaillesAvantSimulation = "3";
    const salaireNetAvantSimulation = "500"
    const montantAPL = "120";
    const montantLoyer = "500";
    const montantCharges = "30";
    // VARIABLES PAGE RESULTAT SIMULATION
    const montantAideMobilite = "346";
    const montantAGEPI = "400";
    const primeActivite1 = "19";
    const primeActivite2 = "404";
    const montantALF_M1_M2_M3_M4_M5_M6 = "380";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAssIdentifiant, environment.peConnectUserMotDePasse);

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
    maSituationPage.clickOnSituationAAH();
    maSituationPage.clickOnSituationFamilialeSeul();
    maSituationPage.clickOnSuivant();

    const personnesAChargePage = new PersonnesAChargePage();
    personnesAChargePage.clickOnAjouterUnePersonneACharge();
    personnesAChargePage.saisirDateNaissance(dateDeNaissancePersonne1.jour, dateDeNaissancePersonne1.mois, dateDeNaissancePersonne1.annee);
    personnesAChargePage.clickOnValider();
    personnesAChargePage.clickOnSuivant();

    const ressourcesActuellesPage = new RessourcesActuellesPage();
    ressourcesActuellesPage.saisirAllocationJournaliereNetASS(allocationJournaliereNetASS);
    ressourcesActuellesPage.saisirDateDerniereOuvertureDroitASS(dateDerniereOuvertureDroitASS.jour, dateDerniereOuvertureDroitASS.mois, dateDerniereOuvertureDroitASS.annee);
    ressourcesActuellesPage.saisirMontantMensuelAAH(montantMensuelAAH);
    ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOui();
    ressourcesActuellesPage.selectOptionNombreMoisTravaillesAvantSimulation(nombreMoisTravaillesAvantSimulation);
    ressourcesActuellesPage.saisirSalaireMoisMoins1AvantSimulation(salaireNetAvantSimulation);
    ressourcesActuellesPage.saisirSalaireMoisMoins2AvantSimulation(salaireNetAvantSimulation);
    ressourcesActuellesPage.saisirSalaireMoisMoins3AvantSimulation(salaireNetAvantSimulation);
    ressourcesActuellesPage.clickOnValiderVosRessources();


    ressourcesActuellesPage.selectionnerLocataireNonMeuble();
    ressourcesActuellesPage.selectionnerAPL();
    ressourcesActuellesPage.saisirAPL(montantAPL);
    ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
    ressourcesActuellesPage.saisirMontantCharges(montantCharges);
    ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation(4000);

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, montantALF_M1_M2_M3_M4_M5_M6);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, montantAideMobilite);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI, montantAGEPI);
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, montantALF_M1_M2_M3_M4_M5_M6);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite1);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, montantALF_M1_M2_M3_M4_M5_M6);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite1);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, montantALF_M1_M2_M3_M4_M5_M6);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite1);
    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, montantALF_M1_M2_M3_M4_M5_M6);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite2);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, montantALF_M1_M2_M3_M4_M5_M6);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, primeActivite2);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });

  it('En tant que demandeur emploi célibataire, 2 enfant de 9 ans et 12 ans, CDI 20h, salaire=1150€, domicile->travail=35km / 20 trajets, ASS=16.49€, AAH=500 €, ayant travaillé 3 mois sur les 6 derniers mois dont 0 mois lors des trois derniers mois, APL=120€, AF=250€, je souhaite obtenir ma simulation', () => {

    // VARIABLES PAGE FUTUR CONTRAT
    const dureeHebdomadaire = "20";
    const salaire = "1150";
    const distanceDomicileLieuTravail = "35";
    const nombreTrajetsDomicileTravail = "20";
    // VARIABLES PAGE MA SITUATION
    const nationalite = NationalitesEnum.FRANCAISE;
    // VARIABLES PAGE PERSONNES A CHARGE
    const dateDeNaissancePersonne1 = {
      "jour": "01",
      "mois": "01",
      "annee": "2012"
    };
    const dateDeNaissancePersonne2 = {
      "jour": "01",
      "mois": "01",
      "annee": "2009"
    };
    // VARIABLES PAGE MES RESSOURCES
    const allocationJournaliereNetASS = "16.49";
    const dateDerniereOuvertureDroitASS = {
      "jour": "16",
      "mois": "05",
      "annee": "2019"
    };
    const montantMensuelAAH = "500";
    const prochaineDeclarationTrimestrielle = "0";
    const nombreMoisTravaillesAvantSimulation = "3";
    const montantAPL = "120";
    const montantLoyer = "500";
    const montantCharges = "30";
    const allocationFamilialeFoyer = "250";
    // VARIABLES PAGE RESULTAT SIMULATION
    const montantAideMobilite = "346";
    const montantAGEPI = "400";
    const montantALF_M1_M2_M3_M4_M5_M6 = "438";

    const homePage = new HomePage();
    homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAssIdentifiant, environment.peConnectUserMotDePasse);

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
    maSituationPage.clickOnSituationAAH();
    maSituationPage.clickOnSituationFamilialeSeul();
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
    ressourcesActuellesPage.saisirAllocationJournaliereNetASS(allocationJournaliereNetASS);
    ressourcesActuellesPage.saisirDateDerniereOuvertureDroitASS(dateDerniereOuvertureDroitASS.jour, dateDerniereOuvertureDroitASS.mois, dateDerniereOuvertureDroitASS.annee);
    ressourcesActuellesPage.saisirMontantMensuelAAH(montantMensuelAAH);
    ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOui();
    ressourcesActuellesPage.selectOptionNombreMoisTravaillesAvantSimulation(nombreMoisTravaillesAvantSimulation);
    ressourcesActuellesPage.clickOnPasDeSalaireMoisMoins1AvantSimulation();
    ressourcesActuellesPage.clickOnPasDeSalaireMoisMoins1AvantSimulation();
    ressourcesActuellesPage.clickOnPasDeSalaireMoisMoins2AvantSimulation();
    ressourcesActuellesPage.clickOnValiderVosRessources();

    ressourcesActuellesPage.selectionnerLocataireNonMeuble();
    ressourcesActuellesPage.selectionnerAPL();
    ressourcesActuellesPage.saisirAPL(montantAPL);
    ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
    ressourcesActuellesPage.saisirMontantCharges(montantCharges);
    ressourcesActuellesPage.saisirAllocationFamilialeFoyer(allocationFamilialeFoyer);
    ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
    ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

    ressourcesActuellesPage.clickOnObtenirMaSimulation(4000);

    const resultatMaSimulationPage = new ResultatMaSimulationPage();
    resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
    //premier mois
    resultatMaSimulationPage.clickOnMois(0);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATIONS_FAMILIALES);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, allocationFamilialeFoyer);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, montantALF_M1_M2_M3_M4_M5_M6);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, montantAideMobilite);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI, montantAGEPI);
    //deuxième mois
    resultatMaSimulationPage.clickOnMois(1);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATIONS_FAMILIALES);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, allocationFamilialeFoyer);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, montantALF_M1_M2_M3_M4_M5_M6);
    //troisième mois
    resultatMaSimulationPage.clickOnMois(2);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATIONS_FAMILIALES);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, allocationFamilialeFoyer);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, montantALF_M1_M2_M3_M4_M5_M6);
    //quatrième mois
    resultatMaSimulationPage.clickOnMois(3);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATIONS_FAMILIALES);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, allocationFamilialeFoyer);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, montantALF_M1_M2_M3_M4_M5_M6);
    //cinquième mois
    resultatMaSimulationPage.clickOnMois(4);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATIONS_FAMILIALES);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, allocationFamilialeFoyer);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, montantALF_M1_M2_M3_M4_M5_M6);
    //sixième mois
    resultatMaSimulationPage.clickOnMois(5);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
    resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATIONS_FAMILIALES);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, allocationFamilialeFoyer);
    resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, montantALF_M1_M2_M3_M4_M5_M6);

    const headerSection = new HeaderSection();
    headerSection.clickOnSeDeconnecter();
  });


  it('En tant que demandeur emploi célibataire,' +
    '2 enfant de 9 ans et 12 ans,' +
    'CDI 20h, salaire=1150€,' +
    'domicile->travail=35km / 20 trajets,' +
    'ASS=16.49€, AAH=500 €,' +
    'ayant travaillé 3 mois sur les 6 derniers mois dont 0 mois lors des trois derniers mois,' +
    'AF=250€,' +
    'propriétaire' +
    'je souhaite obtenir ma simulation', () => {

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "20";
      const salaire = "1150";
      const distanceDomicileLieuTravail = "35";
      const nombreTrajetsDomicileTravail = "20";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE PERSONNES A CHARGE
      const dateDeNaissancePersonne1 = {
        "jour": "01",
        "mois": "01",
        "annee": "2012"
      };
      const dateDeNaissancePersonne2 = {
        "jour": "01",
        "mois": "01",
        "annee": "2009"
      };
      // VARIABLES PAGE MES RESSOURCES
      const allocationJournaliereNetASS = "16.49";
      const dateDerniereOuvertureDroitASS = {
        "jour": "16",
        "mois": "05",
        "annee": "2019"
      };
      const montantMensuelAAH = "500";
      const prochaineDeclarationTrimestrielle = "0";
      const nombreMoisTravaillesAvantSimulation = "3";
      const allocationFamilialeFoyer = "250";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantAideMobilite = "346";
      const montantAGEPI = "400";

      const homePage = new HomePage();
      homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAssIdentifiant, environment.peConnectUserMotDePasse);

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
      maSituationPage.clickOnSituationAAH();
      maSituationPage.clickOnSituationFamilialeSeul();
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
      ressourcesActuellesPage.saisirAllocationJournaliereNetASS(allocationJournaliereNetASS);
      ressourcesActuellesPage.saisirDateDerniereOuvertureDroitASS(dateDerniereOuvertureDroitASS.jour, dateDerniereOuvertureDroitASS.mois, dateDerniereOuvertureDroitASS.annee);
      ressourcesActuellesPage.saisirMontantMensuelAAH(montantMensuelAAH);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOui();
      ressourcesActuellesPage.selectOptionNombreMoisTravaillesAvantSimulation(nombreMoisTravaillesAvantSimulation);
      ressourcesActuellesPage.clickOnPasDeSalaireMoisMoins1AvantSimulation();
      ressourcesActuellesPage.clickOnPasDeSalaireMoisMoins1AvantSimulation();
      ressourcesActuellesPage.clickOnPasDeSalaireMoisMoins2AvantSimulation();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.selectionnerProprietaire();
      ressourcesActuellesPage.saisirAllocationFamilialeFoyer(allocationFamilialeFoyer);
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation(4000);

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(0);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATIONS_FAMILIALES);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, montantAideMobilite);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI, montantAGEPI);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, allocationFamilialeFoyer);
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATIONS_FAMILIALES);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, allocationFamilialeFoyer);
      //troisième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATIONS_FAMILIALES);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, allocationFamilialeFoyer);
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATIONS_FAMILIALES);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, allocationFamilialeFoyer);
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATIONS_FAMILIALES);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, allocationFamilialeFoyer);
      //sixième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesRessourcesFinancieresEnum.PAIE, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATIONS_FAMILIALES);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, allocationFamilialeFoyer);

      const headerSection = new HeaderSection();
      headerSection.clickOnSeDeconnecter();
    });
});