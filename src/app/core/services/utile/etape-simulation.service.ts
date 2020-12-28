import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({providedIn: 'root'})
export class EtapeSimulationService {

  etapesSimulation: Array<string>;
  isEtapeSimulationChangedSubject: Subject<number>;
  etapeSimulationChanged: Observable<number>;

  constructor() {
    this.initEtapesSimulation();
    this.initEtapeSimulationChangedObservable();
  }

  public getEtapesSimulation(): Array<string> {
    return this.etapesSimulation;
  }

  public emitEtapeSimulationChangedEvent(numeroEtape: number): void {
    this.isEtapeSimulationChangedSubject.next(numeroEtape);
  }

  private initEtapesSimulation(): void {
    this.etapesSimulation = new Array<string>();
    this.etapesSimulation.push('Connectez-vous et indiquez le montant du salaire de votre prochain contrat de travail.');
    this.etapesSimulation.push('Complétez les informations pour la simulation. Vous aurez besoin de votre relevé CAF et de votre notification de droit ASS Pôle emploi.');
    this.etapesSimulation.push('Obtenez le montant détaillé de vos ressources mois par mois.');
  }

  private initEtapeSimulationChangedObservable(): void {
    this.isEtapeSimulationChangedSubject = new Subject<number>();
    this.etapeSimulationChanged = this.isEtapeSimulationChangedSubject.asObservable();
  }
}