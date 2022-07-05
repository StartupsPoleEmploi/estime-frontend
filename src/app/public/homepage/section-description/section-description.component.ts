import { Component } from '@angular/core';
import { ScreenService } from '@app/core/services/utile/screen.service';

@Component({
  selector: 'app-section-description',
  templateUrl: './section-description.component.html',
  styleUrls: ['./section-description.component.scss']
})
export class SectionDescriptionComponent {

  constructor(public screenService: ScreenService) { }
}
