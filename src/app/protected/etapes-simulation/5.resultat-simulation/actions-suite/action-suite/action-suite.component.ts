import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CodesActionsEnum } from '@app/commun/enumerations/codes-actions-enum';

@Component({
  selector: 'app-action-suite',
  templateUrl: './action-suite.component.html',
  styleUrls: ['./action-suite.component.scss']
})
export class ActionSuiteComponent implements OnInit {

  @Output() clickAction = new EventEmitter<string>();
  @Input() imageLink: string;
  @Input() text: string;
  @Input() codeAction: string;

  constructor() { }

  ngOnInit(): void {
  }


  public onClickAction(event, codeAction: string): void {
    event.preventDefault();
    this.clickAction.emit(codeAction);
  }

  public getTagAction(): string {
    switch (this.codeAction) {
      case CodesActionsEnum.MISE_A_JOUR:
        return "clic_bouton_mettre_a_jour_profil";
      case CodesActionsEnum.OFFRES_EMPLOI:
        return "clic_bouton_voir_offres_emploi";
      case CodesActionsEnum.SERVICES_A_LA_CARTE:
        return "clic_bouton_voir_service_a_la_carte";
    }

  }
}
