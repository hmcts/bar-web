import { Component, Inject, Input, OnInit } from '@angular/core';
import { windowToken } from '../../../../window';

@Component({
    selector: 'app-cookie-banner',
    templateUrl: './cookie-banner.component.html',
    styleUrls: ['./cookie-banner.component.scss']
})

export class CookieBannerComponent implements OnInit {
  @Input() public identifier: string;
  @Input() public appName: string;

  private readonly window: Window;

  constructor(
   @Inject(windowToken) window: any,
  ) {
    this.window = window as Window;
  }

  public ngOnInit(): void {}
}
