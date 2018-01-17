import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hmcts-modal',
  templateUrl: './hmcts-modal.component.html',
  styleUrls: ['./hmcts-modal.component.css']
})
export class HmctsModalComponent implements OnInit {
  @Input('wide')
  wide;

  constructor() { }

  ngOnInit() {
    console.log( typeof this.wide );
  }

}
