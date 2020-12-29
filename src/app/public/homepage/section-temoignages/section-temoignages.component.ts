import { Component, Input, OnInit } from '@angular/core';
import { Temoignage } from '@app/commun/models/temoignage';
import { TemoignageService } from '@app/core/services/utile/temoignage.service';

@Component({
  selector: 'app-section-temoignages',
  templateUrl: './section-temoignages.component.html',
  styleUrls: ['./section-temoignages.component.scss']
})
export class SectionTemoignagesComponent implements OnInit {

  temoignages: Array<Temoignage>;

  @Input() isSmallScreen: boolean;

  constructor(
    private temoignageService: TemoignageService
  ) {

  }

  ngOnInit(): void {
    this.loadTemoignages();
  }

  private loadTemoignages(): void {
    this.temoignages = this.temoignageService.getTemoignages();
  }

}
