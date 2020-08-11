import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services-utiles/auth-service.service';
import { DemandeurEmploi } from "@models/demandeur-emploi";

@Component({
  selector: 'app-recapitulatif-info-de',
  templateUrl: './recapitulatif-info-de.component.html',
  styleUrls: ['./recapitulatif-info-de.component.scss']
})
export class RecapitulatifInfoDeComponent implements OnInit {

  demandeurEmploiConnecte: DemandeurEmploi;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.demandeurEmploiConnecte = this.authService.getDemandeurEmploiConnecte();
  }

}
