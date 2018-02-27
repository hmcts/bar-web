import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedPaymentsComponent } from './approved-payments.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('ApprovedPaymentsComponent', () => {
  let component: ApprovedPaymentsComponent;
  let fixture: ComponentFixture<ApprovedPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ ApprovedPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
