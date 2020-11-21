import { Injectable } from '@angular/core';
import { NumberUtileService } from "@app/core/services/utile/number-util.service";
import { KeysSessionStorageEnum } from "@enumerations/keys-session-storage.enum";
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { PersonneDTO } from '@models/dto/personne-dto';
import { FuturTravail } from '@models/futur-travail';
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { Personne } from '@models/personne';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { SituationFamiliale } from '@models/situation-familiale';
import { SessionStorageService } from "ngx-webstorage";
import { RessourcesFinancieresUtileService } from '../utile/ressources-financieres-utiles.service';
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { AllocationsCAF } from '@app/commun/models/allocations-caf';
import { AllocationsPoleEmploi } from '@app/commun/models/allocations-pole-emploi';
import { SimulationMensuelle } from '@app/commun/models/simulation-mensuelle';
import { BeneficiaireAidesSociales } from '@app/commun/models/beneficiaire-aides-sociales';


@Injectable({ providedIn: 'root' })
export class DeConnecteService {

  private demandeurEmploiConnecte: DemandeurEmploi;

  constructor(
    private numberUtileService: NumberUtileService,
    private personneUtileService: PersonneUtileService,
    private ressourcesFinancieresUtileService: RessourcesFinancieresUtileService,
    private sessionStorageService: SessionStorageService
  ) {

  }

  public calculerMontantTotalRessourcesMois(simulation: SimulationMensuelle): number {
    const ressourcesFinancieres = this.demandeurEmploiConnecte.ressourcesFinancieres;

    const salaireFuturTravail = this.numberUtileService.getMontantSafe(this.demandeurEmploiConnecte.futurTravail.salaireMensuelNet);
    const montantAllocationsPoleEmploi = this.calculerMontantAllocationsPoleEmploi(ressourcesFinancieres.allocationsPoleEmploi);
    const montantAllocationsCAF = this.calculerMontantAllocationsCAF(ressourcesFinancieres.allocationsCAF);
    const montantTotalAidesMoisSimule = this.calculerMontantAidesSimuleesMois(simulation);

    return salaireFuturTravail + montantAllocationsPoleEmploi + montantAllocationsCAF + montantTotalAidesMoisSimule;
  }

