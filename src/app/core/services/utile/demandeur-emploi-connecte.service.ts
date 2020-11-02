import { Injectable } from '@angular/core';
import { DemandeurEmploi } from '@models/demandeur-emploi';
import { SessionStorageService } from "ngx-webstorage";
import { BeneficiaireAidesSociales } from '@models/beneficiaire-aides-sociales';
import { RessourcesFinancieres } from '@models/ressources-financieres';
import { AllocationsPoleEmploi } from '@models/allocations-pole-emploi';
import { AllocationsCAF } from '@app/commun/models/allocations-caf';
import { FuturTravail } from '@app/commun/models/futur-travail';
import { InformationsIdentite } from '@app/commun/models/informations-identite';
import { SituationFamiliale } from '@app/commun/models/situation-familiale';

@Injectable({providedIn: 'root'})
export class DemandeurEmploiConnecteService {

  public static readonly DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY = 'estime.demandeur-emploi';

  private demandeurEmploiConnecte: DemandeurEmploi;

  constructor(
    private sessionStorageService: SessionStorageService
  ) {

  }

  getDemandeurEmploiConnecte(): DemandeurEmploi {
    if(!this.demandeurEmploiConnecte) {
      this.demandeurEmploiConnecte = this.sessionStorageService.retrieve(DemandeurEmploiConnecteService.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY);
    }
    return this.demandeurEmploiConnecte;
  }

  public setDemandeurEmploiConnecte(demandeurEmploi: DemandeurEmploi): void {
    this.demandeurEmploiConnecte = demandeurEmploi;
    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  public createDemandeurEmploiConnecte() {

    //TODO JLA sera fait à terme côté serveur

    this.demandeurEmploiConnecte = new DemandeurEmploi();

    const futurTravail = new FuturTravail();
    this.demandeurEmploiConnecte.futurTravail = futurTravail;

    this.demandeurEmploiConnecte.informationsIdentite = new InformationsIdentite();

    this.demandeurEmploiConnecte.situationFamiliale = new SituationFamiliale();

    const beneficiaireAidesSociales = new BeneficiaireAidesSociales();
    beneficiaireAidesSociales.beneficiairePrestationSolidarite = true;
    this.demandeurEmploiConnecte.beneficiaireAidesSociales = beneficiaireAidesSociales;

    const ressourcesFinancieres = new RessourcesFinancieres();
    const allocationsPE = new AllocationsPoleEmploi();
    allocationsPE.hasASSPlusSalaireCumule = false;
    ressourcesFinancieres.allocationsPoleEmploi = allocationsPE;

    const allocationsCAF = new AllocationsCAF();
    ressourcesFinancieres.allocationsCAF = allocationsCAF;

    this.demandeurEmploiConnecte.ressourcesFinancieres = ressourcesFinancieres;


    this.saveDemandeurEmploiConnecteInSessionStorage();
  }

  private saveDemandeurEmploiConnecteInSessionStorage() {
    this.sessionStorageService.store(DemandeurEmploiConnecteService.DEMANDEUR_EMPLOI_CONNECTE_STORAGE_SESSION_KEY, this.demandeurEmploiConnecte);
  }
}