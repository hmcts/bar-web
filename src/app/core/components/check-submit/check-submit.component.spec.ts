import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CheckSubmitComponent } from './check-submit.component';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';
import { UtilService } from '../../../shared/services/util/util.service';
import { UserService } from '../../../shared/services/user/user.service';
import { UserServiceMock } from '../../test-mocks/user.service.mock';
import { PaymentLogServiceMock } from '../../test-mocks/payment-log.service.mock';
import { PaymenttypeService } from '../../services/paymenttype/paymenttype.service';
import { PaymentTypeServiceMock } from '../../test-mocks/payment-type.service.mock';
import { By } from '@angular/platform-browser';

describe('CheckSubmitComponent', () => {
  let component: CheckSubmitComponent;
  let fixture: ComponentFixture<CheckSubmitComponent>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [CheckSubmitComponent],
      imports: [FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([])]
    });

    TestBed.overrideComponent(CheckSubmitComponent, {
      set: {
        providers: [
          { provide: PaymentslogService, useClass: PaymentLogServiceMock },
          { provide: PaymenttypeService, useClass: PaymentTypeServiceMock },
          { provide: UserService, useClass: UserServiceMock }
        ]
      }
    });

    fixture = TestBed.createComponent(CheckSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component is created and payment instruction are shown', async(() => {
    fixture.whenStable()
    .then(() => {
      fixture.detectChanges();
      const checkAndSubmitTable = fixture.debugElement.query(By.css('#check-and-submit-table'));
      expect(component.casModels.length).toBe(2);
    });
  }));

  it('expect the date is shown correctly', async(() => {
    fixture.whenStable()
    .then(() => {
      fixture.detectChanges();
      const checkAndSubmitTable = fixture.debugElement.query(By.css('#check-and-submit-table'));
      expect(checkAndSubmitTable.nativeElement.innerText).toContain('9/May/2018');
    });
  }));

  it('expect there is no hyphen in the table', async(() => {
    fixture.whenStable()
    .then(() => {
      fixture.detectChanges();
      const checkAndSubmitTable = fixture.debugElement.query(By.css('#check-and-submit-table'));
      expect(checkAndSubmitTable.nativeElement.innerText.includes('-')).toBeFalsy();
    });
  }));
});
