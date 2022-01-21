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
    window.location.href = "https://datastudio.google.com/reporting/f7fae1db-bfde-4c18-ab2e-cd1da8e9917a/page/8l8gC";
  }

}
