import { Component, OnInit } from '@angular/core';
import { SessionStorageEstimeService } from '@app/core/services/storage/session-storage-estime.service';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-etapes-simulation',
  templateUrl: './etapes-simulation.component.html',
  styleUrls: ['./etapes-simulation.component.scss']
})
export class EtapesSimulationComponent implements OnInit {

  etapeActive: number;
  isSmallScreen: boolean;
  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;

  constructor(
    private sessionStorageEstimeService: SessionStorageEstimeService,
    private screenService: ScreenService
  ) {
    this.gererResizeScreen();
  }

  ngOnInit(): void {
    this.initEtapeActive();
    this.isSmallScreen = this.screenService.isSmallScreen();
  }

  public traiterEtapeValidee(): void {
    this.etapeActive = this.etapeActive + 1;
    this.sessionStorageEstimeService.storeNumeroEtapeSimulation(this.etapeActive);
  }

  public traiterRetourEtapePrecedente(): void {
    this.etapeActive = this.etapeActive - 1;
    this.sessionStorageEstimeService.storeNumeroEtapeSimulation(this.etapeActive);
  }

  private initEtapeActive(): void {
    const numeroEtapeSimulation = this.sessionStorageEstimeService.getNumeroEtapeSimulation();
    if(numeroEtapeSimulation)  {
      this.etapeActive = parseInt(numeroEtapeSimulation);
    } else {
      this.etapeActive = 1;
      this.sessionStorageEstimeService.storeNumeroEtapeSimulation(this.etapeActive);
    }
  }

  private gererResizeScreen(): void {
    this.resizeObservable = fromEvent(window, 'resize')
    this.resizeSubscription = this.resizeObservable.subscribe( evt => {
      this.isSmallScreen = this.screenService.isSmallScreen();
    })
  }

}
