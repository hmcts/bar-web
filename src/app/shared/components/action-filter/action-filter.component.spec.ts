import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionFilterComponent } from './action-filter.component';

describe('ActionFilterComponent', () => {
  let component;
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

});
