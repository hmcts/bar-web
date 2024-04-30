import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { windowToken } from '../../../../window';
import { CookieBannerComponent } from './cookie-banner.component';

const windowMock: Window = {
  location: { reload: () => {}},
  dataLayer : [],
  dtrum: { enable: () => {}, disable: () => {}, enableSessionReplay: () => {}, disableSessionReplay: () => {} }
} as any;

describe('CookieBannerComponent', () => {
  let appComponent: CookieBannerComponent;
  let fixture: ComponentFixture<CookieBannerComponent>;
  let windowTestBed: Window;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ CookieBannerComponent ],
      providers: [
        { provide: windowToken, useValue: windowMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieBannerComponent);
    appComponent = fixture.componentInstance;
    fixture.detectChanges();
    windowTestBed = TestBed.get(windowToken);
  });
  it('should create', () => {
    expect(appComponent).toBeTruthy();
  });
  it('should be created by angular', () => {
    expect(fixture).not.toBeNull();
  });
});
