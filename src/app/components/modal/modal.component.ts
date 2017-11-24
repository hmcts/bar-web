import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() 
  title: string;
  
  @Output() 
  closeMe = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  onToggleDisplay() {
  	this.closeMe.emit(true);
  }

}
