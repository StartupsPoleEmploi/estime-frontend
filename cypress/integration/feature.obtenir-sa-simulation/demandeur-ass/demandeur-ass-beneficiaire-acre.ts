const specTitleSimulationDeASS = require("cypress-sonarqube-reporter/specTitle");
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

describe(specTitleSimulationDeASS('FEATURE - Obtenir ma simulation - Demandeurs d\'emploi ASS avec des enfants'), () => {

  beforeEach(() => {
    cy.visit(environment.urlApplication);
  });

  afterEach(() => {
    const estimeSessionService = new EstimeSessionService();
    estimeSessionService.clearEstimeSession();
  });

  it('En tant que demandeur emploi célibataire,' +
    'enfant à charge de 9 ans, asf 117€,' +
    'montant net journalier ASS = 16,89€,' +
    'bénéficiaire de l\'ACRE depuis 5 mois' +
    'travaillé avant simulation : M0 0€, M-1 0€, M-2 0€' +
    'futur contrat CDI, salaire 1245€ net, 20h/semaine,' +
    'kilométrage domicile -> taf = 80kms + 12 trajets', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/demandeur-ass/demandeur-ass-beneficiaire-acre/creation-depuis-5-mois.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "20";
      const salaireNet = "1245";
      const distanceDomicileLieuTravail = "80";
      const nombreTrajetsDomicileTravailParSemaine = "3";
      // VARIABLES PAGE MA SITUATION
      const dateUtileTests = new DateUtileTests();
      const nationalite = NationalitesEnum.FRANCAISE;
      const dateRepriseCreationEntreprise = dateUtileTests.getDateRepriseCreationEntrepriseDepuisXMois(5);
      // VARIABLES PAGE PERSONNES A CHARGE
      const dateNaissancePersonne1 = dateUtileTests.getDateNaissanceFromAge(9);
      // VARIABLES PAGE MES RESSOURCES
      const allocationJournaliereNetASS = "16.49";
      const revenusIndependant = "1000";
      const allocationSoutienFamiliale = "117";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantAideMobilite = "504";
      const montantAgepi = "400";
      const montantPrimeActiviteM5_M6 = "97";

      const homePage = new HomePage();
      homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAssIdentifiant, environment.peConnectUserMotDePasse);

      const avantDeCommencerPage = new AvantDeCommencerPage();
      avantDeCommencerPage.clickOnJeCommence();

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaireNet);
      monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnNombreTrajetsParSemaine(nombreTrajetsDomicileTravailParSemaine);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationIndependant();
      maSituationPage.clickOnSituationBeneficiaireACREOui();
      maSituationPage.saisirDateCreationRepriseEntreprise(dateRepriseCreationEntreprise.jour, dateRepriseCreationEntreprise.mois, dateRepriseCreationEntreprise.annee);
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnAjouterUnePersonneACharge();
      personnesAChargePage.saisirDateNaissance(dateNaissancePersonne1.jour, dateNaissancePersonne1.mois, dateNaissancePersonne1.annee);
      personnesAChargePage.clickOnValider();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.saisirAllocationJournaliereNetASS(allocationJournaliereNetASS);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.saisirRevenusIndependant(revenusIndependant);
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.selectionnerProprietaire();
      ressourcesActuellesPage.saisirAllocationSoutienFamilialeFoyer(allocationSoutienFamiliale);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE, 1);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, 2, montantAideMobilite);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI, 2, montantAgepi);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE, 2);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE, 3);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE, 4);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE, 5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActiviteM5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE, 6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActiviteM5_M6);
      resultatMaSimulationPage.clickOnRetour();

      const headerSection = new HeaderSection();
      headerSection.clickOnSeDeconnecter();

    });

  it('En tant que demandeur emploi célibataire,' +
    'enfant à charge de 9 ans, asf 117€,' +
    'montant net journalier ASS = 16,89€,' +
    'bénéficiaire de l\'ACRE depuis 10 mois' +
    'travaillé avant simulation : M0 0€, M-1 0€, M-2 0€' +
    'futur contrat CDI, salaire 1245€ net, 20h/semaine,' +
    'kilométrage domicile -> taf = 80kms + 12 trajets', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/demandeur-ass/demandeur-ass-beneficiaire-acre/creation-depuis-10-mois.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "20";
      const salaireNet = "1245";
      const distanceDomicileLieuTravail = "80";
      const nombreTrajetsDomicileTravailParSemaine = "3";
      // VARIABLES PAGE MA SITUATION
      const dateUtileTests = new DateUtileTests();
      const nationalite = NationalitesEnum.FRANCAISE;
      const dateRepriseCreationEntreprise = dateUtileTests.getDateRepriseCreationEntrepriseDepuisXMois(10);
      // VARIABLES PAGE PERSONNES A CHARGE
      const dateNaissancePersonne1 = dateUtileTests.getDateNaissanceFromAge(9);
      // VARIABLES PAGE MES RESSOURCES
      const allocationJournaliereNetASS = "16.49";
      const revenusIndependant = "1000";
      const allocationSoutienFamiliale = "117";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantAideMobilite = "504";
      const montantAgepi = "400";
      const montantPrimeActiviteM5_M6 = "97";

      const homePage = new HomePage();
      homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAssIdentifiant, environment.peConnectUserMotDePasse);

      const avantDeCommencerPage = new AvantDeCommencerPage();
      avantDeCommencerPage.clickOnJeCommence();

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaireNet);
      monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnNombreTrajetsParSemaine(nombreTrajetsDomicileTravailParSemaine);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationIndependant();
      maSituationPage.clickOnSituationBeneficiaireACREOui();
      maSituationPage.saisirDateCreationRepriseEntreprise(dateRepriseCreationEntreprise.jour, dateRepriseCreationEntreprise.mois, dateRepriseCreationEntreprise.annee);
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnAjouterUnePersonneACharge();
      personnesAChargePage.saisirDateNaissance(dateNaissancePersonne1.jour, dateNaissancePersonne1.mois, dateNaissancePersonne1.annee);
      personnesAChargePage.clickOnValider();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.saisirAllocationJournaliereNetASS(allocationJournaliereNetASS);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.saisirRevenusIndependant(revenusIndependant);
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.selectionnerProprietaire();
      ressourcesActuellesPage.saisirAllocationSoutienFamilialeFoyer(allocationSoutienFamiliale);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE, 1);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, 2, montantAideMobilite);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI, 2, montantAgepi);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE, 2);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaireNet);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaireNet);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActiviteM5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActiviteM5_M6);
      resultatMaSimulationPage.clickOnRetour();

      const headerSection = new HeaderSection();
      headerSection.clickOnSeDeconnecter();

    });

  it('En tant que demandeur emploi célibataire,' +
    'enfant à charge de 9 ans, asf 117€,' +
    'montant net journalier ASS = 16,89€,' +
    'bénéficiaire de l\'ACRE depuis 12 mois' +
    'travaillé avant simulation : M0 0€, M-1 0€, M-2 0€' +
    'futur contrat CDI, salaire 1245€ net, 20h/semaine,' +
    'kilométrage domicile -> taf = 80kms + 12 trajets', () => {

      cy.intercept('POST', '**/simulation_aides', { fixture: 'mocks/demandeur-ass/demandeur-ass-beneficiaire-acre/creation-depuis-12-mois.json' })

      // VARIABLES PAGE FUTUR CONTRAT
      const dureeHebdomadaire = "20";
      const salaireNet = "1245";
      const distanceDomicileLieuTravail = "80";
      const nombreTrajetsDomicileTravailParSemaine = "3";
      // VARIABLES PAGE MA SITUATION
      const dateUtileTests = new DateUtileTests();
      const nationalite = NationalitesEnum.FRANCAISE;
      const dateRepriseCreationEntreprise = dateUtileTests.getDateRepriseCreationEntrepriseDepuisXMois(12);
      // VARIABLES PAGE PERSONNES A CHARGE
      const dateNaissancePersonne1 = dateUtileTests.getDateNaissanceFromAge(9);
      // VARIABLES PAGE MES RESSOURCES
      const allocationJournaliereNetASS = "16.49";
      const revenusIndependant = "1000";
      const allocationSoutienFamiliale = "117";
      // VARIABLES PAGE RESULTAT SIMULATION
      const montantAideMobilite = "504";
      const montantAgepi = "400";
      const montantPrimeActiviteM5_M6 = "97";

      const homePage = new HomePage();
      homePage.clickOnSeConnecterAvecPoleEmploi(environment.peConnectUserAssIdentifiant, environment.peConnectUserMotDePasse);

      const avantDeCommencerPage = new AvantDeCommencerPage();
      avantDeCommencerPage.clickOnJeCommence();

      const monFuturContratTravailPage = new MonFuturContratTravailPage();
      monFuturContratTravailPage.clickOnHasOffreEmploiOui();
      monFuturContratTravailPage.clickOnTypeContratCDI();
      monFuturContratTravailPage.saisirDureeHebdomadaire(dureeHebdomadaire);
      monFuturContratTravailPage.saisirSalaireMensuelNet(salaireNet);
      monFuturContratTravailPage.saisirDistanceDomicileLieuTravail(distanceDomicileLieuTravail);
      monFuturContratTravailPage.clickOnNombreTrajetsParSemaine(nombreTrajetsDomicileTravailParSemaine);
      monFuturContratTravailPage.clickOnSuivant();

      const maSituationPage = new MaSituationPage();
      maSituationPage.selectNationalite(nationalite);
      maSituationPage.clickOnSituationIndependant();
      maSituationPage.clickOnSituationBeneficiaireACREOui();
      maSituationPage.saisirDateCreationRepriseEntreprise(dateRepriseCreationEntreprise.jour, dateRepriseCreationEntreprise.mois, dateRepriseCreationEntreprise.annee);
      maSituationPage.clickOnSituationFamilialeSeul();
      maSituationPage.clickOnSuivant();

      const personnesAChargePage = new PersonnesAChargePage();
      personnesAChargePage.clickOnAjouterUnePersonneACharge();
      personnesAChargePage.saisirDateNaissance(dateNaissancePersonne1.jour, dateNaissancePersonne1.mois, dateNaissancePersonne1.annee);
      personnesAChargePage.clickOnValider();
      personnesAChargePage.clickOnSuivant();

      const ressourcesActuellesPage = new RessourcesActuellesPage();
      ressourcesActuellesPage.saisirAllocationJournaliereNetASS(allocationJournaliereNetASS);
      ressourcesActuellesPage.clickOnAvezVousTravailleAuCoursDesDerniersMoisNon();
      ressourcesActuellesPage.saisirRevenusIndependant(revenusIndependant);
      ressourcesActuellesPage.clickOnValiderVosRessources();

      ressourcesActuellesPage.selectionnerProprietaire();
      ressourcesActuellesPage.saisirAllocationSoutienFamilialeFoyer(allocationSoutienFamiliale);
      ressourcesActuellesPage.clickOnValiderRessourcesFoyer();

      ressourcesActuellesPage.clickOnObtenirMaSimulation();

      const resultatMaSimulationPage = new ResultatMaSimulationPage();
      resultatMaSimulationPage.checkMontantRevenusEtAidesActuelles();
      //premier mois
      resultatMaSimulationPage.clickOnMois(1);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 1, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE, 1);
      resultatMaSimulationPage.clickOnRetour();
      //deuxième mois
      resultatMaSimulationPage.clickOnMois(2);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 2, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AIDE_MOBILITE, 2, montantAideMobilite);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.AGEPI, 2, montantAgepi);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE, 2);
      resultatMaSimulationPage.clickOnRetour();
      //troisième mois
      resultatMaSimulationPage.clickOnMois(3);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 3, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciereNotEmpty(CodesAidesEnum.ALLOCATION_SOLIDARITE_SPECIFIQUE, 3);
      resultatMaSimulationPage.clickOnRetour();
      //quatrième mois
      resultatMaSimulationPage.clickOnMois(4);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 4, salaireNet);
      resultatMaSimulationPage.clickOnRetour();
      //cinquième mois
      resultatMaSimulationPage.clickOnMois(5);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 5, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 5, montantPrimeActiviteM5_M6);
      resultatMaSimulationPage.clickOnRetour();
      //sixième mois
      resultatMaSimulationPage.clickOnMois(6);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.SALAIRE, 6, salaireNet);
      resultatMaSimulationPage.checkMontantRessourceFinanciere(CodesAidesEnum.PRIME_ACTIVITE, 6, montantPrimeActiviteM5_M6);
      resultatMaSimulationPage.clickOnRetour();

      const headerSection = new HeaderSection();
      headerSection.clickOnSeDeconnecter();

    });
});