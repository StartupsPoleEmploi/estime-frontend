import { Component, Input, OnInit } from '@angular/core';
import { Aide } from '@app/commun/models/aide';

import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';

@Component({
  selector: 'app-aides-description',
  templateUrl: './aides-description.component.html',
  styleUrls: ['./aides-description.component.scss']
})
export class AidesDescriptionComponent implements OnInit {
  @Input() codeAide: String;
  aideDetail: String;
  constructor(private estimeApiService: EstimeApiService) { }

  private selectAide(codeAide: String) {
    let self = this;
    this.estimeApiService
    .getDetailAide("AAH")
    .then( 
      (detailAideBackEnd) => {
        this.aideDetail = detailAideBackEnd.detail;
      console.log(self.aideDetail);
    }, (erreur) => {
      console.log("error");
    }
    );
    console.log(this.aideDetail);
  }

  ngOnInit(): void {
    this.selectAide(this.codeAide);
    console.log('===========' + this.codeAide);
    console.log('++++++++++++'+ this.aideDetail);
  }

}
