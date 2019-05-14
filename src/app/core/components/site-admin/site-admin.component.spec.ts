import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SiteAdminComponent } from './site-admin.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SitesService } from '../../../shared/services/sites/sites.service';
import { SitesServiceMock } from '../../test-mocks/sites.service.mock';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { async } from 'q';

describe('SiteAdminComponent', () => {

  let component: SiteAdminComponent;
  let fixture: ComponentFixture<SiteAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]), FormsModule ],
      declarations: [SiteAdminComponent],
      providers: [CookieService]
    }).overrideComponent(SiteAdminComponent, {
      set: {
        providers: [
          { provide: SitesService, useClass: SitesServiceMock }
        ]
      }
    });
    fixture = TestBed.createComponent(SiteAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display emails assigned to site', async() => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.emails$.subscribe(emails => {
      expect(emails.length).toBe(3);
    });
  });

  it('clicking on add user button shows the form', async() => {
    await fixture.whenStable();
    fixture.detectChanges();
    const addUserBtn = fixture.debugElement.query(By.css('#add-user-modal')).nativeElement;
    addUserBtn.click();
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Add new user');
  });

  it('test cancelling form', () => {
    const addUserBtn = fixture.debugElement.query(By.css('#add-user-modal')).nativeElement;
    addUserBtn.click();
    fixture.detectChanges();
    let h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Add new user');
    const cancelBtn = fixture.debugElement.query(By.css('#cancel-add-user')).nativeElement;
    cancelBtn.click();
    fixture.detectChanges();
    h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Users from Bromley County Court');
  });

  it('test submitting the form', () => {
    spyOn(component, 'onFormSubmission').and.callThrough();
    const addUserBtn = fixture.debugElement.query(By.css('#add-user-modal')).nativeElement;
    addUserBtn.click();
    fixture.detectChanges();
    let h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toEqual('Add new user');
    const submitBtn = fixture.debugElement.query(By.css('#cancel-add-user')).nativeElement;
    submitBtn.click();
    fixture.detectChanges();
    h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Users from Bromley County Court');
    expect(component.onFormSubmission).toHaveBeenCalledTimes(1);
  });

});
