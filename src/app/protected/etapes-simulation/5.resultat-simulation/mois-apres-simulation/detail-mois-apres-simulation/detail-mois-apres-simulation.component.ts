import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Aide } from '@app/commun/models/aide';
import { AidesService } from '@app/core/services/utile/aides.service';
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-detail-mois-apres-simulation',
  templateUrl: './detail-mois-apres-simulation.component.html',
  styleUrls: ['./detail-mois-apres-simulation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailMoisApresSimulationComponent implements OnInit {

  @Input() aides: Aide[];
  @Input() revenus: Aide[];

  aidesADemander: Aide[];
  ressourcesActuelles: Aide[];

  aideSelected: Aide[];

  constructor(
    private aidesService: AidesService,
    public screenService: ScreenService
  ) { }

  ngOnInit(): void {
    this.aidesADemander = this.getAidesADemander();
    this.ressourcesActuelles = this.getRessourcesActuelles();
  }

  private getAidesADemander(): Aide[] {
    let aidesADemander = [];

    this.aides.forEach((aide) => {
      if (this.aidesService.isAideDemandeurPourraObtenir(aide)) aidesADemander.push(aide);
    });

    return aidesADemander;
  }

  private getRessourcesActuelles(): Aide[] {
    let ressourcesActuelles = [];

    this.aides.forEach((aide) => {
      if (!this.aidesService.isAideDemandeurPourraObtenir(aide)) ressourcesActuelles.push(aide);
    });
    this.revenus.forEach((ressource) => {
      ressourcesActuelles.push(ressource);
    });

    return ressourcesActuelles;
  }

  public onClickOnAide(aide): void {
    if (this.aideSelected == aide) {
      this.aideSelected = null;
    } else {
      this.aideSelected = aide;
    }
  }

  public isAideSelected(aide): boolean {
    return this.aideSelected == aide;
  }

  public isAideAvecDetail(aide): boolean {
    return this.aidesService.isAideAvecDetail(aide);
  }

  public isDetailVisible(code: String): boolean {
    return false;
  }

}
