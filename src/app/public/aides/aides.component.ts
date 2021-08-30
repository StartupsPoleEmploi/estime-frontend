import { Component, OnInit } from '@angular/core';
import { PageTitlesEnum } from '@app/commun/enumerations/page-titles.enum';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';

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
  aideLienExterne: String;
  codeAide: String;
  aideIcon: String;
  aideTitre: String;
  aideColor: String;

  constructor(
    private estimeApiService: EstimeApiService
   ) { 
   }

  public onClickDesc(codeAide): void{
    this.selectAide(codeAide);
    this.codeAide = codeAide;
    window.scroll(0,0);
  }

  private selectAide(codeAide: String) {
    this.estimeApiService
    .getDetailAide(codeAide)
    .then( 
      (detailAideBackEnd) => {
        this.aideDetail = detailAideBackEnd.detail;
        this.aideLienExterne = detailAideBackEnd.lienExterne;
        this.aideIcon = "../assets/images/" + detailAideBackEnd.iconeAide;
        this.aideTitre = detailAideBackEnd.nom;
        this.aideColor = detailAideBackEnd.couleurAide;
    }, (erreur) => {
      console.log("error");
    }
    );
  }


  ngOnInit(): void {
  }

}
