import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-info',
  templateUrl: './message-info.component.html',
  styleUrls: ['./message-info.component.scss']
})
export class MessageInfoComponent implements OnInit {

  @Input() contenu: string;

  constructor() { }

  ngOnInit(): void {
  }

}
