import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Aide } from '@app/commun/models/aide';
import { EstimeApiService } from '@app/core/services/estime-api/estime-api.service';
import { MessagesErreurEnum } from '@app/commun/enumerations/messages-erreur.enum'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aides-description',
  templateUrl: './aides-description.component.html',
  styleUrls: ['./aides-description.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AidesDescriptionComponent implements OnInit {

  aideSelected: Aide;
  aideSelectedCode: string;
  subscriptionRouteNavigationEndObservable: Subscription;
  messageErreur: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private estimeApiService: EstimeApiService
  ) { }

  onClickFaireLaDemandeAide = function () {
    window.open(this.aideSelected.lienExterne, '_blank');
  }

  ngOnInit(): void {

    this.aideSelected = new Aide();

    this.subscriptionRouteNavigationEndObservable = this.activatedRoute.params.subscribe(params => {
      this.aideSelectedCode = params['aideCode'];
      this.estimeApiService
        .getAideByCode(this.aideSelectedCode).subscribe({
          next: this.traiterRetourGetDetailAide.bind(this),
          error: this.traiterErreurGetDetailAide.bind(this)
        });
    });
  }

  ngOnDestroy(): void {
    this.subscriptionRouteNavigationEndObservable.unsubscribe();
  }

  private traiterRetourGetDetailAide(aideFromBackend): void {
    this.aideSelected = aideFromBackend;
  }

  private traiterErreurGetDetailAide(): void {
    this.messageErreur = MessagesErreurEnum.ERREUR_RECUPERATION_AIDES;
  }
}
