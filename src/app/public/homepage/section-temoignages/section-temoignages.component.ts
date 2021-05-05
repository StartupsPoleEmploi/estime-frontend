import { Component, OnInit, HostListener } from '@angular/core';
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

  isSmallScreen: boolean;
  stickyButton = false;
  scrollPositionOffset: number;

  constructor(
    public screenService: ScreenService,
    private temoignageService: TemoignageService
  ) {

  }

  ngOnInit(): void {
    this.loadTemoignages();
    this.scrollPositionOffset = document.getElementById('section-etapes').offsetTop;
  }

  private loadTemoignages(): void {
    this.temoignages = this.temoignageService.getTemoignages();
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.stickyButton = this.screenService.isButtonSticky(scrollPosition, this.scrollPositionOffset);
  }

}
