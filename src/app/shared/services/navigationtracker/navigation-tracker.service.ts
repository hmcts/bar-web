import { Injectable } from '@angular/core';

@Injectable()
export class NavigationTrackerService {

  barColor = 'blue';
  isSearchVisible = true;

  constructor() { }

  setNavigationColor(value: string): void {
    this.barColor = value;
  }

}
