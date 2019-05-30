import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingComponent } from './reporting.component';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BarHttpClient } from '../../../shared/services/httpclient/bar.http.client';
import * as moment from 'moment';
import { By } from '@angular/platform-browser';

describe('ReportingComponent', () => {
  let component: ReportingComponent;
  let fixture: ComponentFixture<ReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingComponent ],
      imports: [FormsModule, HttpClientModule],
      providers: [ PaymentslogService, BarHttpClient ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should append "startDate" to the generatedReportingURL.', () => {
    component.startDate = '2019-05-23';
    component.generateReportingUrl();
    fixture.detectChanges();
    expect(component.generateReportingUrl()).toContain(`startDate=${moment(component.startDate).format('DDMMYYYY')}`);
  });

  it('shouldnt contain "startDate" in the generatedReportingURL.', () => {
    component.startDate = null;
    component.generateReportingUrl();
    fixture.detectChanges();
    expect(component.generateReportingUrl().includes(`startDate=${component.startDate}`)).toBeFalsy();
  });

  it('should disabled the view report button when start date not available', async(() => {
    component.startDate = null;
    fixture.detectChanges();
    const viewReport = fixture.debugElement.query(By.css('.button.disabled'));
    console.log(viewReport);
    expect(viewReport).toBeTruthy();
  }));

  it('should enabled the view report button when start date is available', async(() => {
    component.startDate = '2019-05-23';
    fixture.detectChanges();
    const viewReport = fixture.debugElement.query(By.css('.button.disabled'));
    console.log(viewReport);
    expect(viewReport).toBeFalsy();
  }));

  it('test validate date', () => {
    component.startDate = '2019-05-23';
    expect(component.dateError).toEqual('');

    component.startDate = '20198-05-23';
    expect(component.dateError).toEqual('Invalid date format');
  });

});
