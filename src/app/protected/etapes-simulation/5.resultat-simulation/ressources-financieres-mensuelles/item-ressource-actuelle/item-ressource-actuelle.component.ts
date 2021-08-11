import { Component, Input, OnInit } from '@angular/core';
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-item-ressource-actuelle',
  templateUrl: './item-ressource-actuelle.component.html',
  styleUrls: ['./item-ressource-actuelle.component.scss']
})
export class ItemRessourceActuelleComponent implements OnInit {


  @Input() codeRessource: string;
  @Input() isAideSelected: boolean;
  @Input() isColPictoArrowDisplay: boolean;
  @Input() isLastItem: boolean;
  @Input() libelleRessource: string;
  @Input() montantRessource: number;
  @Input() organismeRessource: string;

  constructor(
    public screenService: ScreenService
  ) {
  }

  ngOnInit(): void {
  }

}
