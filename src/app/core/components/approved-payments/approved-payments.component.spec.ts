import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedPaymentsComponent } from './approved-payments.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CardComponent } from '../../../shared/components/card/card.component';
import { UserService } from '../../../shared/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../models/user.model';

describe('ApprovedPaymentsComponent', () => {
  let component: ApprovedPaymentsComponent;
  let fixture: ComponentFixture<ApprovedPaymentsComponent>;
  let userModel: UserModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule, HttpClientModule, FormsModule, RouterModule, RouterTestingModule.withRoutes([]) ],
      declarations: [ ApprovedPaymentsComponent, CardComponent ],
      providers: [CookieService, UserService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    userModel = new UserModel({
      id: 365751,
      courtId: 'BR02',
      email: 'fee.clerk@hmcts.net',
      forename: 'Karen',
      surname: 'Taylor',
      password: 'password',
      roles: ['bar-fee-clerk']
    });
    fixture = TestBed.createComponent(ApprovedPaymentsComponent);
    component = fixture.componentInstance;
    const userService = fixture.debugElement.injector.get(UserService);
    spyOn(userService, 'getUser').and.returnValue(userModel);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
