import { Injectable } from '@angular/core';
import { KeysStorageEnum } from "@app/commun/enumerations/keys-storage.enum";
import { BeneficiaireAidesSociales } from '@app/commun/models/beneficiaire-aides-sociales';
import { NumberUtileService } from "@app/core/services/utile/number-util.service";
import { PersonneUtileService } from '@app/core/services/utile/personne-utile.service';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { PersonneDTO } from '@models/dto/personne-dto';
import { FuturTravail } from '@models/futur-travail';
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { Personne } from '@models/personne';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { SituationFamiliale } from '@models/situation-familiale';
import { SessionStorageService } from "ngx-webstorage";
import { RessourcesFinancieresUtileService } from '../utile/ressources-financieres-utiles.service';


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

  public getDemandeurEmploiConnecte(): DemandeurEmploi {
    if (!this.demandeurEmploiConnecte) {
      this.demandeurEmploiConnecte = this.sessionStorageService.retrieve(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
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
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetAAH = null;
      }
      this.saveDemandeurEmploiConnecteInSessionStorage();
    }
  }

  public unsetConjointAllocationARE(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireARE = false;
      if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetARE = null;
      }
      this.saveDemandeurEmploiConnecteInSessionStorage();
    }
  }

  public unsetConjointAllocationASS(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireASS = false;
      if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
        && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsPoleEmploi.allocationMensuelleNetASS = null;
      }
      this.saveDemandeurEmploiConnecteInSessionStorage();
    }
  }

  public unsetConjointAllocationRSA(): void {
    if (this.demandeurEmploiConnecte.situationFamiliale && this.demandeurEmploiConnecte.situationFamiliale.conjoint) {
      this.demandeurEmploiConnecte.situationFamiliale.conjoint.beneficiaireAidesSociales.beneficiaireRSA = false;
      if(this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres
      && this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF) {
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.allocationsCAF.allocationMensuelleNetRSA = null;
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
        this.demandeurEmploiConnecte.situationFamiliale.conjoint.ressourcesFinancieres.salaireNet = null;
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

  private saveDemandeurEmploiConnecteInSessionStorage(): void {
    this.sessionStorageService.store(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY, this.demandeurEmploiConnecte);
  }
}