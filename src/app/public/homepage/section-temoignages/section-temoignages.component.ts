import { Component, OnInit } from '@angular/core';
import { Temoignage } from '@app/commun/models/temoignage';
import { ScreenService } from '@app/core/services/utile/screen.service';
import { TemoignageService } from '@app/core/services/utile/temoignage.service';

@Component({
  selector: 'app-section-temoignages',
  templateUrl: './section-temoignages.component.html',
  styleUrls: ['./section-temoignages.component.scss']
})
export class SectionTemoignagesComponent implements OnInit {

  temoignages: Array<Temoignage>;

  constructor(
    public screenService: ScreenService,
    private temoignageService: TemoignageService
  ) { }

  ngOnInit(): void {
    this.loadTemoignages();
  }

  private loadTemoignages(): void {
    this.temoignages = this.temoignageService.getTemoignages();
  }
}
