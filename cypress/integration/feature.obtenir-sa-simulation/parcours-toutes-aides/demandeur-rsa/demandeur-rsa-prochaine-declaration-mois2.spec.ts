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
    'RSA 500€, déclaration trimetrielle en M2, non travaillé au cours des 3 derniers mois' +
    'APL 310€' +
    'domicile->travail 10kms / 20 trajets', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/parcours-toutes-aides/demandeur-rsa/demandeur-rsa-prochaine-declaration-mois2/celibataire-locataire.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaire = "1231";
      const distanceDomicileLieuTravail = "8";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE MES RESSOURCES
      const montantMensuelRSA = "500";
      const prochaineDeclarationTrimestrielle = "2";
      const montantAPL = "310";
      const montantLoyer = "500";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantRSA_M1_M2 = montantMensuelRSA;
      const montantRSA_M3_M4_M5 = "102";
      const montantPrimeActivite_M3_M4_M5 = "58";
      const montantPrimeActivite_M6 = "175";
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
      ressourcesActuellesPage.saisirAPL(montantAPL);
      ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 1, montantRSA_M1_M2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT, 1, montantAPL);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 2, montantRSA_M1_M2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 2, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 3, montantRSA_M3_M4_M5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 3, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 3, montantPrimeActivite_M3_M4_M5);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 4, montantRSA_M3_M4_M5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 4, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 4, montantPrimeActivite_M3_M4_M5);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 5, montantRSA_M3_M4_M5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 5, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActivite_M3_M4_M5);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 6, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActivite_M6);
      resultatMaSimulationPage.clickOnRetour();
    });

  it('demandeur célibataire, seul deuis plus de 18 mois, non propriétaire, sans enfant,' +
    'CDI 15h, salaire net 500€,' +
    'RSA 500€, déclaration trimetrielle en M2, travaillé au cours des 3 derniers mois avec salaire 500 juillet,  salaire 0 juin, salaire 500 mai' +
    'APL 310€' +
    'domicile->travail 10kms / 20 trajets', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/parcours-toutes-aides/demandeur-rsa/demandeur-rsa-prochaine-declaration-mois2/celibataire-locataire-travaille-2-mois.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "15";
      const salaire = "500";
      const distanceDomicileLieuTravail = "8";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE MES RESSOURCES
      const montantAPL = "310";
      const montantLoyer = "500";
      const montantMensuelRSA = "500";
      const montantSalaireMoisMoins0 = "500";
      const montantSalaireMoisMoins2 = "500";
      const prochaineDeclarationTrimestrielle = "2";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantRSA_M1_M2 = montantMensuelRSA;
      const montantRSA_M3_M4_M5 = "177";
      const montantRSA_M6 = "16";
      const montantPrimeActivite_M3_M4_M5 = "196";
      const montantPrimeActivite_M6 = "294";
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
      ressourcesActuellesPage.saisirSalaireMoisMoinsXAvantSimulation(montantSalaireMoisMoins2, 2);
      ressourcesActuellesPage.clickOnValiderVosRessources();
      ressourcesActuellesPage.selectionnerLocataireNonMeuble();
      ressourcesActuellesPage.selectionnerAPL();
      ressourcesActuellesPage.saisirAPL(montantAPL);
      ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 1, montantRSA_M1_M2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_PERSONNALISEE_LOGEMENT, 1, montantAPL);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 2, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 2, montantRSA_M1_M2);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 3, montantRSA_M3_M4_M5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 3, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 3, montantPrimeActivite_M3_M4_M5);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 4, montantRSA_M3_M4_M5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 4, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 4, montantPrimeActivite_M3_M4_M5);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 5, montantRSA_M3_M4_M5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 5, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActivite_M3_M4_M5);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 6, montantRSA_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 6, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActivite_M6);
      resultatMaSimulationPage.clickOnRetour();
    });
});



