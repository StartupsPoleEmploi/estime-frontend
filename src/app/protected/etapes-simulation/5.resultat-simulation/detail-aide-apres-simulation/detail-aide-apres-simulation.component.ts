import { LocationStrategy } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Aide } from '@app/commun/models/aide';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { SideModalService } from '@app/core/services/utile/side-modal.service';

@Component({
  selector: 'app-detail-aide-apres-simulation',
  templateUrl: './detail-aide-apres-simulation.component.html',
  styleUrls: ['./detail-aide-apres-simulation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailAideApresSimulationComponent implements OnInit {

  @Input() aide: Aide;

  constructor(
    private location: LocationStrategy,
    public screenService: ScreenService,
    public sideModalService: SideModalService) {
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      this.sideModalService.closeSideModalAide();
    });
  }

  ngOnInit(): void {
  }

  onClickFaireLaDemandeAide = function () {
    window.open(this.aide.lienExterne, '_blank');
  }


  public handleKeyUpOnRetour(event: any) {
    if (event.keyCode === 13) {
      this.sideModalService.closeSideModalAide()
    }
  }
}
