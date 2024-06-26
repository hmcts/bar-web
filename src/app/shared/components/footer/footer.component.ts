import { Component } from '@angular/core';
import { AppConstants } from '../../../app.constants';
import { Navigation } from './footer.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})

export class FooterComponent {
  public navigationData: Navigation = AppConstants.FOOTER_DATA_NAVIGATION;
  
  constructor() {}
}
