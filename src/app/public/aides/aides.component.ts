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
  detailAide: string;
  messageErreur: string;
  aideDetail: string;
  aideLienExterne: string;
  codeAide: string;
  aideIcon: string;
  aideTitre: string;
  aideColor: string;

  constructor(
    private estimeApiService: EstimeApiService
   ) {
   }

  public onClickAideSavoirPlus(codeAide): void{
    this.selectAide(codeAide);
    this.codeAide = codeAide;
    window.scroll(0,0);
  }

  private selectAide(codeAide: string) {
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
        console.log("Erreur lors de la récupération des descriptions de l'aide");
      }
    );
  }


  ngOnInit(): void {
  }

}
