import { Injectable } from '@angular/core';


@Injectable({providedIn: 'root'})
export class EtapeSimulationService {

  etapesSimulation: Array<string>;

  constructor() {
    this.initEtapesSimulation();
  }

  public getEtapesSimulation(): Array<string> {
    return this.etapesSimulation;
  }

  private initEtapesSimulation(): void {
    this.etapesSimulation = new Array<string>();
    this.etapesSimulation.push('Connectez-vous et indiquez le montant du salaire de votre prochain contrat de travail.');
    this.etapesSimulation.push('Complétez les informations pour la simulation. Vous aurez besoin de votre relevé CAF et de votre notification de droit ASS Pôle emploi.');
    this.etapesSimulation.push('Obtenez le montant détaillé de vos ressources mois par mois.');
  }
}