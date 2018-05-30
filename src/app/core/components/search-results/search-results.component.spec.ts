import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsComponent } from './search-results.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';
import { SearchService } from '../../services/search/search.service';
import { SearchServiceMock } from '../../test-mocks/search.service.mock';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  let searchService: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultsComponent ],
      imports: [RouterModule]
    }).overrideComponent(SearchResultsComponent, {
      set: {
        providers: [
          { provide: SearchService, useClass: SearchServiceMock }
        ]
      }
    });

    fixture = TestBed.createComponent(SearchResultsComponent);
    searchService = fixture.debugElement.injector.get(SearchService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
