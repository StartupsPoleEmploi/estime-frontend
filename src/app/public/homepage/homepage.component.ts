import { Component, OnInit } from '@angular/core';

import { AuthService } from '@services-utiles/auth-service.service';
import { Aide } from "@models/aide";


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
