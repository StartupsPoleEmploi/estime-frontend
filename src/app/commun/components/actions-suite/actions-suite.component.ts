import { Component } from '@angular/core';
import { CodesActionsEnum } from '@app/commun/enumerations/codes-actions-enum';
import { LiensUtilesEnum } from '@app/commun/enumerations/liens-utiles.enum';
import { RedirectionExterneService } from '@app/core/services/utile/redirection-externe.service';

@Component({
  selector: 'app-actions-suite',
  templateUrl: './actions-suite.component.html',
  styleUrls: ['./actions-suite.component.scss']
})
export class ActionsSuiteComponent {

  codesActionsEnum: typeof CodesActionsEnum = CodesActionsEnum;
  liensUtileEnum: typeof LiensUtilesEnum = LiensUtilesEnum;

  constructor(
    public redirectionExterneService: RedirectionExterneService
  ) { }

  public onClickButtonMettreAJourProfil(): void {
    this.redirectionExterneService.navigate(this.liensUtileEnum.MISE_A_JOUR_PROFIL);
  }

  public onClickButtonInscriptionAtelier(): void {
    this.redirectionExterneService.navigate(this.liensUtileEnum.SERVICES_A_LA_CARTE);
  }

  public onClickButtonVoirOffres(): void {
    this.redirectionExterneService.navigate(this.liensUtileEnum.OFFRES_EMPLOI);
  }

  public onClickButtonComprendreMonAllocation(): void {
    this.redirectionExterneService.navigate(this.liensUtileEnum.COMPRENDRE_MON_ALLOCATION);
  }

  public simulationSelection(codeAction: CodesActionsEnum) {
    switch (codeAction) {
      case CodesActionsEnum.MISE_A_JOUR_PROFIL:
        this.onClickButtonMettreAJourProfil();
        break;
      case CodesActionsEnum.OFFRES_EMPLOI:
        this.onClickButtonVoirOffres();
        break;
      case CodesActionsEnum.SERVICES_A_LA_CARTE:
        this.onClickButtonInscriptionAtelier();
        break;
      case CodesActionsEnum.COMPRENDRE_MON_ALLOCATION:
        this.onClickButtonComprendreMonAllocation();
        break;
    }
  }

}
