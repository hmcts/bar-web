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
import { HmctsModalComponent } from '../../../shared/components/hmcts-modal/hmcts-modal.component';

describe('SiteAdminComponent', () => {

  let component: SiteAdminComponent;
  let fixture: ComponentFixture<SiteAdminComponent>;
  let siteService: SitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule, RouterModule, RouterTestingModule.withRoutes([]), FormsModule ],
      declarations: [SiteAdminComponent, HmctsModalComponent],
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
    siteService = fixture.debugElement.injector.get(SitesService);
    fixture.detectChanges();
  });

  it('should display emails assigned to site', async() => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.users$.subscribe(emails => {
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

  it('test remove user from site', async() => {
    spyOn(siteService, 'removeUserFromSite').and.callThrough();
    await fixture.whenStable();
    fixture.detectChanges();
    const modal = fixture.nativeElement.querySelector('#delete-confirmation-dialog');
    expect(modal.hidden).toBeTruthy();
    const delBtn = fixture.nativeElement.querySelector('a#del-1');
    delBtn.click();
    fixture.detectChanges();
    expect(modal.hidden).toBeFalsy();
    expect(component.deleteConfirmationOn).toBeTruthy();
    expect(component.emailToDelete).toBe('b@b.com');
    const modalCancelBtn = fixture.nativeElement.querySelector('a#cancel-delete-btn');
    modalCancelBtn.click();
    fixture.detectChanges();
    expect(modal.hidden).toBeTruthy();
    expect(component.deleteConfirmationOn).toBeFalsy();
    delBtn.click();
    fixture.detectChanges();
    const submitBtn = fixture.nativeElement.querySelector('#submit-delete-btn');
    submitBtn.click();
    fixture.detectChanges();
    expect(modal.hidden).toBeTruthy();
    expect(siteService.removeUserFromSite).toHaveBeenCalledTimes(1);
  });

  it('test role selection', () => {
    const event = {
      target: {
        checked: true,
        value: 'bar-fee-clerk'
      }
    };
    component.toggleRole(event);
    expect(component.selectedRoles).toEqual(['bar-fee-clerk']);
    event.target.checked = false;
    component.toggleRole(event);
    expect(component.selectedRoles.length).toBe(0);
  });

});
