import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-accessibility-statement',
  templateUrl: './accessibility-statement.component.html',
  styleUrls: ['./accessibility-statement.component.scss']
})
export class AccessibilityStatementComponent {
  constructor(private _location: Location) 
  {}

  backClicked() {
    console.log('i have been clicked');
    this._location.back();
  }
}
