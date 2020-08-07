import { Component, OnInit } from '@angular/core';
import { AuthService } from "./commun/services/utile/auth-service.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'estime';
  isLoggedIn = false;

  constructor(private authService: AuthService) {
    this.authService.loginChanged.subscribe(loggedIn =>  {
      this.isLoggedIn = loggedIn;
    })
  }

  ngOnInit() {
    this.authService.isLoggedIn().then(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
  }
}
