import { Component, Input, OnInit, ViewEncapsulation  } from '@angular/core';

@Component({
  selector: 'app-aides-description',
  templateUrl: './aides-description.component.html',
  styleUrls: ['./aides-description.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AidesDescriptionComponent implements OnInit {
  @Input() aideDetail: String;
  @Input() aideLienExterne: String;
  constructor() { }

  onClickFaireLaDemandeAide = function(){
    window.open(this.aideLienExterne, '_blank');
  }

  ngOnInit(): void {
  }
}
