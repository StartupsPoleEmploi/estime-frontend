import { Component, OnInit } from '@angular/core';
import { AideService } from '@services/api-estime/aide.service';
import { Aide } from '@app/commun/models/aide.model';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  public aides:Array<Aide>;

  constructor(private aideService:AideService) { }

  ngOnInit() {
    this.getAides();
  }

  private getAides() {
    this.aideService.getAides().subscribe(aides => {
      this.aides = aides;
    });
  }


}
