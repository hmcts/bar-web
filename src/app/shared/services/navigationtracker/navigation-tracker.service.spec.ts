import { TestBed, inject } from '@angular/core/testing';

import { NavigationTrackerService } from './navigation-tracker.service';

describe('NavigationTrackerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavigationTrackerService]
    });
  });

  it('should be created', inject([NavigationTrackerService], (service: NavigationTrackerService) => {
    expect(service).toBeTruthy();
  }));
});
