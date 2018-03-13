import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingComponent } from './reporting.component';
import { PaymentslogService } from '../../services/paymentslog/paymentslog.service';
import { HttpClientModule } from '@angular/common/http';

describe('ReportingComponent', () => {
  let component: ReportingComponent;
  let fixture: ComponentFixture<ReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportingComponent],
      imports: [HttpClientModule],
      providers: [PaymentslogService]
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
});
