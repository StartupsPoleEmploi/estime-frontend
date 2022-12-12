import { Injectable } from '@angular/core';
import { PeriodeTravailleeAvantSimulation } from '@app/commun/models/periode-travaillee-avant-simulation';
import { NumberUtileService } from "@app/core/services/utile/number-util.service";
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { BeneficiaireAides } from '@app/commun/models/beneficiaire-aides';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { PersonneDTO } from '@models/dto/personne-dto';
import { FuturTravail } from '@models/futur-travail';
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { Personne } from '@models/personne';
import { RessourcesFinancieresAvantSimulation } from '@app/commun/models/ressources-financieres-avant-simulation';
import { SituationFamiliale } from '@models/situation-familiale';
import { SessionStorageEstimeService } from '../storage/session-storage-estime.service';
import { SalaireService } from '../utile/salaire.service';
import { RessourcesFinancieresAvantSimulationUtileService } from '../utile/ressources-financieres-avant-simulation-utile.service';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';

@Injectable({ providedIn: 'root' })
export class DeConnecteService {

  private demandeurEmploiConnecte: DemandeurEmploi;

  constructor(
    private salaireService: SalaireService,
    private numberUtileService: NumberUtileService,
    private personneUtileService: PersonneUtileService,
    private ressourcesFinancieresAvantSimulationUtileService: RessourcesFinancieresAvantSimulationUtileService,
    private router: Router,
    private sessionStorageEstimeService: SessionStorageEstimeService
  ) { }

  /**
   * Si on tente un accès au composant etape-simulation ou à ses fils
   * sans qu'il y ait un demandeur d'emploi connecte présent dans le session storage du navigateur
   * alors on doit rediriger vers le composant avant-de-commencer.
   *
   * Ce cas peut arriver si on tente un accès direct par url à un des composant et que l'on est déjà pe connecté.
   */
  public controlerSiDemandeurEmploiConnectePresent(): void {
    const demandeurEmploiConnecte = this.getDemandeurEmploiConnecte();
    if (!demandeurEmploiConnecte) {
      this.router.navigate([RoutesEnum.CHOIX_TYPE_SIMULATION]);
    }
  }

  public unsetDemandeurEmploiConnecte(): void {
    this.demandeurEmploiConnecte = null;
  }

  public getDemandeurEmploiConnecte(): DemandeurEmploi {
    if (!this.demandeurEmploiConnecte) {
      this.demandeurEmploiConnecte = this.sessionStorageEstimeService.getDemandeurEmploiConnected();
    }
    return this.demandeurEmploiConnecte;
  }

  public hasRessourcesFinancieres(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation !== null;
  }

