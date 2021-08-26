import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { Aide } from '@app/commun/models/aide';
import { DetailAide } from '@app/commun/models/detail-aide';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { AidesService } from '@app/core/services/utile/aides.service';

@Component({
  selector: 'app-aides',
  templateUrl: './aides.component.html',
  styleUrls: ['./aides.component.scss']
})
export class AidesComponent implements OnInit {
  pageTitlesEnum: typeof PageTitlesEnum = PageTitlesEnum;
  detailAide: String;
  messageErreur: String;
  aideDetail: String;
  codeAide: String;

  constructor(
    private router: Router, 
    private estimeApiService: EstimeApiService
   ) { 
   }

  public onClickDesc(typeAides): void{
    //this.selectAideActuelle();
    this.codeAide = "AAH";
    this.router.navigate([RoutesEnum.AIDES_DESCRIPTION]);
    
  }

  private selectAide(codeAide: String) {
    let self = this;
    this.estimeApiService
    .getDetailAide(codeAide)
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
    //this.selectAide("AAH");
  }

}
