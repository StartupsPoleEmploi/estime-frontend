import { Injectable } from '@angular/core';
import { SimulationAidesSociales } from "@models/simulation-aides-sociales";
import { SessionStorageService } from "ngx-webstorage";
import { KeysStorageEnum } from "@app/commun/enumerations/keys-storage.enum";
import { DeConnecteService } from './de-connecte.service';
import { DeConnecteRessourcesFinancieresService } from './de-connecte-ressources-financieres.service';
import { SimulationMensuelle } from '@models/simulation-mensuelle';
import { NumberUtileService } from '../utile/number-util.service';
import { AllocationsCPAM } from '@app/commun/models/allocations-cpam';

@Injectable({ providedIn: 'root' })
export class DeConnecteSimulationAidesSocialesService {

  private simulationAidesSociales: SimulationAidesSociales;

  constructor(
    private deConnecteService: DeConnecteService,
    private deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    private numberUtileService: NumberUtileService,
    private sessionStorageService: SessionStorageService
  ) {

  }

  public getSimulationAidesSociales(): SimulationAidesSociales {
    if (!this.simulationAidesSociales) {
      this.simulationAidesSociales = this.sessionStorageService.retrieve(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION_AIDES_SOCIALE);
    }
    return this.simulationAidesSociales;
  }

  public setSimulationAidesSociales(simulationAidesSociales: SimulationAidesSociales): void {
    this.simulationAidesSociales = simulationAidesSociales;
    this.saveSimulationAidesSocialesInSessionStorage();
  }

  public calculerMontantTotalRessourcesMois(simulation: SimulationMensuelle): number {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    const ressourcesFinancieres = demandeurEmploiConnecte.ressourcesFinancieres;

    const salaireFuturTravail = this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.futurTravail.salaire.montantNet);
    const revenusMicroEntreprise = this.numberUtileService.getMontantSafe(this.deConnecteRessourcesFinancieresService.getRevenusMicroEntrepriseSur1Mois());
    const revenusIndependant = this.numberUtileService.getMontantSafe(this.deConnecteRessourcesFinancieresService.getBeneficesTravailleurIndependantSur1Mois());
    const revenusImmobilier = this.numberUtileService.getMontantSafe(this.deConnecteRessourcesFinancieresService.getRevenusImmobilierSur1Mois());
    const montantAllocationsCPAM = this.calculerMontantAllocationsCPAM(ressourcesFinancieres.allocationsCPAM);
    const montantTotalAidesMoisSimule = this.calculerMontantAidesSimuleesMois(simulation);

    return Math.floor(salaireFuturTravail + revenusMicroEntreprise + revenusIndependant + revenusImmobilier + montantAllocationsCPAM + montantTotalAidesMoisSimule);
  }

  private calculerMontantAidesSimuleesMois(simulation: SimulationMensuelle) {
    let montant = 0;
    if (simulation.mesAides) {
      const aides = Object.values(simulation.mesAides);
      aides.forEach((aide) => {
        if (aide) {
          montant += this.numberUtileService.getMontantSafe(aide.montant);
        }
      });
    }
    return montant;
  }

  private calculerMontantAllocationsCPAM(allocationsCPAM: AllocationsCPAM) {
    let montant = 0;
    if(allocationsCPAM) {
      montant +=  this.numberUtileService.getMontantSafe(allocationsCPAM.pensionInvalidite)
        + this.numberUtileService.getMontantSafe(allocationsCPAM.allocationSupplementaireInvalidite);
    }
    return montant
  }

  private saveSimulationAidesSocialesInSessionStorage(): void {
    this.sessionStorageService.store(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION_AIDES_SOCIALE, this.simulationAidesSociales);
  }
}