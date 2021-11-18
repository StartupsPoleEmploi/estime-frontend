import { Component, OnInit } from '@angular/core';
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  constructor(
    public screenService: ScreenService
  ) { }

  ngOnInit(): void {
    window.location.href = "https://nextcloud.beta.pole-emploi.fr/s/SKQ9LWsZGCXsxBn";
  }

}
