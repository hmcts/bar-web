import {async, ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';

import { CardComponent } from './card.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardComponent ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
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

    component.number = 1;
    component.label = 'approved';
    fixture.detectChanges();

    expect(parseInt(numberElem.innerHTML, 10)).toEqual( fixture.componentInstance.number );
  });

  it('Should display "0" if no number has been given', () => {
    const numberDebugElem = fixture.debugElement.query(By.css('.card__number'));
    const numberElem: HTMLElement = numberDebugElem.nativeElement;

    component.label = 'approved';
    fixture.detectChanges();

    expect(numberElem.textContent).toContain('0');
  });

  it('Should display the right label', () => {
    const labelDe: DebugElement = fixture.debugElement;
    const labelEl: HTMLElement = labelDe.nativeElement;
    const cardLabel = labelEl.querySelector('.card__label');

    component.number = 1;
    component.label = 'approved';
    fixture.detectChanges();

    expect(cardLabel.textContent).toEqual( fixture.componentInstance.label );
  });

  it('Should display the right amount', () => {
    const amountDe: DebugElement = fixture.debugElement;
    const amountEl: HTMLElement = amountDe.nativeElement;

    component.amount = 99.99;
    fixture.detectChanges();

    expect(amountEl.textContent).toContain(`£${component.amount}`);
  });

  it('Shouldn\'t display the amount if amount hasn\'t been given', () => {
    const amountDe: DebugElement = fixture.debugElement;
    const amountEl: HTMLElement = amountDe.nativeElement;
    const cardAmount = amountEl.querySelector('.card__amount');
    fixture.detectChanges();

    expect(component.amount).toBeUndefined();
    expect(cardAmount).toBeNull();
  });

  it('If an undefined value is passed into "number" @Input, still display 0', () => {
    // create the element (for debugging)
    const componentElement: DebugElement = fixture.debugElement;

    // set component input variables
    component.label = 'Test Label';
    component.number = undefined;
    component.validateNumber();

    expect(componentElement.nativeElement.textContent).toContain('0');
  });
});
