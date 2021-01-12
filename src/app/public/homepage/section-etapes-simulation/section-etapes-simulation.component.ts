import { Component, OnInit } from '@angular/core';
import { ScreenService } from "@app/core/services/utile/screen.service";

@Component({
  selector: 'app-section-etapes-simulation',
  templateUrl: './section-etapes-simulation.component.html',
  styleUrls: ['./section-etapes-simulation.component.scss']
})
export class SectionEtapesSimulationComponent implements OnInit {

  constructor(
    public screenService: ScreenService
  ) { }

  ngOnInit(): void {
  }

}
