const specTitleSimulationDeRSA = require("cypress-sonarqube-reporter/specTitle");
import MonFuturContratTravailPage from '../../../../integration-commun/pages/parcours-toutes-aides/mon-futur-contrat-travail.page';
import MaSituationPage from '../../../../integration-commun/pages/parcours-toutes-aides/ma-situation.page'
import { NationalitesEnum } from '../../../../../src/app/commun/enumerations/nationalites.enum'
import PersonnesAChargePage from '../../../../integration-commun/pages/parcours-toutes-aides/personnes-a-charge.page';
import RessourcesActuellesPage from '../../../../integration-commun/pages/parcours-toutes-aides/ressources-actuelles.page'
import ResultatMaSimulationPage from '../../../../integration-commun/pages/parcours-toutes-aides/resultat-ma-simulation.page'
import AvantDeCommencerPage from '../../../../integration-commun/pages/parcours-toutes-aides/avant-de-commencer.page'
import EstimeSessionService from '../../../../integration-commun/utile/estime-session.service'
import { environment } from '../../../../environment'
import { CodesAidesEnum } from "../../../../../src/app/commun/enumerations/codes-aides.enum";
import { DateUtileTests } from '../../../../integration-commun/utile/date-utile-tests.service';
import ChoixTypeSimulationPage from '../../../../integration-commun/pages/choix-type-simulation.page';

