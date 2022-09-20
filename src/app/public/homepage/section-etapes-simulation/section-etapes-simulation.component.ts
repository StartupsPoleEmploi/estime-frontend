import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PeConnectService } from '@app/core/services/connexion/pe-connect.service';
import { ScreenService } from "@app/core/services/utile/screen.service";

@Component({
  selector: 'app-section-etapes-simulation',
  templateUrl: './section-etapes-simulation.component.html',
  styleUrls: ['./section-etapes-simulation.component.scss']
})
export class SectionEtapesSimulationComponent {

  @Input() login: () => void;
  @Output() openModalOnEventChoixConnexion = new EventEmitter();

  constructor(
    public peConnectService: PeConnectService,
    public screenService: ScreenService
  ) { }

  public onClickopenModalOnEventChoixConnexion(): void {
    this.openModalOnEventChoixConnexion.emit();
  }

}
