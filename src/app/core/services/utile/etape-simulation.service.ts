import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({providedIn: 'root'})
export class EtapeSimulationService {

  isEtapeSimulationChangedSubject: Subject<number>;
  etapeSimulationChanged: Observable<number>;

  constructor() {
    this.initEtapeSimulationChangedObservable();
  }


  public emitEtapeSimulationChangedEvent(numeroEtape: number): void {
    this.isEtapeSimulationChangedSubject.next(numeroEtape);
  }


  private initEtapeSimulationChangedObservable(): void {
    this.isEtapeSimulationChangedSubject = new Subject<number>();
    this.etapeSimulationChanged = this.isEtapeSimulationChangedSubject.asObservable();
  }
}