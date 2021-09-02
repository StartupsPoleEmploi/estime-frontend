import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
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
  @Input() aideDetail: string;
  @Input() aideLienExterne: string;


  ICONS_PATH = "./assets/images/";

  aideSelected: Aide;
  aideSelectedCode: string;
  subscriptionRouteNavigationEndObservable: Subscription;
  messageErreur: string;

  constructor(
    private activatedRoute:ActivatedRoute,
    private estimeApiService: EstimeApiService
    ) { }

  onClickFaireLaDemandeAide = function(){
    window.open(this.aideLienExterne, '_blank');
  }

  ngOnInit(): void {

    this.aideSelected = new Aide();

    this.subscriptionRouteNavigationEndObservable = this.activatedRoute.params.subscribe(params => {
      this.aideSelectedCode = params['aideCode'];
      this.estimeApiService
        .getDetailAide(this.aideSelectedCode).then(
          (aideFromBackend) => {
            aideFromBackend.iconeAide = this.ICONS_PATH + aideFromBackend.iconeAide;
            this.aideSelected = aideFromBackend;
          }, (erreur) => {
            this.messageErreur = MessagesErreurEnum.ERREUR_RECUPERATION_AIDES
          }
        );
    });
 }

  ngOnDestroy(): void {
    this.subscriptionRouteNavigationEndObservable.unsubscribe();
  }
}
