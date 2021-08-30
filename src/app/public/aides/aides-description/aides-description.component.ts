import { Component, Input, OnInit } from '@angular/core';
import { Aide } from '@app/commun/models/aide';

import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';

@Component({
  selector: 'app-aides-description',
  templateUrl: './aides-description.component.html',
  styleUrls: ['./aides-description.component.scss']
})
export class AidesDescriptionComponent implements OnInit {
  @Input() aideDetail: String;
  @Input() aideLienExterne: String;
  constructor(private estimeApiService: EstimeApiService) { }

  btnClick = function(){
    window.open(this.aideLienExterne, '_blank');
  }

  ngOnInit(): void {
  }

}
