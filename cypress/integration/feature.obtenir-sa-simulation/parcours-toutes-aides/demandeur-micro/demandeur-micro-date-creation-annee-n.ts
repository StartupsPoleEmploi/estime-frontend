const specTitleSimulationDeMicro = require("cypress-sonarqube-reporter/specTitle");
import { NationalitesEnum } from '../../../../../src/app/commun/enumerations/nationalites.enum';
import { environment } from '../../../../environment';
import AvantDeCommencerPage from '../../../../integration-commun/pages/avant-de-commencer.page';
import HomePage from '../../../../integration-commun/pages/home.page';
import MaSituationPage from '../../../../integration-commun/pages/parcours-toutes-aides/ma-situation.page';
import MonFuturContratTravailPage from '../../../../integration-commun/pages/parcours-toutes-aides/mon-futur-contrat-travail.page';
import PersonnesAChargePage from '../../../../integration-commun/pages/parcours-toutes-aides/personnes-a-charge.page';
import EstimeSessionService from '../../../../integration-commun/utile/estime-session.service';
import { DateUtileTests } from "../../../../integration-commun/utile/date-utile-tests.service";
import RessourcesActuellesPage from '../../../../integration-commun/pages/parcours-toutes-aides/ressources-actuelles.page';
import ResultatMaSimulationPage from '../../../../integration-commun/pages/parcours-toutes-aides/resultat-ma-simulation.page';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import ChoixTypeSimulationPage from '../../../../integration-commun/pages/choix-type-simulation.page';