describe(specTitleSimulationDeRSA('FEATURE - Obtenir ma simulation - Demandeurs d\'emploi RSA'), () => {


  beforeEach(() => {
    cy.visit(environment.urlApplication);

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

  it('demandeur célibataire, seul deuis plus de 18 mois, non propriétaire, sans enfant,' +
    'CDI 35h, salaire net 1231€,' +
    'RSA 500€, déclaration trimetrielle en M3, non travaillé au cours des 3 derniers mois' +
    'APL 310€' +
    'domicile->travail 10kms / 20 trajets', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/parcours-toutes-aides/demandeur-rsa/demandeur-rsa-prochaine-declaration-mois3/test1-celibataire-locataire-travaille-0-mois.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaire = "1231";
      const distanceDomicileLieuTravail = "8";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE MES RESSOURCES
      const montantMensuelRSA = "500";
      const prochaineDeclarationTrimestrielle = "3";
      const montantAPLDeclare = "310";
      const montantLoyer = "500";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantRSA_M1_M2_M3 = "500";
      const montantPrimeActivite_M4_M5_M6 = "116";
      const montantALS_M2_M3_M4_M5_M6 = "271";

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);

      monFuturContratTravailPage.selectSalaireMensuelNet();

      monFuturContratTravailPage.selectSalaireMensuelNet();
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaire); monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.saisirCodePostal();
      maSituationPage.saisirDateNaissance();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationBeneficiaire(CodesAidesEnum.RSA);
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnVousVivezSeulDepuisPlusDe18MoisOui();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.saisirMontantMensuelRSA(montantMensuelRSA);
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielle(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();
      ressourcesActuellesPage.selectionnerLocataireNonMeuble();
      ressourcesActuellesPage.selectionnerAPL();
      ressourcesActuellesPage.saisirAPL(montantAPLDeclare);
      ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 1, montantRSA_M1_M2_M3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT, 1, montantAPLDeclare);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 2, montantRSA_M1_M2_M3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 2, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 3, montantRSA_M1_M2_M3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 3, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 4, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 4, montantPrimeActivite_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 5, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActivite_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 6, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActivite_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
    });

  it('demandeur en couple, non propriétaire,' +
    'CDI 15h, salaire net 500€,' +
    'RSA 350€, déclaration trimetrielle en M3, non travaillé au cours des 3 derniers mois' +
    'APL 490€, AF 130€, PAGE 170€' +
    'conjoint salaire 380€' +
    'enfant 2 ans, enfant 4 ans' +
    'domicile->travail 10kms / 20 trajets', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/parcours-toutes-aides/demandeur-rsa/demandeur-rsa-prochaine-declaration-mois3/test2-en-couple-locataire-travaille-0-mois.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "15";
      const salaire = "500";
      const distanceDomicileLieuTravail = "8";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE PERSONNES A CHARGE
      const dateUtileTests = new DateUtileTests();
      const dateNaissancePersonne1 = dateUtileTests.getDateNaissanceFromAge(2);
      const dateNaissancePersonne2 = dateUtileTests.getDateNaissanceFromAge(4);
      // VARIABLES PAGE RESSOURCES
      const montantAF = "130";
      const montantAPLDeclare = "490";
      const montantLoyer = "500";
      const montantPAJE = "170";
      const montantMensuelRSA = "350";
      const prochaineDeclarationTrimestrielle = "3";
      const salaireConjoint = "380";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantRSA_M1_M2_M3 = montantMensuelRSA;
      const montantRSA_M4_M5_M6 = "28";
      const montantPrimeActivite_M4_M5_M6 = "323";
      const montantALF_M2_M3_M4_M5_M6 = "438";

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);

      monFuturContratTravailPage.selectSalaireMensuelNet();

      monFuturContratTravailPage.selectSalaireMensuelNet();
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaire); monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.saisirCodePostal();
      maSituationPage.saisirDateNaissance();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationBeneficiaire(CodesAidesEnum.RSA);
      maSituationPage.clickOnSituationFamilialeCouple();
      maSituationPage.clickOnSituationConjointSalarie();
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
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.saisirSalaireConjoint(salaireConjoint);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOuiConjoint();
      ressourcesActuellesPage.clickOnValiderRessourcesConjoint();

      ressourcesActuellesPage.saisirMontantMensuelRSAFoyer(montantMensuelRSA);
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.selectionnerLocataireNonMeuble();
      ressourcesActuellesPage.selectionnerAPL();
      ressourcesActuellesPage.saisirAPL(montantAPLDeclare);
      ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
      ressourcesActuellesPage.saisirAllocationFamilialeFoyer(montantAF);
      ressourcesActuellesPage.saisirPrestationAccueilJeuneEnfant(montantPAJE);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 1, montantRSA_M1_M2_M3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, 1, montantAF);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRESTATION_ACCUEIL_JEUNE_ENFANT, 1, montantPAJE);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT, 1, montantAPLDeclare);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 2, montantRSA_M1_M2_M3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, 2, montantAF);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, 2, montantALF_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 3, montantRSA_M1_M2_M3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, 3, montantAF);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, 3, montantALF_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 4, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, 4, montantAF);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, 4, montantALF_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 4, montantPrimeActivite_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 5, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, 5, montantAF);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, 5, montantALF_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActivite_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 6, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATIONS_FAMILIALES, 6, montantAF);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, 6, montantALF_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActivite_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
    });

  it('demandeur célibataire, non propriétaire, 0 enfant' +
    'CDI 15h, salaire net 500€,' +
    'RSA 380€, déclaration trimetrielle en M3, travaillé au cours des 3 derniers mois avec salaire 380 juillet, salaire 380 juin, salaire 0 mai' +
    'APL 310€' +
    'domicile->travail 10kms / 20 trajets', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/parcours-toutes-aides/demandeur-rsa/demandeur-rsa-prochaine-declaration-mois3/test3-celibataire-locataire-travaille-2-mois-M0-M1.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "15";
      const salaire = "500";
      const distanceDomicileLieuTravail = "8";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE RESSOURCES
      const montantAPLDeclare = "310";
      const montantLoyer = "500";
      const montantMensuelRSA = "380";
      const montantSalaireMoisMoins0 = "380";
      const montantSalaireMoisMoins1 = "380";
      const prochaineDeclarationTrimestrielle = "3";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantRSA_M1_M2_M3 = montantMensuelRSA;
      const montantRSA_M4_M5_M6 = "55";
      const montantPrimeActivite_M4_M5_M6 = "270";
      const montantALS_M2_M3_M4_M5_M6 = "271";

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);

      monFuturContratTravailPage.selectSalaireMensuelNet();

      monFuturContratTravailPage.selectSalaireMensuelNet();
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaire); monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.saisirCodePostal();
      maSituationPage.saisirDateNaissance();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationBeneficiaire(CodesAidesEnum.RSA);
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnVousVivezSeulDepuisPlusDe18MoisOui();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.saisirMontantMensuelRSA(montantMensuelRSA);
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielle(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOui();
      ressourcesActuellesPage.saisirSalaireMoisMoinsXAvantSimulation(montantSalaireMoisMoins0, 0);
      ressourcesActuellesPage.saisirSalaireMoisMoinsXAvantSimulation(montantSalaireMoisMoins1, 1);
      ressourcesActuellesPage.clickOnValiderVosRessources();
      ressourcesActuellesPage.selectionnerLocataireNonMeuble();
      ressourcesActuellesPage.selectionnerAPL();
      ressourcesActuellesPage.saisirAPL(montantAPLDeclare);
      ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 1, montantRSA_M1_M2_M3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT, 1, montantAPLDeclare);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 2, montantRSA_M1_M2_M3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 2, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 3, montantRSA_M1_M2_M3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 3, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 4, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 4, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 4, montantPrimeActivite_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 5, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 5, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActivite_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 6, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 6, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActivite_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
    });

  it('demandeur célibataire, non propriétaire, 0 enfant' +
    'CDI 15h, salaire net 500€,' +
    'RSA 500€, déclaration trimetrielle en M3, travaillé au cours des 3 derniers mois avec salaire 0 M0, salaire 380 M-1, salaire 500 M-2' +
    'APL 310€' +
    'domicile->travail 10kms / 20 trajets', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/parcours-toutes-aides/demandeur-rsa/demandeur-rsa-prochaine-declaration-mois3/test4-celibataire-locataire-travaille-2-mois-M1-M2.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "15";
      const salaire = "500";
      const distanceDomicileLieuTravail = "8";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE RESSOURCES
      const montantAPLDeclare = "310";
      const montantLoyer = "500";
      const montantMensuelRSA = "500";
      const montantSalaireMoisMoins1 = "380";
      const montantSalaireMoisMoins2 = "500";
      const prochaineDeclarationTrimestrielle = "3";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantRSA_M1_M2_M3 = montantMensuelRSA;
      const montantRSA_M4_M5_M6 = "177";
      const montantPrimeActivite_M4_M5_M6 = "196";
      const montantALS_M2_M3_M4_M5_M6 = "271";

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);

      monFuturContratTravailPage.selectSalaireMensuelNet();

      monFuturContratTravailPage.selectSalaireMensuelNet();
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaire); monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.saisirCodePostal();
      maSituationPage.saisirDateNaissance();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationBeneficiaire(CodesAidesEnum.RSA);
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnVousVivezSeulDepuisPlusDe18MoisOui();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.saisirMontantMensuelRSA(montantMensuelRSA);
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielle(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOui();
      ressourcesActuellesPage.saisirSalaireMoisMoinsXAvantSimulation(montantSalaireMoisMoins1, 1);
      ressourcesActuellesPage.saisirSalaireMoisMoinsXAvantSimulation(montantSalaireMoisMoins2, 2);
      ressourcesActuellesPage.clickOnValiderVosRessources();
      ressourcesActuellesPage.selectionnerLocataireNonMeuble();
      ressourcesActuellesPage.selectionnerAPL();
      ressourcesActuellesPage.saisirAPL(montantAPLDeclare);
      ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 1, montantRSA_M1_M2_M3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT, 1, montantAPLDeclare);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 2, montantRSA_M1_M2_M3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 2, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 3, montantRSA_M1_M2_M3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 3, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 4, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 4, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 4, montantPrimeActivite_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 5, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 5, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActivite_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 6, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 6, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActivite_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
    });

  it('demandeur célibataire, propriétaire, 0 enfant' +
    'CDI 15h, salaire net 500€,' +
    'RSA 500€, déclaration trimetrielle en M3, travaillé au cours des 3 derniers mois avec salaire 380 juillet, salaire 380 juin, salaire 0 mai' +
    'domicile->travail 10kms / 20 trajets' +
    'proprietaire', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/parcours-toutes-aides/demandeur-rsa/demandeur-rsa-prochaine-declaration-mois3/test5-celibataire-proprietaire-travaille-2-mois.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "15";
      const salaire = "500";
      const distanceDomicileLieuTravail = "8";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE RESSOURCES
      const montantMensuelRSA = "500";
      const montantSalaireMoisMoins1 = "380";
      const montantSalaireMoisMoins2 = "500";
      const prochaineDeclarationTrimestrielle = "3";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantRSA_M1_M2_M3 = montantMensuelRSA;
      const montantRSA_M4_M5_M6 = "123";
      const montantPrimeActivite_M4_M5_M6 = "270";

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);

      monFuturContratTravailPage.selectSalaireMensuelNet();

      monFuturContratTravailPage.selectSalaireMensuelNet();
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaire); monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.saisirCodePostal();
      maSituationPage.saisirDateNaissance();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationBeneficiaire(CodesAidesEnum.RSA);
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnVousVivezSeulDepuisPlusDe18MoisOui();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.saisirMontantMensuelRSA(montantMensuelRSA);
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielle(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOui();
      ressourcesActuellesPage.saisirSalaireMoisMoinsXAvantSimulation(montantSalaireMoisMoins1, 1);
      ressourcesActuellesPage.saisirSalaireMoisMoinsXAvantSimulation(montantSalaireMoisMoins2, 2);
      ressourcesActuellesPage.clickOnValiderVosRessources();
      ressourcesActuellesPage.selectionnerProprietaire();
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 1, montantRSA_M1_M2_M3);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 2, montantRSA_M1_M2_M3);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 3, montantRSA_M1_M2_M3);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 4, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 4, montantPrimeActivite_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 5, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActivite_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 6, montantRSA_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActivite_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
    });
});



