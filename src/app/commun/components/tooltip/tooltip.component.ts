import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {

  @Input('modalRef') public modalRef: BsModalRef;
  @Input('htmlData') public htmlData: string;

  constructor() { }

  ngOnInit(): void {
  }

}
