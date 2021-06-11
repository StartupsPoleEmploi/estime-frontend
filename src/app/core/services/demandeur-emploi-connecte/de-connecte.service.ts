import { Injectable } from '@angular/core';
import { NumberUtileService } from "@app/core/services/utile/number-util.service";
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { BeneficiaireAidesSociales } from '@models/beneficiaire-aides-sociales';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { PersonneDTO } from '@models/dto/personne-dto';
import { FuturTravail } from '@models/futur-travail';
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { Personne } from '@models/personne';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { SituationFamiliale } from '@models/situation-familiale';
import { SessionStorageEstimeService } from '../storage/session-storage-estime.service';
import { RessourcesFinancieresUtileService } from '../utile/ressources-financieres-utiles.service';


@Injectable({ providedIn: 'root' })
export class DeConnecteService {

  private demandeurEmploiConnecte: DemandeurEmploi;

  constructor(
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

  public setBeneficiaireAidesSociales(beneficiaireAidesSociales: BeneficiaireAidesSociales): void {
    this.demandeurEmploiConnecte.beneficiaireAidesSociales = beneficiaireAidesSociales;
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setConjointRessourcesFinancieres(conjoint: Personne) {
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
    futurTravail.salaireMensuelNet = this.numberUtileService.replaceCommaByDot(futurTravail.salaireMensuelNet);
    futurTravail.nombreHeuresTravailleesSemaine = this.numberUtileService.replaceCommaByDot(futurTravail.nombreHeuresTravailleesSemaine);
    this.demandeurEmploiConnecte.futurTravail = futurTravail;
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setPersonnesACharge(personnesACharge: Array<Personne>) {
    this.demandeurEmploiConnecte.situationFamiliale.personnesACharge = personnesACharge;
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setPersonnesChargeRessourcesFinancieres(personnesDTO: Array<PersonneDTO>): void {
    personnesDTO.forEach(personneDTO => {
      personneDTO.personne.ressourcesFinancieres = this.ressourcesFinancieresUtileService.replaceCommaByDotMontantsRessourcesFinancieres(personneDTO.personne.ressourcesFinancieres);
      this.demandeurEmploiConnecte.situationFamiliale.personnesACharge[personneDTO.index].ressourcesFinancieres = personneDTO.personne.ressourcesFinancieres;
    });
    this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
  }

  public setRessourcesFinancieres(ressourcesFinancieres: RessourcesFinancieres) {
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

  public unsetAllocationsFamiliales(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres &&
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF.allocationsFamilialesMensuellesNetFoyer = 0;
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF.prestationAccueilJeuneEnfant = 0;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetAlloctionPAJE(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres &&
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF.prestationAccueilJeuneEnfant = 0;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetAllocationMensuelleNetAAH(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres
      && this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
    if(this.demandeurEmploiConnecte.ressourcesFinancieres.salairesAvantPeriodeSimulation) {
      if(this.demandeurEmploiConnecte.beneficiaireAidesSociales.beneficiaireASS) {
        if(this.demandeurEmploiConnecte.ressourcesFinancieres.nombreMoisTravaillesDerniersMois == 1) {
          this.demandeurEmploiConnecte.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisDemandeSimulation = 0;
          this.demandeurEmploiConnecte.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisMoins1MoisDemandeSimulation = 0;
        }
        if(this.demandeurEmploiConnecte.ressourcesFinancieres.nombreMoisTravaillesDerniersMois == 2) {
          this.demandeurEmploiConnecte.ressourcesFinancieres.salairesAvantPeriodeSimulation.salaireMoisMoins1MoisDemandeSimulation = 0;
        }
      }
    }
  }

  public unsetAllocationMensuelleNetASS(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres
      && this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsPoleEmploi) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsPoleEmploi.allocationJournaliereNet = null;
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsPoleEmploi.dateDerniereOuvertureDroitASS = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetInfosRSA(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres
      && this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
    if(this.demandeurEmploiConnecte.situationFamiliale) {
      this.demandeurEmploiConnecte.situationFamiliale.isSeulPlusDe18Mois = null;
    }
    if(this.demandeurEmploiConnecte.informationsPersonnelles) {
      this.demandeurEmploiConnecte.informationsPersonnelles.isProprietaireSansPretOuLogeGratuit = null;
    }
  }

  public unsetPensionInvalidite(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres &&
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM.pensionInvalidite = null;
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCPAM.allocationSupplementaireInvalidite = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetSalairesAvantPeriodeSimulation(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres &&
      this.demandeurEmploiConnecte.ressourcesFinancieres.salairesAvantPeriodeSimulation) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.salairesAvantPeriodeSimulation = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjoint(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjointtAllocationsAidesSociales(): void {
    this.unsetConjointAllocationAAH();
    this.unsetConjointAllocationARE();
    this.unsetConjointAllocationASS();
    this.unsetConjointAllocationRSA();
    this.unsetConjointPensionInvalidite();
  }

  public unsetConjointAllocationAAH(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireAAH = false;
      if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjointAllocationARE(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireARE = false;
      if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNet = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjointAllocationASS(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireASS = false;
      if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNet = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjointAllocationRSA(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireRSA = false;
      if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
      && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjointPensionInvalidite(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiairePensionInvalidite = false;
      if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCPAM.pensionInvalidite = null;
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCPAM.allocationSupplementaireInvalidite = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjointRessourcesFinancieres(): void {
    if(this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetConjointSalaire(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.salarie = false;
      if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.salaireNet = null;
      }
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetPensionsAlimentaires(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres
      && this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF.pensionsAlimentairesFoyer = 0;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetRevenusCreateurEntreprise(): void {
    if(this.demandeurEmploiConnecte.ressourcesFinancieres) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

  public unsetRevenusImmobilier(): void {
    if(this.demandeurEmploiConnecte.ressourcesFinancieres) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois = null;
      this.sessionStorageEstimeService.storeDemandeurEmploiConnecte(this.demandeurEmploiConnecte);
    }
  }

}