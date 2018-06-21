import {ElementRef, OnInit, Input, Directive } from '@angular/core';
import { FeatureService } from '../../services/feature/feature.service';

@Directive({
  selector: '[appVisible]',
  providers: [FeatureService],
})

export class VisibilityDirective implements OnInit {
  @Input() feature: string;
  isVisible = true;

  constructor(
    private el: ElementRef,
    private featureService: FeatureService
  ) { }

  ngOnInit() {
    this.featureService.isFeatureEnabled(this.feature)
      .then(visible => {
        this.el.nativeElement.hidden = !visible;
      });
  }
}
