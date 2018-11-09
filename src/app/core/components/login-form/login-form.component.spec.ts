import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFormComponent } from './login-form.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../shared/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../models/user.model';
import { LoginFormModel } from './login-form.model';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginFormComponent ],
      imports: [ FormsModule ],
      providers: [ UserService, CookieService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onAuthenticated() event', () => {
    const e = { preventDefault() { } };
    spyOn(e, 'preventDefault');
    spyOn(component, 'findUser');
    spyOn(component.onAuthenticated, 'emit');

    component.model = new LoginFormModel(new UserModel({
      id: 365760,
      courtId: 'BR04',
      email: 'barpreprod@mailinator.com',
      forename: 'PreProd',
      surname: 'Admin',
      password: 'password',
      roles: ['bar-delivery-manager']
    }));

    component.onSubmit(e);

    expect(e.preventDefault).toHaveBeenCalled();
    expect(component.findUser).toHaveBeenCalledWith(component.model.email);
    expect(component.onAuthenticated.emit).toHaveBeenCalled();
  });

  it('should select the right user', () => {
    const user = new UserModel({
      id: 365760,
      courtId: 'BR04',
      email: 'barpreprod@mailinator.com',
      forename: 'PreProd',
      surname: 'Admin',
      password: 'password',
      roles: ['bar-delivery-manager']
    });

    component.selectUser(user);
    expect(component.model.email).toEqual(user.email);
  });

  it('should select the right user', () => {
    const user = new UserModel({
      id: 365760,
      courtId: 'BR04',
      email: 'barpreprod@mailinator.com',
      forename: 'PreProd',
      surname: 'Admin',
      password: 'password',
      roles: ['bar-delivery-manager']
    });

    component.findUser(user.email);
    expect(component.model.email).toEqual(user.email);
  });
});
