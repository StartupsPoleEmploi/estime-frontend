import { Component, OnInit } from '@angular/core';
import { AideService } from '@services/api-estime/aide.service';
import { Aide } from '@app/commun/models/aide.model';
import { AuthService } from '@app/commun/services/utile/auth-service.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  public aides:Array<Aide>;

  constructor(private authService: AuthService) { }

  ngOnInit() {

  }

  login() {
    this.authService.login();
  }


}
