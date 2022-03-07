const specTitleSimulationDeAAH = require("cypress-sonarqube-reporter/specTitle");
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
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import HeaderSection from '../../../integration-commun/sections/header.section';

describe(specTitleSimulationDeAAH('FEATURE - Obtenir ma simulation - Demandeurs d\'emploi AAH - 2 mois travaillé avant simulation'), () => {

  beforeEach(() => {
    cy.visit(environment.urlApplication);
  });

  afterEach(() => {
    const estimeSessionService = new EstimeSessionService();
    estimeSessionService.clearEstimeSession();
  });

  it('En tant que demandeur emploi célibataire,' +
    'enfant à charge de 9 ans, asf 117€, ' +
    'montant AAH 900€, ' +
    '2 mois travaillé avant simulation dont 2 mois dans les 3 derniers mois avant la simulation, ' +
    'futur contrat CDI, salaire 940€ net, 35h/semaine,' +
    'kilométrage domicile -> taf = 80kms + 12 trajets', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/demandeur-aah/demandeur-aah-2-mois-travaille-avant-simulation/sans-logement.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaireNet = "940";
      const distanceDomicileLieuTravail = "80";
      const nombreTrajetsDomicileTravail = "12";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE PERSONNES A CHARGE
      const dateUtileTests = new DateUtileTests();
      const dateNaissancePersonne1 = dateUtileTests.getDateNaissanceFromAge(9);
      // VARIABLES PAGE MES RESSOURCES
      const allocationAAH = "900";
      const prochaineDeclarationTrimestrielle = "0";
      const allocationSoutienFamiliale = "117";
      const montantSalaireMoisMoins0 = "850";
      const montantSalaireMoisMoins1 = "800";

      // VARIABLES PAGE RESULTAT SIMULATION
      const montantAAH_M1_M2_M3_M4 = "900";
      const montantAAH_M5_M6 = "171";
      const montantAideMobilite = "504";
      const montantAgepi = "400";
      const montantPrimeActiviteM2_M3 = "90";
      const montantPrimeActiviteM4_M5_M6 = "61";


      const homePage = new HomePage();
      homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAahIdentifiant, environment.peConnectUserMotDePasse);

      const avantDeCommencerPage = new AvantDeCommencerPage();
      avantDeCommencerPage.clickOnJeCommence();

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
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
      ressourcesActuellesPage.saisirMontantMensuelAAH(allocationAAH);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOui();
      ressourcesActuellesPage.saisirSalaireMoisMoinsXAvantSimulation(montantSalaireMoisMoins0, 0);
      ressourcesActuellesPage.saisirSalaireMoisMoinsXAvantSimulation(montantSalaireMoisMoins1, 1);
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.selectionnerProprietaire();
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.saisirAllocationSoutienFamilialeFoyer(allocationSoutienFamiliale);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES, 1, montantAAH_M1_M2_M3_M4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, 1, montantAideMobilite);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI, 1, montantAgepi);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES, 2, montantAAH_M1_M2_M3_M4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 2, montantPrimeActiviteM2_M3);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES, 3, montantAAH_M1_M2_M3_M4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 3, montantPrimeActiviteM2_M3);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES, 4, montantAAH_M1_M2_M3_M4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 4, montantPrimeActiviteM4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES, 5, montantAAH_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActiviteM4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES, 6, montantAAH_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActiviteM4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();

      const headerSection = new HeaderSection();
      headerSection.clickOnSeDeconnecter();

    });

  it('En tant que demandeur emploi célibataire,' +
    'enfant à charge de 9 ans, asf 117€, ' +
    'montant AAH 900€, ' +
    '2 mois travaillé avant simulation dont 2 mois dans les 3 derniers mois avant la simulation, ' +
    'futur contrat CDI, salaire 940€ net, 35h/semaine,' +
    'kilométrage domicile -> taf = 80kms + 12 trajets' +
    'locataire (loyer : 500, charges 50)', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/demandeur-aah/demandeur-aah-2-mois-travaille-avant-simulation/avec-logement.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaireNet = "940";
      const distanceDomicileLieuTravail = "80";
      const nombreTrajetsDomicileTravail = "12";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE PERSONNES A CHARGE
      const dateUtileTests = new DateUtileTests();
      const dateNaissancePersonne1 = dateUtileTests.getDateNaissanceFromAge(9);
      // VARIABLES PAGE MES RESSOURCES
      const allocationAAH = "900";
      const prochaineDeclarationTrimestrielle = "0";
      const allocationSoutienFamiliale = "117";
      const montantSalaireMoisMoins0 = "850";
      const montantSalaireMoisMoins1 = "800";

      const montantLoyer = "500";
      const montantCharges = "50";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantAAH_M1_M2_M3_M4 = "900";
      const montantAAH_M5_M6 = "171";
      const montantAideMobilite = "504";
      const montantAgepi = "400";
      const montantPrimeActiviteM2_M3 = "158";
      const montantPrimeActiviteM4_M5_M6 = "117";
      const montantAPLDeclare = "200";
      const montantALF_M1_M2_M3_M4_M5_M6 = "380";

      const homePage = new HomePage();
      homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAahIdentifiant, environment.peConnectUserMotDePasse);

      const avantDeCommencerPage = new AvantDeCommencerPage();
      avantDeCommencerPage.clickOnJeCommence();

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
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
      ressourcesActuellesPage.saisirMontantMensuelAAH(allocationAAH);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOui();
      ressourcesActuellesPage.saisirSalaireMoisMoinsXAvantSimulation(montantSalaireMoisMoins0, 0);
      ressourcesActuellesPage.saisirSalaireMoisMoinsXAvantSimulation(montantSalaireMoisMoins1, 1);
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.selectionnerLocataireNonMeuble();
      ressourcesActuellesPage.selectionnerAucunCas();
      ressourcesActuellesPage.selectionnerAPL();
      ressourcesActuellesPage.saisirAPL(montantAPLDeclare);
      ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
      ressourcesActuellesPage.saisirMontantCharges(montantCharges);
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.saisirAllocationSoutienFamilialeFoyer(allocationSoutienFamiliale);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES, 1, montantAAH_M1_M2_M3_M4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, 1, montantALF_M1_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, 1, montantAideMobilite);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI, 1, montantAgepi);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES, 2, montantAAH_M1_M2_M3_M4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, 2, montantALF_M1_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 2, montantPrimeActiviteM2_M3);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES, 3, montantAAH_M1_M2_M3_M4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, 3, montantALF_M1_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 3, montantPrimeActiviteM2_M3);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES, 4, montantAAH_M1_M2_M3_M4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, 4, montantALF_M1_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 4, montantPrimeActiviteM4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES, 5, montantAAH_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, 5, montantALF_M1_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActiviteM4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_ADULTES_HANDICAPES, 6, montantAAH_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, 6, montantALF_M1_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActiviteM4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();

      const headerSection = new HeaderSection();
      headerSection.clickOnSeDeconnecter();

    });
});