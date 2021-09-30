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
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { SituationFamiliale } from '@models/situation-familiale';
import { SessionStorageEstimeService } from '../storage/session-storage-estime.service';
import { BrutNetService } from '../utile/brut-net.service';
import { RessourcesFinancieresUtileService } from '../utile/ressources-financieres-utiles.service';


@Injectable({ providedIn: 'root' })
export class DeConnecteService {

  private demandeurEmploiConnecte: DemandeurEmploi;

  constructor(
    private brutNetService: BrutNetService,
    private numberUtileService: NumberUtileService,
    private personneUtileService: PersonneUtileService,
    private ressourcesFinancieresUtileService: RessourcesFinancieresUtileService,
    private sessionStorageEstimeService: SessionStorageEstimeService
  ) {

  }

  public getDemandeurEmploiConnecte(): DemandeurEmploi {
    if (!this.demandeurEmploiConnecte) {
      this.demandeurEmploiConnecte = this.sessionStorageEstimeService.getDemandeurEmploiConnected();
    }
    return this.demandeurEmploiConnecte;
  }

  public hasRessourcesFinancieres(): boolean {
    return this.demandeurEmploiConnecte.ressourcesFinancieres !== null;
  }

  public setAidesFamiliales(): void {
    this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesFamiliales = this.ressourcesFinancieresUtileService.creerAidesFamiliales();
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setBeneficiaireAides(beneficiaireAides: BeneficiaireAides): void {
    this.demandeurEmploiConnecte.beneficiaireAides = beneficiaireAides;
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setConjointRessourcesFinancieres(conjoint: Personne) {
    if(conjoint.ressourcesFinancieres.salaire) {
      conjoint.ressourcesFinancieres.salaire.montantBrut = this.brutNetService.getBrutFromNet(conjoint.ressourcesFinancieres.salaire.montantNet);
    }
    const ressourcesFinancieresMontantsAvecDot = this.ressourcesFinancieresUtileService.replaceCommaByDotMontantsRessourcesFinancieres(conjoint.ressourcesFinancieres);
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres = ressourcesFinancieresMontantsAvecDot;
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
    futurTravail.salaire.montantNet = this.numberUtileService.replaceCommaByDot(futurTravail.salaire.montantNet);
    futurTravail.nombreHeuresTravailleesSemaine = this.numberUtileService.replaceCommaByDot(futurTravail.nombreHeuresTravailleesSemaine);
    this.demandeurEmploiConnecte.futurTravail = futurTravail;
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setAllocationMensuelleNetASS(): void {
    this.setAidesPoleEmploi();
    if(this.demandeurEmploiConnecte.ressourcesFinancieres.aidesPoleEmploi
      && !this.demandeurEmploiConnecte.ressourcesFinancieres.aidesPoleEmploi.allocationASS) {
        this.demandeurEmploiConnecte.ressourcesFinancieres.aidesPoleEmploi.allocationASS = this.ressourcesFinancieresUtileService.creerAllocationASS();
      }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setAidesPoleEmploi() : void {
    if(!this.demandeurEmploiConnecte.ressourcesFinancieres.aidesPoleEmploi) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.aidesPoleEmploi = this.ressourcesFinancieresUtileService.creerAidesPoleEmploi();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setPensionInvalidite(): void {
    this.setAidesCPAM();
    if(this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM
      && ( !this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.pensionInvalidite
        || !this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite)) {
          this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.pensionInvalidite = null;
          this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite = null;
      }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setAidesCPAM() : void {
    if(!this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM = this.ressourcesFinancieresUtileService.creerAidesCPAM();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setPersonnesACharge(personnesACharge: Array<Personne>) {
    this.demandeurEmploiConnecte.situationFamiliale.personnesACharge = personnesACharge;
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setPersonnesChargeRessourcesFinancieres(personnesDTO: Array<PersonneDTO>): void {
    personnesDTO.forEach(personneDTO => {
      if(personneDTO.personne.ressourcesFinancieres.salaire) {
        personneDTO.personne.ressourcesFinancieres.salaire.montantBrut = this.brutNetService.getBrutFromNet(personneDTO.personne.ressourcesFinancieres.salaire.montantNet);
      }
      personneDTO.personne.ressourcesFinancieres = this.ressourcesFinancieresUtileService.replaceCommaByDotMontantsRessourcesFinancieres(personneDTO.personne.ressourcesFinancieres);
      this.demandeurEmploiConnecte.situationFamiliale.personnesACharge[personneDTO.index].ressourcesFinancieres = personneDTO.personne.ressourcesFinancieres;
    });
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setRessourcesFinancieres(ressourcesFinancieres: RessourcesFinancieres) {
    if(ressourcesFinancieres.periodeTravailleeAvantSimulation) {
      this.setMontantsBrutSalairesAvantPeriodeSimulation(ressourcesFinancieres.periodeTravailleeAvantSimulation);
      this.setSansSalaire(ressourcesFinancieres.periodeTravailleeAvantSimulation);
    }
    const ressourcesFinancieresMontantsAvecDot = this.ressourcesFinancieresUtileService.replaceCommaByDotMontantsRessourcesFinancieres(ressourcesFinancieres);
    this.demandeurEmploiConnecte.ressourcesFinancieres = ressourcesFinancieresMontantsAvecDot;
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setSituationFamiliale(situationFamiliale: SituationFamiliale): void {
    if(!situationFamiliale.isEnCouple) {
      this.unsetConjoint();
    } else if(!situationFamiliale.conjoint) {
      situationFamiliale.conjoint = this.personneUtileService.creerPersonne(true);
    }
    this.demandeurEmploiConnecte.situationFamiliale = situationFamiliale;
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public unsetAidesFamiliales(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesFamiliales) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesFamiliales = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetAlloctionPAJE(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesFamiliales) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesFamiliales.prestationAccueilJeuneEnfant = 0;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetAllocationsFamiliales(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesFamiliales) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesFamiliales.allocationsFamiliales = 0;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetAllocationMensuelleNetAAH(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.allocationAAH = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
    if(this.demandeurEmploiConnecte.ressourcesFinancieres.periodeTravailleeAvantSimulation) {
      if(this.demandeurEmploiConnecte.beneficiaireAides.beneficiaireASS) {
        if(this.demandeurEmploiConnecte.ressourcesFinancieres.nombreMoisTravaillesDerniersMois == 1) {
          this.demandeurEmploiConnecte.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins1.salaire.montantNet = 0;
          this.demandeurEmploiConnecte.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins1.salaire.montantBrut = 0;
          this.demandeurEmploiConnecte.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins2.salaire.montantNet = 0;
          this.demandeurEmploiConnecte.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins2.salaire.montantBrut = 0;
        }
        if(this.demandeurEmploiConnecte.ressourcesFinancieres.nombreMoisTravaillesDerniersMois == 2) {
          this.demandeurEmploiConnecte.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins2.salaire.montantNet = 0;
          this.demandeurEmploiConnecte.ressourcesFinancieres.periodeTravailleeAvantSimulation.moisMoins2.salaire.montantBrut = 0;
        }
      }
    }
  }

  public unsetAllocationMensuelleNetASS(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesPoleEmploi
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesPoleEmploi.allocationASS) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.aidesPoleEmploi.allocationASS.allocationJournaliereNet = 0;
      this.demandeurEmploiConnecte.ressourcesFinancieres.aidesPoleEmploi.allocationASS.dateDerniereOuvertureDroit = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetInfosRSA(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.allocationRSA = 0;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
    if(this.demandeurEmploiConnecte.situationFamiliale) {
      this.demandeurEmploiConnecte.situationFamiliale.isSeulPlusDe18Mois = null;
    }
    if(this.demandeurEmploiConnecte.informationsPersonnelles) {
      this.demandeurEmploiConnecte.informationsPersonnelles.isProprietaireSansPretOuLogeGratuit = null;
    }
  }

  public unsetAPL(): void {
    if(this.demandeurEmploiConnecte.ressourcesFinancieres
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement) {
        this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins1 = 0;
        this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins2 = 0;
        this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement.aidePersonnaliseeLogement.moisNMoins3 = 0;
        this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
      }
  }

  public unsetALF(): void {
    if(this.demandeurEmploiConnecte.ressourcesFinancieres
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale) {
        this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins1 = 0;
        this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins2 = 0;
        this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementFamiliale.moisNMoins3 = 0;
        this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
      }
  }

  public unsetALS(): void {
    if(this.demandeurEmploiConnecte.ressourcesFinancieres
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement
      && this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale) {
        this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins1 = 0;
        this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins2 = 0;
        this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.aidesLogement.allocationLogementSociale.moisNMoins3 = 0;
        this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
      }
  }

  public setAllocationRSA(): void {
    this.setAidesCAF();
    if(this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF
      && !this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.allocationRSA) {
        this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.allocationRSA = null;
        this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF.prochaineDeclarationTrimestrielle = null;
      }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }


  public setAidesCAF() : void {
    if(!this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCAF = this.ressourcesFinancieresUtileService.creerAidesCAF();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public unsetPensionInvalidite(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres &&
      this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.pensionInvalidite = null;
      this.demandeurEmploiConnecte.ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetSalairesAvantPeriodeSimulation(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres &&
      this.demandeurEmploiConnecte.ressourcesFinancieres.periodeTravailleeAvantSimulation) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.periodeTravailleeAvantSimulation = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
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
      if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCAF) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCAF.allocationAAH = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public setConjointAllocationAAH() : void {
    this.setConjointAidesCAF();
    if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCAF
      && !this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCAF.allocationAAH) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCAF.allocationAAH = null;
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public unsetConjointAllocationARE(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAides.beneficiaireARE = false;
      if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesPoleEmploi
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesPoleEmploi.allocationARE) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesPoleEmploi.allocationARE.allocationMensuelleNet = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public setConjointAllocationARE() : void {
    this.setConjointAidesPoleEmploi();
    if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesPoleEmploi
      && !this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesPoleEmploi.allocationARE) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesPoleEmploi.allocationARE = this.ressourcesFinancieresUtileService.creerAllocationARE();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public unsetConjointAllocationASS(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAides.beneficiaireASS = false;
      if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesPoleEmploi
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesPoleEmploi.allocationASS) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesPoleEmploi.allocationASS.allocationMensuelleNet = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public setConjointAllocationASS(): void {
    this.setConjointAidesPoleEmploi();
    if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesPoleEmploi
      && !this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesPoleEmploi.allocationASS) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesPoleEmploi.allocationASS = this.ressourcesFinancieresUtileService.creerAllocationASS();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public unsetConjointAllocationRSA(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAides.beneficiaireRSA = false;
      if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
      && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCAF) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCAF.allocationRSA = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public setConjointAllocationRSA(): void {
    this.setConjointAidesCAF();
    if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCAF
      && !this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCAF.allocationRSA) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCAF.allocationRSA = null;
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCAF.prochaineDeclarationTrimestrielle = null;
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public unsetConjointPensionInvalidite(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAides.beneficiairePensionInvalidite = false;
      if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesPoleEmploi) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCPAM.pensionInvalidite = null;
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public setConjointPensionInvalidite(): void {
    this.setConjointAidesCPAM();
    if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCPAM
      && !this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCPAM.pensionInvalidite) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCPAM.pensionInvalidite = null;
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCPAM.allocationSupplementaireInvalidite = null;
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public unsetConjointRessourcesFinancieres(): void {
    if(this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjointRevenusMicroEntrepreneur(): void {
    if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.microEntrepreneur = false;
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.revenusMicroEntreprise3DerniersMois = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjointBeneficesTravailleurIndependant(): void {
    if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.travailleurIndependant = false;
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.beneficesTravailleurIndependantDernierExercice = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjointSalaire(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.salarie = false;
      if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.salaire = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetRevenusMicroEntrepreneur(): void {
    if(this.demandeurEmploiConnecte.ressourcesFinancieres) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.revenusMicroEntreprise3DerniersMois = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetBeneficesTravailleurIndependant(): void {
    if(this.demandeurEmploiConnecte.ressourcesFinancieres) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.beneficesTravailleurIndependantDernierExercice = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetRevenusImmobilier(): void {
    if(this.demandeurEmploiConnecte.ressourcesFinancieres) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  private setConjointAidesCAF(): void {
    if(!this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCAF) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCAF = this.ressourcesFinancieresUtileService.creerAidesCAF();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  private setConjointAidesCPAM(): void {
    if(!this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCPAM) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesCPAM = this.ressourcesFinancieresUtileService.creerAidesCPAM();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  private setConjointAidesPoleEmploi(): void {
    if(!this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesPoleEmploi) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.aidesPoleEmploi = this.ressourcesFinancieresUtileService.creerAidesPoleEmploi();
    }
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  private setMontantsBrutSalairesAvantPeriodeSimulation(periodeTravailleeAvantSimulation: PeriodeTravailleeAvantSimulation):void {
    if(periodeTravailleeAvantSimulation.moisMoins1 && periodeTravailleeAvantSimulation.moisMoins1.salaire.montantNet) {
      periodeTravailleeAvantSimulation.moisMoins1.salaire.montantBrut = this.brutNetService.getBrutFromNet(periodeTravailleeAvantSimulation.moisMoins1.salaire.montantNet);
    }
    if(periodeTravailleeAvantSimulation.moisMoins2 && periodeTravailleeAvantSimulation.moisMoins2.salaire.montantNet) {
      periodeTravailleeAvantSimulation.moisMoins2.salaire.montantBrut = this.brutNetService.getBrutFromNet(periodeTravailleeAvantSimulation.moisMoins2.salaire.montantNet);
    }
    if(periodeTravailleeAvantSimulation.moisMoins3 && periodeTravailleeAvantSimulation.moisMoins3.salaire.montantNet) {
      periodeTravailleeAvantSimulation.moisMoins3.salaire.montantBrut = this.brutNetService.getBrutFromNet(periodeTravailleeAvantSimulation.moisMoins3.salaire.montantNet);
    }
  }

  private setSansSalaire(periodeTravailleeAvantSimulation: PeriodeTravailleeAvantSimulation):void {
    if(periodeTravailleeAvantSimulation.moisMoins1) {
      periodeTravailleeAvantSimulation.moisMoins1.isSansSalaire = periodeTravailleeAvantSimulation.moisMoins1.salaire.montantNet === 0;
    }
    if(periodeTravailleeAvantSimulation.moisMoins2) {
      periodeTravailleeAvantSimulation.moisMoins2.isSansSalaire = periodeTravailleeAvantSimulation.moisMoins2.salaire.montantNet === 0;
    }
    if(periodeTravailleeAvantSimulation.moisMoins3) {
      periodeTravailleeAvantSimulation.moisMoins3.isSansSalaire = periodeTravailleeAvantSimulation.moisMoins3.salaire.montantNet === 0;
    }
  }
}