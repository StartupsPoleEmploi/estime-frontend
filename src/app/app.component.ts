import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/services/utile/authentication.service';
import { RoutesEnum } from './commun/enumerations/routes.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  constructor(

    ) {

  }

  ngOnInit() {
  }


}
