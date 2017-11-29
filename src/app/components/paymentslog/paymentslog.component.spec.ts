import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentslogComponent } from './paymentslog.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

import { UserService } from '../../services/user/user.service';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';

import { UpperCaseFirstPipe } from '../../pipes/upper-case-first.pipe';

let mockRouter: any;

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('PaymentslogComponent', () => {
  let component: PaymentslogComponent;
  let fixture: ComponentFixture<PaymentslogComponent>;

  beforeEach(async(() => {
    mockRouter = new MockRouter();
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, HttpClientModule ],
      declarations: [ PaymentslogComponent, UpperCaseFirstPipe ],
      providers: [ UserService, PaymentslogService, { provide: Router, useValue: mockRouter } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentslogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
