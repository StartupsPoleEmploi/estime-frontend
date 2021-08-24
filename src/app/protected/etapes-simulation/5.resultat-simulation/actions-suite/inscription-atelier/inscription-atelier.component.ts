import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-inscription-atelier',
  templateUrl: './inscription-atelier.component.html',
  styleUrls: ['./inscription-atelier.component.scss']
})
export class InscriptionAtelierComponent implements OnInit {
  @Input() onClickButtonInscriptionAtelier: () => void;
  stickyButton = false;


  constructor() { }

  ngOnInit(): void {
  }

}
