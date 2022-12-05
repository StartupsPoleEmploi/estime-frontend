import { Component } from '@angular/core';
import { CodesActionsEnum } from '@app/commun/enumerations/codes-actions-enum';

@Component({
  selector: 'app-actions-suite',
  templateUrl: './actions-suite.component.html',
  styleUrls: ['./actions-suite.component.scss']
})
export class ActionsSuiteComponent {

  codesActionsEnum: typeof CodesActionsEnum = CodesActionsEnum;

  public onClickButtonMettreAJourProfil(): void {
    window.open('https://candidat.pole-emploi.fr/profil-professionnel/#/profil/synthese', '_blank');
  }

  public onClickButtonInscriptionAtelier(): void {
    window.open('https://candidat.pole-emploi.fr/prestations/servicescarte', '_blank');
  }

  public onClickButtonVoirOffres(): void {
    window.open('https://candidat.pole-emploi.fr/offres/emploi', '_blank');
  }

  public onClickButtonComprendreMonAllocation(): void {
    window.open('http://www.monallocation.pole-emploi.fr/', '_blank');
  }

  public simulationSelection(codeAction: string) {
    switch (codeAction) {
      case CodesActionsEnum.MISE_A_JOUR:
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