describe(specTitleSimulationDeMicro('FEATURE - Obtenir ma simulation - Demandeurs d\'emploi Micro entrepreneur - entreprise créée année N-1'), () => {

  beforeEach(() => {
    cy.visit(environment.urlApplication);

    const homePage = new HomePage();
    homePage.clickOnCommencerSimulation();

    const choixTypeSimulation = new ChoixTypeSimulationPage();
    choixTypeSimulation.clickOnJeCommenceSimulationComplete();
    choixTypeSimulation.clickOnCommencerSansSeConnecter();

    const avantDeCommencerPage = new AvantDeCommencerPage();
    avantDeCommencerPage.clickOnContinuer();
  });

  afterEach(() => {
    const estimeSessionService = new EstimeSessionService();
    estimeSessionService.clearEstimeSession();
  });

  it('En tant que demandeur emploi célibataire,' +
    'enfant à charge de 9 ans, ' +
    'futur contrat CDI, salaire 940€ net, 35h/semaine,' +
    'kilométrage domicile -> taf = 80kms + 12 trajets' +
    'micro entreprise (Achat / revente) - créée il y a 4 mois', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/parcours-toutes-aides/demandeur-micro/demandeur-micro-date-creation-n/ar.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaireNet = "940";
      const distanceDomicileLieuTravail = "80";
      const nombreTrajetsDomicileTravailParSemaine = "3";
      // VARIABLES PAGE MA SITUATION
      const dateUtileTests = new DateUtileTests();
      const nationalite = NationalitesEnum.FRANCAISE;
      const dateRepriseCreationEntreprise = dateUtileTests.getDateRepriseCreationEntrepriseDepuisXMois(4);
      // VARIABLES PAGE PERSONNES A CHARGE
      const dateNaissancePersonne1 = dateUtileTests.getDateNaissanceFromAge(9);
      // VARIABLES PAGE MES RESSOURCES
      const montantChiffreAffairesN = "3000";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantChiffreAffairesMensuelAbattu = "73"
      const montantAideMobilite = "192";
      const montantAgepi = "400";
      const montantPrimeActiviteM2_M3_M4 = "44";
      const montantPrimeActiviteM5_M6 = "439";


      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
      monFuturContratTravailPage.selectSalaireMensuelNet();
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaireNet);
      monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnNombreTrajetsParSemaine(nombreTrajetsDomicileTravailParSemaine);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.saisirCodePostal();
      maSituationPage.saisirDateNaissance();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationMicroEntreprise();
      maSituationPage.saisirDateCreationRepriseEntreprise(dateRepriseCreationEntreprise.jour, dateRepriseCreationEntreprise.mois, dateRepriseCreationEntreprise.annee);
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnAjouterUnePersonneACharge();
      personnesAChargePage.saisirDateNaissance(dateNaissancePersonne1.jour, dateNaissancePersonne1.mois, dateNaissancePersonne1.annee);
      personnesAChargePage.clickOnValider();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.clickOnTypesBeneficesAR();
      ressourcesActuellesPage.saisirCAMicroEntrepriseN(montantChiffreAffairesN);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.clickOnHasPrimeActiviteNon();
      ressourcesActuellesPage.selectionnerProprietaire();
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 1, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 2, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, 2, montantAideMobilite);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI, 2, montantAgepi);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 2, montantPrimeActiviteM2_M3_M4);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 3, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 3, montantPrimeActiviteM2_M3_M4);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 4, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 4, montantPrimeActiviteM2_M3_M4);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 5, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActiviteM5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 6, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActiviteM5_M6);
      resultatMaSimulationPage.clickOnRetour();

    });


  it('En tant que demandeur emploi célibataire,' +
    'enfant à charge de 9 ans, ' +
    'futur contrat CDI, salaire 940€ net, 35h/semaine,' +
    'kilométrage domicile -> taf = 80kms + 12 trajets' +
    'micro entreprise (bic) - créée il y a 4 mois', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/parcours-toutes-aides/demandeur-micro/demandeur-micro-date-creation-n/bic.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaireNet = "940";
      const distanceDomicileLieuTravail = "80";
      const nombreTrajetsDomicileTravailParSemaine = "3";
      // VARIABLES PAGE MA SITUATION
      const dateUtileTests = new DateUtileTests();
      const nationalite = NationalitesEnum.FRANCAISE;
      const dateRepriseCreationEntreprise = dateUtileTests.getDateRepriseCreationEntrepriseDepuisXMois(4);
      // VARIABLES PAGE PERSONNES A CHARGE
      const dateNaissancePersonne1 = dateUtileTests.getDateNaissanceFromAge(9);
      // VARIABLES PAGE MES RESSOURCES
      const montantChiffreAffairesN = "3000";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantChiffreAffairesMensuelAbattu = "125"
      const montantAideMobilite = "192";
      const montantAgepi = "400";
      const montantPrimeActiviteM2_M3_M4 = "76";
      const montantPrimeActiviteM5_M6 = "432";


      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
      monFuturContratTravailPage.selectSalaireMensuelNet();
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaireNet);
      monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnNombreTrajetsParSemaine(nombreTrajetsDomicileTravailParSemaine);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.saisirCodePostal();
      maSituationPage.saisirDateNaissance();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationMicroEntreprise();
      maSituationPage.saisirDateCreationRepriseEntreprise(dateRepriseCreationEntreprise.jour, dateRepriseCreationEntreprise.mois, dateRepriseCreationEntreprise.annee);
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnAjouterUnePersonneACharge();
      personnesAChargePage.saisirDateNaissance(dateNaissancePersonne1.jour, dateNaissancePersonne1.mois, dateNaissancePersonne1.annee);
      personnesAChargePage.clickOnValider();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.clickOnTypesBeneficesBIC();
      ressourcesActuellesPage.saisirCAMicroEntrepriseN(montantChiffreAffairesN);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.clickOnHasPrimeActiviteNon();
      ressourcesActuellesPage.selectionnerProprietaire();
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 1, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 2, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, 2, montantAideMobilite);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI, 2, montantAgepi);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 2, montantPrimeActiviteM2_M3_M4);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 3, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 3, montantPrimeActiviteM2_M3_M4);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 4, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 4, montantPrimeActiviteM2_M3_M4);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 5, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActiviteM5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 6, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActiviteM5_M6);
      resultatMaSimulationPage.clickOnRetour();

    });

  it('En tant que demandeur emploi célibataire,' +
    'enfant à charge de 9 ans, ' +
    'futur contrat CDI, salaire 940€ net, 35h/semaine,' +
    'kilométrage domicile -> taf = 80kms + 12 trajets' +
    'micro entreprise (bnc) - créée il y a 4 mois', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/parcours-toutes-aides/demandeur-micro/demandeur-micro-date-creation-n/bnc.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaireNet = "940";
      const distanceDomicileLieuTravail = "80";
      const nombreTrajetsDomicileTravailParSemaine = "3";
      // VARIABLES PAGE MA SITUATION
      const dateUtileTests = new DateUtileTests();
      const nationalite = NationalitesEnum.FRANCAISE;
      const dateRepriseCreationEntreprise = dateUtileTests.getDateRepriseCreationEntrepriseDepuisXMois(4);
      // VARIABLES PAGE PERSONNES A CHARGE
      const dateNaissancePersonne1 = dateUtileTests.getDateNaissanceFromAge(9);
      // VARIABLES PAGE MES RESSOURCES
      const montantChiffreAffairesN = "3000";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantChiffreAffairesMensuelAbattu = "165"
      const montantAideMobilite = "192";
      const montantAgepi = "400";
      const montantPrimeActiviteM2_M3_M4 = "101";
      const montantPrimeActiviteM5_M6 = "427";


      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
      monFuturContratTravailPage.selectSalaireMensuelNet();
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaireNet);
      monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnNombreTrajetsParSemaine(nombreTrajetsDomicileTravailParSemaine);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.saisirCodePostal();
      maSituationPage.saisirDateNaissance();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationMicroEntreprise();
      maSituationPage.saisirDateCreationRepriseEntreprise(dateRepriseCreationEntreprise.jour, dateRepriseCreationEntreprise.mois, dateRepriseCreationEntreprise.annee);
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnAjouterUnePersonneACharge();
      personnesAChargePage.saisirDateNaissance(dateNaissancePersonne1.jour, dateNaissancePersonne1.mois, dateNaissancePersonne1.annee);
      personnesAChargePage.clickOnValider();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.clickOnTypesBeneficesBNC();
      ressourcesActuellesPage.saisirCAMicroEntrepriseN(montantChiffreAffairesN);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.clickOnHasPrimeActiviteNon();
      ressourcesActuellesPage.selectionnerProprietaire();
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 1, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 2, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, 2, montantAideMobilite);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI, 2, montantAgepi);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 2, montantPrimeActiviteM2_M3_M4);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 3, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 3, montantPrimeActiviteM2_M3_M4);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 4, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 4, montantPrimeActiviteM2_M3_M4);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 5, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActiviteM5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 6, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActiviteM5_M6);
      resultatMaSimulationPage.clickOnRetour();

    });

  it('En tant que demandeur emploi célibataire,' +
    'enfant à charge de 9 ans, ' +
    'futur contrat CDI, salaire 940€ net, 35h/semaine,' +
    'kilométrage domicile -> taf = 80kms + 12 trajets' +
    'micro entreprise (bnc) - créée il y a 4 mois' +
    'prime d\'activité 500€ net', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/parcours-toutes-aides/demandeur-micro/demandeur-micro-date-creation-n/bnc-avec-prime-activite.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaireNet = "940";
      const distanceDomicileLieuTravail = "80";
      const nombreTrajetsDomicileTravailParSemaine = "3";
      // VARIABLES PAGE MA SITUATION
      const dateUtileTests = new DateUtileTests();
      const nationalite = NationalitesEnum.FRANCAISE;
      const dateRepriseCreationEntreprise = dateUtileTests.getDateRepriseCreationEntrepriseDepuisXMois(4);
      // VARIABLES PAGE PERSONNES A CHARGE
      const dateNaissancePersonne1 = dateUtileTests.getDateNaissanceFromAge(9);
      // VARIABLES PAGE MES RESSOURCES
      const montantChiffreAffairesN = "3000";
      const montantPrimeActivite = "500";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantChiffreAffairesMensuelAbattu = "165"
      const montantAideMobilite = "192";
      const montantAgepi = "400";
      const montantPrimeActiviteM4_M5_M6 = "318";


      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
      monFuturContratTravailPage.selectSalaireMensuelNet();
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaireNet);
      monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnNombreTrajetsParSemaine(nombreTrajetsDomicileTravailParSemaine);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.saisirCodePostal();
      maSituationPage.saisirDateNaissance();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationMicroEntreprise();
      maSituationPage.saisirDateCreationRepriseEntreprise(dateRepriseCreationEntreprise.jour, dateRepriseCreationEntreprise.mois, dateRepriseCreationEntreprise.annee);
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnAjouterUnePersonneACharge();
      personnesAChargePage.saisirDateNaissance(dateNaissancePersonne1.jour, dateNaissancePersonne1.mois, dateNaissancePersonne1.annee);
      personnesAChargePage.clickOnValider();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.clickOnTypesBeneficesBNC();
      ressourcesActuellesPage.saisirCAMicroEntrepriseN(montantChiffreAffairesN);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.clickOnHasPrimeActiviteOui();
      ressourcesActuellesPage.saisirMontantPrimeActivite(montantPrimeActivite);
      ressourcesActuellesPage.selectionnerProprietaire();
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer("3");
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 1, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 1, montantPrimeActivite);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 2, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, 2, montantAideMobilite);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI, 2, montantAgepi);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 2, montantPrimeActivite);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 3, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 3, montantPrimeActivite);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 4, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 4, montantPrimeActiviteM4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 5, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActiviteM4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.MICRO_ENTREPRENEUR, 6, montantChiffreAffairesMensuelAbattu);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActiviteM4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
    });
});