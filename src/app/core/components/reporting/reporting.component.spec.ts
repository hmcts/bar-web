import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingComponent } from './reporting.component';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

describe('ReportingComponent', () => {
  let component: ReportingComponent;
  let fixture: ComponentFixture<ReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingComponent ],
      imports: [FormsModule, HttpClientModule],
      providers: [ PaymentslogService ]
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
    component.startDate = '29042020';
    component.generateReportingUrl();
    fixture.detectChanges();
    expect(component.generateReportingUrl()).toContain(`startDate=${component.startDate}`);
  });

  it('shouldnt contain "startDate" in the generatedReportingURL.', () => {
    component.startDate = '';
    component.generateReportingUrl();
    fixture.detectChanges();
    expect(component.generateReportingUrl().includes(`startDate=${component.startDate}`)).toBeFalsy();
  });
});
