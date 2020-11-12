import { Component, OnInit } from '@angular/core';
import { RoutesEnum } from '@enumerations/routes.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-avant-de-commencer-simulation',
  templateUrl: './avant-de-commencer-simulation.component.html',
  styleUrls: ['./avant-de-commencer-simulation.component.scss']
})
export class AvantDeCommencerSimulationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redirectVersPageMonContratDeTravail() {
    this.router.navigate([RoutesEnum.MON_FUTUR_DE_TRAVAIL], { replaceUrl: true });
  }
}
