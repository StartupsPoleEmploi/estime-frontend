import { Injectable } from '@angular/core';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { SessionStorageService } from "ngx-webstorage";
import { BeneficiaireAidesSociales } from '@models/beneficiaire-aides-sociales';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { AllocationsPoleEmploi } from '@models/allocations-pole-emploi';
import { AllocationsCAF } from '@models/allocations-caf';
import { FuturTravail } from '@models/futur-travail';
import { InformationsPersonnelles } from '@models/informations-personnelles';
import { SituationFamiliale } from '@models/situation-familiale';

@Injectable({ providedIn: 'root' })
export class DemandeurEmploiConnecteService {

  public static readonly DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY = 'estime.demandeur-emploi';

  private demandeurEmploiConnecte: DemandeurEmploi;

  constructor(
    private sessionStorageService: SessionStorageService
  ) {

  }

  getDemandeurEmploiConnecte(): DemandeurEmploi {
    if (!this.demandeurEmploiConnecte) {
      this.demandeurEmploiConnecte = this.sessionStorageService.retrieve(DemandeurEmploiConnecteService.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
    }
    return this.demandeurEmploiConnecte;
  }


  public setDemandeurEmploiConnecte(demandeurEmploi: DemandeurEmploi): void {
    this.demandeurEmploiConnecte = demandeurEmploi;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public hasSituationExceptionnelle(): boolean {
    return this.demandeurEmploiConnecte.informationsPersonnelles.hasRevenusImmobilier
      || this.demandeurEmploiConnecte.informationsPersonnelles.isCreateurEntreprise
      || this.demandeurEmploiConnecte.informationsPersonnelles.isHandicape;
  }

  public createDemandeurEmploiConnecte() {

    //TODO JLA sera fait à terme côté serveur

    this.demandeurEmploiConnecte = new DemandeurEmploi();

    this.demandeurEmploiConnecte.futurTravail =  new FuturTravail();
    this.demandeurEmploiConnecte.futurTravail.nombreMoisContratCDD = null;

    const informationsPersonnelles = new InformationsPersonnelles();
    informationsPersonnelles.nationalite = null;
    this.demandeurEmploiConnecte.informationsPersonnelles = informationsPersonnelles;

    this.demandeurEmploiConnecte.situationFamiliale = new SituationFamiliale();

    const beneficiaireAidesSociales = new BeneficiaireAidesSociales();
    beneficiaireAidesSociales.beneficiaireASS = true;
    this.demandeurEmploiConnecte.beneficiaireAidesSociales = beneficiaireAidesSociales;

    const ressourcesFinancieres = new RessourcesFinancieres();
    const allocationsPE = new AllocationsPoleEmploi();
    allocationsPE.nombreMoisCumulesAssEtSalaire = null;
    ressourcesFinancieres.allocationsPoleEmploi = allocationsPE;

    const allocationsCAF = new AllocationsCAF();
    ressourcesFinancieres.allocationsCAF = allocationsCAF;

    this.demandeurEmploiConnecte.ressourcesFinancieres = ressourcesFinancieres;

    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public saveDemandeurEmploiConnecteInSessionStorage() {
    this.sessionStorageService.store(DemandeurEmploiConnecteService.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY, this.demandeurEmploiConnecte);
  }
}