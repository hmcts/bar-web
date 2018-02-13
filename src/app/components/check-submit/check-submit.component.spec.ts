import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckSubmitComponent } from './check-submit.component';
import { PaymentInstructionModel } from '../../models/paymentinstruction.model';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { UtilService } from '../../services/util/util.service';

describe('CheckSubmitComponent', () => {
  let component: CheckSubmitComponent;
  let fixture: ComponentFixture<CheckSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckSubmitComponent],
      providers: [PaymentslogService, UtilService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    console.log('Created!');
    expect(component).toBeTruthy();
  });
});
