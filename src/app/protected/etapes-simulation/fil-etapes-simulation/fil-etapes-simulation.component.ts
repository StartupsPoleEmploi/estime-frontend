import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fil-etapes-simulation',
  templateUrl: './fil-etapes-simulation.component.html',
  styleUrls: ['./fil-etapes-simulation.component.scss']
})
export class FilEtapesSimulationComponent implements OnInit {

  @Input()
  etapeActive: number;

  etapesSimulation = [
    { numero: 1, titre: "Contrat<br>de travail" },
    { numero: 2, titre: "Ma situation" },
    { numero: 3, titre: "Mes personnes<br>à charge" },
    { numero: 4, titre: "Les ressources<br>actuelles" },
    { numero: 5, titre: "Résultat<br>simulation" }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
