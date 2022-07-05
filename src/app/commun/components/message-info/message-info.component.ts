import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-info',
  templateUrl: './message-info.component.html',
  styleUrls: ['./message-info.component.scss']
})
export class MessageInfoComponent {

  @Input() contenu: string;

}
