import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

import { UserService } from '../../services/user/user.service';
import { FeelogService } from '../../services/feelog/feelog.service';

import { FeelogComponent } from './feelog.component';

import { UpperCaseFirstPipe } from '../../pipes/upper-case-first.pipe';

let mockRouter: any;

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('FeelogComponent', () => {
  let component: FeelogComponent;
  let fixture: ComponentFixture<FeelogComponent>;

  beforeEach(async(() => {
    mockRouter = new MockRouter();
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpModule, HttpClientModule],
      declarations: [FeelogComponent, UpperCaseFirstPipe],
      providers: [UserService, FeelogService, { provide: Router, useValue: mockRouter }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
