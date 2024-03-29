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
    'RSA 500€, déclaration trimetrielle en M1, non travaillé au cours des 3 derniers mois' +
    'APL 310€' +
    'domicile->travail 10kms / 20 trajets', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/parcours-toutes-aides/demandeur-rsa/demandeur-rsa-prochaine-declaration-mois1/celibataire-locataire.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaire = "1231";
      const distanceDomicileLieuTravail = "8";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE MES RESSOURCES
      const montantAPL = "310";
      const montantLoyer = "500";
      const montantMensuelRSA = "500";
      const prochaineDeclarationTrimestrielle = "1";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantRSA_M1 = montantMensuelRSA;
      const montantPrimeActivite_M5_M6 = "175";
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
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 1, montantRSA_M1);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 2, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 3, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 4, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActivite_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 5, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActivite_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_SOCIALE, 6, montantALS_M2_M3_M4_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
    });

  it('demandeur en couple, non propriétaire, enfant de 4ans,' +
    'CDI 35h, salaire net 1231€,' +
    'RSA 500€, déclaration trimetrielle en M1, non travaillé au cours des 3 derniers mois' +
    'APL 420€' +
    'conjoint salaire 700€' +
    'domicile->travail 10kms / 20 trajets', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/parcours-toutes-aides/demandeur-rsa/demandeur-rsa-prochaine-declaration-mois1/en-couple-locataire.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "35";
      const salaire = "1231";
      const distanceDomicileLieuTravail = "8";
      // VARIABLES PAGE MA SITUATION
      const nationalite = NationalitesEnum.FRANCAISE;
      // VARIABLES PAGE PERSONNES A CHARGE
      const dateUtileTests = new DateUtileTests();
      const dateNaissancePersonne1 = dateUtileTests.getDateNaissanceFromAge(4);
      // VARIABLES PAGE MES RESSOURCES
      const montantAPL = "420";
      const montantLoyer = "500";
      const montantMensuelRSA = "500";
      const prochaineDeclarationTrimestrielle = "1";
      const salaireConjoint = "700";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantRSA_M1 = montantMensuelRSA;
      const montantRSA_M2_M3_M4 = "150";
      const montantPrimeActivite_M2_M3_M4 = "452";
      const montantPrimeActivite_M5_M6 = "274";
      const montantALF_M2_M3_M4 = "380";
      const montantALF_M5_M6 = "327";

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
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.saisirSalaireConjoint(salaireConjoint);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisOuiConjoint();
      ressourcesActuellesPage.clickOnValiderRessourcesConjoint();
      ressourcesActuellesPage.selectionnerLocataireNonMeuble();
      ressourcesActuellesPage.selectionnerAPL();
      ressourcesActuellesPage.saisirAPL(montantAPL);
      ressourcesActuellesPage.saisirMontantLoyer(montantLoyer);
      ressourcesActuellesPage.saisirMontantMensuelRSAFoyer(montantMensuelRSA);
      ressourcesActuellesPage.selectOptionMoisProchaineDeclarationTrimestrielleFoyer(prochaineDeclarationTrimestrielle);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 1, montantRSA_M1);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 2, montantRSA_M2_M3_M4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, 2, montantALF_M2_M3_M4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 2, montantPrimeActivite_M2_M3_M4);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 3, montantRSA_M2_M3_M4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, 3, montantALF_M2_M3_M4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 3, montantPrimeActivite_M2_M3_M4);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.RSA, 4, montantRSA_M2_M3_M4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, 4, montantALF_M2_M3_M4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 4, montantPrimeActivite_M2_M3_M4);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, 5, montantALF_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActivite_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaire);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.ALLOCATION_LOGEMENT_FAMILIALE, 6, montantALF_M5_M6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActivite_M5_M6);
      resultatMaSimulationPage.clickOnRetour();
    });
});



