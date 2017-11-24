import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { ModalComponent } from './../modal/modal.component';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

import { UserService } from '../../services/user/user.service';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';

let mockRouter: any;

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    mockRouter = new MockRouter();
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, HttpClientModule ],
      declarations: [ DashboardComponent, ModalComponent ],
      providers: [ UserService, PaymenttypeService, { provide: Router, useValue: mockRouter } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display pop-up modal with correct data from MockAPI.', () => {
    // expect success data from api
  });

  it('should display pop-up modal with correct data from MockAPI with ID length of 5.', () => {
    // expect success data from api, with the ID no longer than 5 characters long.
  });
});
