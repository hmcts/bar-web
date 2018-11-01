import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalComponent } from '../modal/modal.component';
import { NumbersOnlyDirective } from '../../directives/numbers-only.directive';
import { RouterTestingModule } from '@angular/router/testing';

class MockActivatedRoute {

  private _params = null;

  get params() {
    return this._params;
  }

  set params(params: Observable<any>) {
    this._params = params;
  }
}

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  const activatedRoute = new MockActivatedRoute();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ ErrorComponent, ModalComponent, NumbersOnlyDirective ]
    })
    .overrideComponent(ErrorComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute, useValue: activatedRoute }
        ]
      }
    });
  });

  it('when no route param then should show app error', () => {
    activatedRoute.params = of({errorCode: ''});
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Application error');
    fixture.destroy();
  });

  it('when 401 then should show Access denied', () => {
    activatedRoute.params = of({errorCode: '401'});
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('This server could not verify that you are authorized to access the document requested');
    fixture.destroy();
  });

  it('when 403 then should show Forbidden', () => {
    activatedRoute.params = of({errorCode: '403'});
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('You do not have permission to retrieve the URL or link you requested');
    fixture.destroy();
  });

  it('when 404 then should show Not found', () => {
    activatedRoute.params = of({errorCode: '404'});
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Sorry, but the page you were trying to view does not exist');
    fixture.destroy();
  });

  it('when 500 then should show Not found', () => {
    activatedRoute.params = of({errorCode: '500'});
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Application error');
    fixture.destroy();
  });
});