  public setAidesFamiliales(): void {
    this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales = this.ressourcesFinancieresAvantSimulationUtileService.creerAidesFamiliales();
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setBeneficiaireAides(beneficiaireAides: BeneficiaireAides): void {
    this.demandeurEmploiConnecte.beneficiaireAides = beneficiaireAides;
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setConjointRessourcesFinancieres(conjoint: Personne) {
    if (conjoint.ressourcesFinancieresAvantSimulation.salaire) {
      conjoint.ressourcesFinancieresAvantSimulation.salaire.montantMensuelBrut = this.salaireService.getBrutFromNet(conjoint.ressourcesFinancieresAvantSimulation.salaire.montantMensuelNet);
    }
    const ressourcesFinancieresMontantsAvecDot = this.ressourcesFinancieresAvantSimulationUtileService.replaceCommaByDotMontantsRessourcesFinancieresAvantSimulation(conjoint.ressourcesFinancieresAvantSimulation);
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation = ressourcesFinancieresMontantsAvecDot;
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setDemandeurEmploiConnecte(demandeurEmploi: DemandeurEmploi): void {
    this.demandeurEmploiConnecte = demandeurEmploi;
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setInformationsPersonnelles(informationsPersonnelles: InformationsPersonnelles): void {
    this.demandeurEmploiConnecte.informationsPersonnelles = informationsPersonnelles;
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setFuturTravail(futurTravail: FuturTravail) {
    futurTravail.salaire.montantMensuelNet = this.numberUtileService.replaceCommaByDot(futurTravail.salaire.montantMensuelNet);
    futurTravail.nombreHeuresTravailleesSemaine = this.numberUtileService.replaceCommaByDot(futurTravail.nombreHeuresTravailleesSemaine);
    this.demandeurEmploiConnecte.futurTravail = futurTravail;
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setAllocationMensuelleNetASS(): void {
    this.setAidesPoleEmploi();
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi
      && !this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS = this.ressourcesFinancieresAvantSimulationUtileService.creerAllocationASS();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setAllocationMensuelleNetARE(): void {
    this.setAidesPoleEmploi();
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi
      && !this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE = this.ressourcesFinancieresAvantSimulationUtileService.creerAllocationARE();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte)
  }

  public setAidesPoleEmploi(): void {
    if (!this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi = this.ressourcesFinancieresAvantSimulationUtileService.creerAidesPoleEmploi();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setPensionInvalidite(): void {
    this.setAidesCPAM();
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCPAM
      && !this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCPAM.pensionInvalidite) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCPAM.pensionInvalidite = null;
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setAidesCPAM(): void {
    if (!this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCPAM) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCPAM = this.ressourcesFinancieresAvantSimulationUtileService.creerAidesCPAM();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setPersonnesACharge(personnesACharge: Array<Personne>) {
    this.demandeurEmploiConnecte.situationFamiliale.personnesACharge = personnesACharge;
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setPersonnesChargeRessourcesFinancieres(personnesDTO: Array<PersonneDTO>): void {
    personnesDTO.forEach(personneDTO => {
      if (personneDTO.personne.ressourcesFinancieresAvantSimulation.salaire) {
        personneDTO.personne.ressourcesFinancieresAvantSimulation.salaire.montantMensuelBrut = this.salaireService.getBrutFromNet(personneDTO.personne.ressourcesFinancieresAvantSimulation.salaire.montantMensuelNet);
      }
      personneDTO.personne.ressourcesFinancieresAvantSimulation = this.ressourcesFinancieresAvantSimulationUtileService.replaceCommaByDotMontantsRessourcesFinancieresAvantSimulation(personneDTO.personne.ressourcesFinancieresAvantSimulation);
      this.demandeurEmploiConnecte.situationFamiliale.personnesACharge[personneDTO.index].ressourcesFinancieresAvantSimulation = personneDTO.personne.ressourcesFinancieresAvantSimulation;
    });
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setRessourcesFinancieres(ressourcesFinancieresAvantSimulation: RessourcesFinancieresAvantSimulation) {
    if (ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation) {
      this.setSansSalaire(ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation);
    }
    const ressourcesFinancieresAvantSimulationMontantsAvecDot = this.ressourcesFinancieresAvantSimulationUtileService.replaceCommaByDotMontantsRessourcesFinancieresAvantSimulation(ressourcesFinancieresAvantSimulation);
    this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation = ressourcesFinancieresAvantSimulationMontantsAvecDot;
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setSituationFamiliale(situationFamiliale: SituationFamiliale): void {
    if (!situationFamiliale.isEnCouple) {
      this.unsetConjoint();
    } else if (!situationFamiliale.conjoint) {
      situationFamiliale.conjoint = this.personneUtileService.creerPersonne(true);
    }
    this.demandeurEmploiConnecte.situationFamiliale = situationFamiliale;
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public unsetAidesFamiliales(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetAllocationPAJE(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales.prestationAccueilJeuneEnfant = 0;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetComplementFamilial(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales.complementFamilial = 0;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetAllocationsFamiliales(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesFamiliales.allocationsFamiliales = 0;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetAllocationMensuelleNetAAH(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.allocationAAH = 0;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetAllocationMensuelleNetARE(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationJournaliereBrute = null;
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.salaireJournalierReferenceBrut = null;
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.nombreJoursRestants = null;
    }
  }

  public unsetAllocationMensuelleNetASS(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.allocationJournaliereNet = 0;
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.dateDerniereOuvertureDroit = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetBeneficiaireACRE(): void {
    if (this.demandeurEmploiConnecte.informationsPersonnelles
      && this.demandeurEmploiConnecte.informationsPersonnelles.isBeneficiaireACRE != null) {
      this.demandeurEmploiConnecte.informationsPersonnelles.isBeneficiaireACRE = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetInfosRSA(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA = 0;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
    if (this.demandeurEmploiConnecte.situationFamiliale) {
      this.demandeurEmploiConnecte.situationFamiliale.isSeulPlusDe18Mois = null;
    }
  }

  public unsetAPL(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins1 = 0;
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins2 = 0;
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins3 = 0;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetALF(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins1 = 0;
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins2 = 0;
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins3 = 0;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetALS(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement
      && this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins1 = 0;
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins2 = 0;
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins3 = 0;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public setAllocationRSA(): void {
    this.setAidesCAF();
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF
      && !this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA = null;
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF.prochaineDeclarationTrimestrielle = null;
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }


  public setAidesCAF(): void {
    if (!this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCAF = this.ressourcesFinancieresAvantSimulationUtileService.creerAidesCAF();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public unsetPensionInvalidite(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation &&
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCPAM) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.aidesCPAM.pensionInvalidite = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetSalaire(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation &&
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.salaire) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.salaire = null;
      this.demandeurEmploiConnecte.informationsPersonnelles.hasCumulAncienEtNouveauSalaire = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetSalairesAvantPeriodeSimulation(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation &&
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.periodeTravailleeAvantSimulation = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetAides(): void {
    this.unsetAllocationMensuelleNetAAH();
    this.unsetAllocationMensuelleNetARE();
    this.unsetAllocationMensuelleNetASS();
    this.unsetBeneficiaireACRE();
    this.unsetInfosRSA();
    this.unsetPensionInvalidite();
  }

  public unsetRevenus() {
    this.unsetSalaire();
    this.unsetBeneficesMicroEntreprise();
    this.unsetRevenusImmobilier();
  }

  public unsetConjoint(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjointAides(): void {
    this.unsetConjointAllocationAAH();
    this.unsetConjointAllocationARE();
    this.unsetConjointAllocationASS();
    this.unsetConjointAllocationRSA();
    this.unsetConjointPensionInvalidite();
  }

  public unsetConjointAllocationAAH(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAides.beneficiaireAAH = false;
      if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCAF) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCAF.allocationAAH = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public setConjointAllocationAAH(): void {
    this.setConjointAidesCAF();
    if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCAF
      && !this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCAF.allocationAAH) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCAF.allocationAAH = null;
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public unsetConjointAllocationARE(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAides.beneficiaireARE = false;
      if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesPoleEmploi
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE.allocationMensuelleNet = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public setConjointAllocationARE(): void {
    this.setConjointAidesPoleEmploi();
    if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesPoleEmploi
      && !this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationARE = this.ressourcesFinancieresAvantSimulationUtileService.creerAllocationARE();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public unsetConjointAllocationASS(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAides.beneficiaireASS = false;
      if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesPoleEmploi
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS.allocationMensuelleNet = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public setConjointAllocationASS(): void {
    this.setConjointAidesPoleEmploi();
    if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesPoleEmploi
      && !this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesPoleEmploi.allocationASS = this.ressourcesFinancieresAvantSimulationUtileService.creerAllocationASS();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public unsetConjointAllocationRSA(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAides.beneficiaireRSA = false;
      if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCAF) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public setConjointAllocationRSA(): void {
    this.setConjointAidesCAF();
    if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCAF
      && !this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCAF.allocationRSA = null;
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCAF.prochaineDeclarationTrimestrielle = null;
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public unsetConjointPensionInvalidite(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAides.beneficiairePensionInvalidite = false;
      if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesPoleEmploi) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCPAM.pensionInvalidite = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public setConjointPensionInvalidite(): void {
    this.setConjointAidesCPAM();
    if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCPAM
      && !this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCPAM.pensionInvalidite) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCPAM.pensionInvalidite = null;
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public unsetConjointRessourcesFinancieres(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjointBeneficesMicroEntreprise(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isMicroEntrepreneur = false;
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.beneficesMicroEntrepriseDernierExercice = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjointChiffreAffairesIndependant(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isTravailleurIndependant = false;
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.chiffreAffairesIndependantDernierExercice = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjointRevenusImmobilier(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.hasRevenusImmobilier = false;
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.revenusImmobilier3DerniersMois = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjointPensionRetraite(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.hasPensionRetraite = false;
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.pensionRetraite = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjointSalaire(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.isSalarie = false;
      if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.salaire = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetBeneficesMicroEntreprise(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.beneficesMicroEntrepriseDernierExercice = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetRevenusImmobilier(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation) {
      this.demandeurEmploiConnecte.ressourcesFinancieresAvantSimulation.revenusImmobilier3DerniersMois = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  private setConjointAidesCAF(): void {
    if (!this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCAF) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCAF = this.ressourcesFinancieresAvantSimulationUtileService.creerAidesCAF();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  private setConjointAidesCPAM(): void {
    if (!this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCPAM) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesCPAM = this.ressourcesFinancieresAvantSimulationUtileService.creerAidesCPAM();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  private setConjointAidesPoleEmploi(): void {
    if (!this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesPoleEmploi) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieresAvantSimulation.aidesPoleEmploi = this.ressourcesFinancieresAvantSimulationUtileService.creerAidesPoleEmploi();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  private setMontantsBrutSalairesAvantPeriodeSimulation(periodeTravailleeAvantSimulation: PeriodeTravailleeAvantSimulation): void {
    periodeTravailleeAvantSimulation.mois.forEach(mois => {
      mois.salaire.montantMensuelBrut = this.salaireService.getBrutFromNet(mois.salaire.montantMensuelNet);
    });
  }

  private setSansSalaire(periodeTravailleeAvantSimulation: PeriodeTravailleeAvantSimulation): void {
    periodeTravailleeAvantSimulation.mois.forEach(mois => {
      mois.isSansSalaire = mois.salaire.montantMensuelNet === 0;
    });
  }

  public unsetStatutOccupationLogement(): void {
    this.demandeurEmploiConnecte.informationsPersonnelles.logement.statutOccupationLogement.isLocataireMeuble = false;
    this.demandeurEmploiConnecte.informationsPersonnelles.logement.statutOccupationLogement.isLocataireNonMeuble = false;
    this.demandeurEmploiConnecte.informationsPersonnelles.logement.statutOccupationLogement.isLocataireHLM = false;
    this.demandeurEmploiConnecte.informationsPersonnelles.logement.statutOccupationLogement.isProprietaire = false;
    this.demandeurEmploiConnecte.informationsPersonnelles.logement.statutOccupationLogement.isProprietaireAvecEmprunt = false;
    this.demandeurEmploiConnecte.informationsPersonnelles.logement.statutOccupationLogement.isLogeGratuitement = false;
  }

  public setIsLocataireMeuble(): void {
    this.demandeurEmploiConnecte.informationsPersonnelles.logement.statutOccupationLogement.isLocataireMeuble = true;
  }

  public setIsLocataireNonMeuble(): void {
    this.demandeurEmploiConnecte.informationsPersonnelles.logement.statutOccupationLogement.isLocataireNonMeuble = true;
  }

  public setIsLocataireHLM(): void {
    this.demandeurEmploiConnecte.informationsPersonnelles.logement.statutOccupationLogement.isLocataireHLM = true;
  }

  public setIsProprietaire(): void {
    this.demandeurEmploiConnecte.informationsPersonnelles.logement.statutOccupationLogement.isProprietaire = true;
  }

  public setIsProprietaireAvecEmprunt(): void {
    this.demandeurEmploiConnecte.informationsPersonnelles.logement.statutOccupationLogement.isProprietaireAvecEmprunt = true;
  }

  public setIsLogeGratuitement(): void {
    this.demandeurEmploiConnecte.informationsPersonnelles.logement.statutOccupationLogement.isLogeGratuitement = true;
  }
}