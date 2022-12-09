import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesEnum } from '@app/commun/enumerations/routes.enum';
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  stickyButton = false;
  scrollPositionOffset: number;

  constructor(
    private router: Router,
    public screenService: ScreenService
  ) {
  }

  ngOnInit(): void {
    this.scrollPositionOffset = document.getElementById('image-homepage-calculette').offsetTop;

  }

  public onClickCommencerSimulation() {
    this.router.navigate([RoutesEnum.CHOIX_TYPE_SIMULATION]);
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.stickyButton = this.screenService.isExtraSmallScreen() && this.screenService.isButtonSticky(scrollPosition, this.scrollPositionOffset);
  }
}
