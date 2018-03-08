import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';
import { By } from '@angular/platform-browser';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should display the right number', () => {
    const numberDebugElem = fixture.debugElement.query(By.css('.card__number'));
    const numberElem = numberDebugElem.nativeElement;

    fixture.componentInstance.number = 1;
    fixture.componentInstance.label = 'approved';
    fixture.detectChanges();

    expect(parseInt(numberElem.innerHTML, 10)).toEqual( fixture.componentInstance.number );
  });

  it('Should display the right label', () => {
    const numberDebugElem = fixture.debugElement.query(By.css('.card__label'));
    const labelElem = numberDebugElem.nativeElement;

    fixture.componentInstance.number = 1;
    fixture.componentInstance.label = 'approved';
    fixture.detectChanges();

    expect(labelElem.innerHTML).toEqual( fixture.componentInstance.label );
  });

  it('Should display the right amount', () => {

  });

  it('Shouldn\'t display the amount if amount hasn\'t been given', () => {

  });

  it('Should display "0" if no number has been given', () => {

  });
});
