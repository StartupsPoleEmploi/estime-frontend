import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fil-etapes-desktop',
  templateUrl: './fil-etapes-desktop.component.html',
  styleUrls: ['./fil-etapes-desktop.component.scss']
})
export class FilEtapesDesktopComponent implements OnInit {

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
