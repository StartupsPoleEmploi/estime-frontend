import { Component, OnInit } from '@angular/core';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resultat-ma-simulation',
  templateUrl: './resultat-ma-simulation.component.html',
  styleUrls: ['./resultat-ma-simulation.component.scss']
})
export class ResultatMaSimulationComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  redirectVersPagePrecedente() {
    this.router.navigate([RoutesEnum.MES_RESSOURCES_FINANCIERES], { replaceUrl: true });
  }

}