  public getDemandeurEmploiConnecte(): DemandeurEmploi {
    if (!this.demandeurEmploiConnecte) {
      this.demandeurEmploiConnecte = this.sessionStorageService.retrieve(KeysSessionStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
    }
    return this.demandeurEmploiConnecte;
  }

  public setBeneficiaireAidesSociales(beneficiaireAidesSociales: BeneficiaireAidesSociales): void {
    this.demandeurEmploiConnecte.beneficiaireAidesSociales = beneficiaireAidesSociales;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public setConjointRessourcesFinancieres(conjoint: Personne) {
    const ressourcesFinancieresMontantsAvecDot = this.ressourcesFinancieresUtileService.replaceCommaByDotMontantsRessourcesFinancieres(conjoint.ressourcesFinancieres);
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres = ressourcesFinancieresMontantsAvecDot;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public setDemandeurEmploiConnecte(demandeurEmploi: DemandeurEmploi): void {
    this.demandeurEmploiConnecte = demandeurEmploi;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public setInformationsPersonnelles(informationsPersonnelles: InformationsPersonnelles): void {
    this.demandeurEmploiConnecte.informationsPersonnelles = informationsPersonnelles;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public setFuturTravail(futurTravail: FuturTravail) {
    futurTravail.salaireMensuelNet = this.numberUtileService.replaceCommaByDot(futurTravail.salaireMensuelNet);
    futurTravail.nombreHeuresTravailleesSemaine = this.numberUtileService.replaceCommaByDot(futurTravail.nombreHeuresTravailleesSemaine);
    this.demandeurEmploiConnecte.futurTravail = futurTravail;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public setPersonnesACharge(personnesACharge: Array<Personne>) {
    this.demandeurEmploiConnecte.situationFamiliale.personnesACharge = personnesACharge;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public setPersonnesChargeRessourcesFinancieres(personnesDTO: Array<PersonneDTO>): void {
    personnesDTO.forEach(personneDTO => {
      personneDTO.personne.ressourcesFinancieres = this.ressourcesFinancieresUtileService.replaceCommaByDotMontantsRessourcesFinancieres(personneDTO.personne.ressourcesFinancieres);
      this.demandeurEmploiConnecte.situationFamiliale.personnesACharge[personneDTO.index].ressourcesFinancieres = personneDTO.personne.ressourcesFinancieres;
    });
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public setRessourcesFinancieres(ressourcesFinancieres: RessourcesFinancieres) {
    const ressourcesFinancieresMontantsAvecDot = this.ressourcesFinancieresUtileService.replaceCommaByDotMontantsRessourcesFinancieres(ressourcesFinancieres);
    this.demandeurEmploiConnecte.ressourcesFinancieres = ressourcesFinancieresMontantsAvecDot;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public setSituationFamiliale(situationFamiliale: SituationFamiliale): void {
    if(!situationFamiliale.isEnCouple) {
      this.unsetConjoint();
    } else if(!situationFamiliale.conjoint) {
      situationFamiliale.conjoint = this.personneUtileService.creerPersonne();
    }
    this.demandeurEmploiConnecte.situationFamiliale = situationFamiliale;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public unsetAllocationsFamiliales(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF.allocationsFamilialesMensuellesNetFoyer = 0;
      this.saveDemandeurEmploiConnecteInSessionStorage();
    }
  }

  public unsetAllocationMensuelleNetAAH(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = null;
      this.saveDemandeurEmploiConnecteInSessionStorage();
    }
  }

  public unsetConjoint(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint = null;
      this.saveDemandeurEmploiConnecteInSessionStorage();
    }
  }

  public unsetConjointtAllocationsAidesSociales(): void {
    this.unsetConjointAllocationAAH();
    this.unsetConjointAllocationARE();
    this.unsetConjointAllocationASS();
    this.unsetConjointAllocationRSA();
  }

  public unsetConjointAllocationAAH(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireAAH = false;
      if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = 0;
      }
      this.saveDemandeurEmploiConnecteInSessionStorage();
    }
  }

  public unsetConjointAllocationARE(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireARE = false;
      if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE = 0;
      }
      this.saveDemandeurEmploiConnecteInSessionStorage();
    }
  }

  public unsetConjointAllocationASS(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireASS = false;
      if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS = 0;
      }
      this.saveDemandeurEmploiConnecteInSessionStorage();
    }
  }

  public unsetConjointAllocationRSA(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireRSA = false;
      if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
      && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = 0;
      }
      this.saveDemandeurEmploiConnecteInSessionStorage();
    }
  }

  public unsetConjointRessourcesFinancieres(): void {
    this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres = null;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public unsetConjointSalaire(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.informationsPersonnelles.salarie = false;
      if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.salaireNet = 0;
      }
      this.saveDemandeurEmploiConnecteInSessionStorage();
    }
  }

  public unsetPensionsAlimentaires(): void {
    if (this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF) {
      this.demandeurEmploiConnecte.ressourcesFinancieres.allocationsCAF.pensionsAlimentairesFoyer = 0;
      this.saveDemandeurEmploiConnecteInSessionStorage();
    }
  }

  public unsetRevenusCreateurEntreprise(): void {
    this.demandeurEmploiConnecte.ressourcesFinancieres.revenusCreateurEntreprise3DerniersMois = null;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public unsetRevenusImmobilier(): void {
    this.demandeurEmploiConnecte.ressourcesFinancieres.revenusImmobilier3DerniersMois = null;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  /************** private methods *********************************************/

  private calculerMontantAidesSimuleesMois(simulation: SimulationMensuelle) {
    let montant = 0;
    if (simulation.mesAides) {
      for (let [codeAide, aide] of Object.entries(simulation.mesAides)) {
        if (aide) {
          montant += this.numberUtileService.getMontantSafe(aide.montant);
        }
      }
    }
    return montant;
  }

  private calculerMontantAllocationsPoleEmploi(allocationsPoleEmploi: AllocationsPoleEmploi) {
    const montant = this.numberUtileService.getMontantSafe(allocationsPoleEmploi.allocationMensuelleNetARE)
      + this.numberUtileService.getMontantSafe(allocationsPoleEmploi.allocationMensuelleNetASS);
    return montant
  }

  private calculerMontantAllocationsCAF(allocationsCAF: AllocationsCAF) {
    const montant = this.numberUtileService.getMontantSafe(allocationsCAF.allocationMensuelleNetAAH)
      + this.numberUtileService.getMontantSafe(allocationsCAF.allocationMensuelleNetRSA)
      + this.numberUtileService.getMontantSafe(allocationsCAF.allocationsFamilialesMensuellesNetFoyer)
      + this.numberUtileService.getMontantSafe(allocationsCAF.allocationsLogementMensuellesNetFoyer);
    return montant
  }

  private saveDemandeurEmploiConnecteInSessionStorage(): void {
    this.sessionStorageService.store(KeysSessionStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY, this.demandeurEmploiConnecte);
  }

  private unsetConjointRessourcesAllocations(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE = null;
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS = null;
    }
    if (this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = null;
    }
  }


}