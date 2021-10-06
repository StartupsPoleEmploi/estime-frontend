import { Injectable } from '@angular/core';
import { SimulationAides } from "@models/simulation-aides";
import { SessionStorageService } from "ngx-webstorage";
import { KeysStorageEnum } from "@app/commun/enumerations/keys-storage.enum";
import { DeConnecteService } from './de-connecte.service';
import { DeConnecteRessourcesFinancieresService } from './de-connecte-ressources-financieres.service';
import { SimulationMensuelle } from '@models/simulation-mensuelle';
import { NumberUtileService } from '../utile/number-util.service';
import { AidesCPAM } from '@app/commun/models/aides-cpam';

@Injectable({ providedIn: 'root' })
export class DeConnecteSimulationAidesService {

  private simulationAides: SimulationAides;

  constructor(
    private deConnecteService: DeConnecteService,
    private deConnecteRessourcesFinancieresService: DeConnecteRessourcesFinancieresService,
    private numberUtileService: NumberUtileService,
    private sessionStorageService: SessionStorageService
  ) {

  }

  public getSimulationAides(): SimulationAides {
    if (!this.simulationAides) {
      this.simulationAides = this.sessionStorageService.retrieve(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION_AIDES_SOCIALE);
    }
    return this.simulationAides;
  }

  public setSimulationAides(simulationAides: SimulationAides): void {
    this.simulationAides = simulationAides;
    this.saveSimulationAidesInSessionStorage();
  }

  public calculerMontantTotalRessourcesMois(simulation: SimulationMensuelle): number {
    const demandeurEmploiConnecte = this.deConnecteService.getDemandeurEmploiConnecte();
    const ressourcesFinancieres = demandeurEmploiConnecte.ressourcesFinancieres;

    const salaireFuturTravail = this.numberUtileService.getMontantSafe(demandeurEmploiConnecte.futurTravail.salaire.montantNet);
    const beneficesMicroEntreprise = this.numberUtileService.getMontantSafe(this.deConnecteRessourcesFinancieresService.getBeneficesMicroEntrepriseSur1Mois());
    const chiffreAffairesIndependant = this.numberUtileService.getMontantSafe(this.deConnecteRessourcesFinancieresService.getChiffreAffairesIndependantSur1Mois());
    const revenusImmobilier = this.numberUtileService.getMontantSafe(this.deConnecteRessourcesFinancieresService.getRevenusImmobilierSur1Mois());
    const montantAidesCPAM = this.calculerMontantAidesCPAM(ressourcesFinancieres.aidesCPAM);
    const montantTotalAidesMoisSimule = this.calculerMontantAidesSimuleesMois(simulation);

    return Math.floor(salaireFuturTravail + beneficesMicroEntreprise + chiffreAffairesIndependant + revenusImmobilier + montantAidesCPAM + montantTotalAidesMoisSimule);
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

  private calculerMontantAidesCPAM(aidesCPAM: AidesCPAM) {
    let montant = 0;
    if(aidesCPAM) {
      montant +=  this.numberUtileService.getMontantSafe(aidesCPAM.pensionInvalidite)
        + this.numberUtileService.getMontantSafe(aidesCPAM.allocationSupplementaireInvalidite);
    }
    return montant
  }

  private saveSimulationAidesInSessionStorage(): void {
    this.sessionStorageService.store(KeysStorageEnum.DEMANDEUR_EMPLOI_CONNECTE_SIMULATION_AIDES_SOCIALE, this.simulationAides);
  }
}