import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionFilterComponent } from './action-filter.component';
import { stats } from '../../../core/test-mocks/paymentsoverview.service.mock';

describe('ActionFilterComponent', () => {
  let component: ActionFilterComponent;
  let fixture: ComponentFixture<ActionFilterComponent>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [ActionFilterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ActionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event to parent component', () => {
    spyOn(component.onActionSelect, 'emit');
    const action = { action: 'Process', disabled: false };
    component.onActionClick( action );
    expect(component.onActionSelect.emit).toHaveBeenCalledWith(action);
  });

  it('check if data is processed when stats changed to null from undefined', () => {
    const changes = { actionStats : { previousValue: undefined, currentValue: null, firstChange: true, isFirstChange: () => true }};
    component.ngOnChanges(changes);
    expect(component.numOfPaymentInstructions).toEqual({});
  });

  it('check if data is processed when stats changed to null from undefined', () => {
    const actionsStats = [JSON.parse(stats)[0]];
    const changes = { actionStats : { previousValue: null, currentValue: actionsStats, firstChange: true, isFirstChange: () => true }};
    component.ngOnChanges(changes);
    expect(component.numOfPaymentInstructions).toEqual({Process: 5});
  });

});
