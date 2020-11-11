import { Component, OnInit, Input } from '@angular/core';
import { DemandeurEmploi } from '@models/demandeur-emploi';

@Component({
  selector: 'app-item-ressource-actuelle',
  templateUrl: './item-ressource-actuelle.component.html',
  styleUrls: ['./item-ressource-actuelle.component.scss']
})
export class ItemRessourceActuelleComponent implements OnInit {

  @Input() codeRessource: string;
  @Input() isColPictoArrowDisplay: boolean;
  @Input() isLastItem: boolean;
  @Input() libelleRessource: string;
  @Input() montantRessource: number;
  @Input() organismeRessource: string;

  constructor() { }

  ngOnInit(): void {
  }

}
