import { Component, EventEmitter, Output } from '@angular/core';
import { PeConnectService } from '@app/core/services/connexion/pe-connect.service';
import { ScreenService } from "@app/core/services/utile/screen.service";

@Component({
  selector: 'app-section-etapes-simulation',
  templateUrl: './section-etapes-simulation.component.html',
  styleUrls: ['./section-etapes-simulation.component.scss']
})
export class SectionEtapesSimulationComponent {

  @Output() clickCommencerSimulation = new EventEmitter();

  constructor(
    public peConnectService: PeConnectService,
    public screenService: ScreenService
  ) { }

  public onClickCommencerSimulation(): void {
    this.clickCommencerSimulation.emit();
  }

}
