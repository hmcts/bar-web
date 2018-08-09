import {async, ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';
import { StatsComponent } from './stats.component';
import { By } from '@angular/platform-browser';

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatsComponent],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should print the correct title and total', () => {
    component.title = 'Process';
    component.total = 0;
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('#stats-title'));
    const total = fixture.debugElement.query(By.css('#stats-total'));

    expect(title.nativeElement.innerHTML).toContain(component.title);
    expect(total.nativeElement.innerHTML).toContain(component.total);
  });
});
