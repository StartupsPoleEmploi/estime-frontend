
import { Injectable } from '@angular/core';
import { CodesAidesEnum } from '@app/commun/enumerations/codes-aides.enum';
import { SimulationAidesSociales } from '@app/commun/models/simulation-aides-sociales';
import { AidesService } from '../../utile/aides.service';


@Injectable({ providedIn: 'root' })
export class DetailAidesEligiblesService {

  constructor(
    private aidesService: AidesService
  ) {

  }

  public addPagesDetailAides(content: Array<any>, simulationAidesSociales: SimulationAidesSociales): void {
    if(this.aidesService.hasAide(simulationAidesSociales, CodesAidesEnum.AGEPI)) {


    }
  }

}