import { Component, Input } from '@angular/core';
import { Navigation } from '../footer/footer.model';

@Component({
  selector: 'hmcts-global-footer',
  templateUrl: './hmcts-global-footer.component.html'
})
export class HmctsGlobalFooterComponent {
  @Input() public navigation: Navigation;
}
