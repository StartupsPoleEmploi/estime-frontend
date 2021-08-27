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
  codeAide: String;
  aideIcon: String;
  aideTitre: String;

  constructor(
    private estimeApiService: EstimeApiService
   ) { 
   }

  public onClickDesc(codeAide): void{
    this.selectAide(codeAide);
    this.codeAide = codeAide;
    if(codeAide === "ASS"){
      this.aideIcon = "../assets/images/AssIcon.svg";
      this.aideTitre = "L’Allocation de Solidarité Spécifique";
    }else if(codeAide === "AAH"){
      this.aideIcon = "../assets/images/AahIcon.svg";
      this.aideTitre = "Allocation Adulte Handicapé";
    }else if(codeAide === "PA"){
      this.aideIcon = "../assets/images/PaIcon.svg";
      this.aideTitre = "La prime d'activité";
    }else if(codeAide === "AM"){
      this.aideIcon = "../assets/images/AmIcon.svg";
      this.aideTitre = "Aide à la mobilité (Pôle emploi)";
    }else if(codeAide === "AGEPI"){
      this.aideIcon = "../assets/images/AgepiIcon.svg";
      this.aideTitre = "L'aide à la garde d'enfants pour parent isolé";
    }
    
  }

  private selectAide(codeAide: String) {
    let self = this;
    this.estimeApiService
    .getDetailAide(codeAide)
    .then( 
      (detailAideBackEnd) => {
        this.aideDetail = detailAideBackEnd.detail;
    }, (erreur) => {
      console.log("error");
    }
    );
  }


  ngOnInit(): void {
  }

}
