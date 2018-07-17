import {Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent implements OnInit {
  @Input() number = 0;
  @Input() label = '';
  @Input() amount?: number;
  @Input() selected = false;
  @Input() customStyle: Object = {};
  @Output() onClickFunction: EventEmitter<any> = new EventEmitter();
  constructor() {
  }

  ngOnInit() {
    this.validateNumber();
  }

  validateNumber() {
    if (typeof this.number === 'undefined') {
      this.number = 0;
    }
  }

  onClick() {
    this.onClickFunction.emit();
  }


}
