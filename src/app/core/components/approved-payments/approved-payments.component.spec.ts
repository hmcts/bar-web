import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedPaymentsComponent } from './approved-payments.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../../shared/components/card/card.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ApprovedPaymentsComponent', () => {
  let component: ApprovedPaymentsComponent;
  let fixture: ComponentFixture<ApprovedPaymentsComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ ApprovedPaymentsComponent, CardComponent ]
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
