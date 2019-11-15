import { TestBed, inject } from '@angular/core/testing';

import { UserService } from './user.service';
import { UserModel } from '../../../core/models/user.model';
import { CookieService } from 'ngx-cookie-service';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, CookieService]
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it('Should authenticate user with the right credentials', inject(
    [UserService],
    (service: UserService) => {
      const userModel = new UserModel({
        id: 365750,
        courtId: 'BR01',
        email: 'damien.hayes@hmcts.net',
        forename: 'Damien',
        surname: 'Hayes',
        password: 'somethingrandom',
        roles: ['bar-fee-clerk']
      });

      expect(service.authenticate(userModel, ['Y431'])).toBeFalsy();
    }
  ));

  it('Should authenticate user', inject([UserService], (service: UserService) => {
    const emails = ['fee.clerk@hmcts.net', 'post.clerk@hmcts.net', 'seniorfee.clerk@hmcts.net', 'delivery.manager@hmcts.net',
    'seniorfee.clerk2@hmcts.net', 'barpreprodpostclerk@mailinator.com', 'barpreprodfeeclerk@mailinator.com',
    'barpreprodsrfeeclerk@mailinator.com', 'barpreprod@mailinator.com'];
    emails.forEach(email => {
      const userModel = new UserModel({
        id: 365750,
        courtId: 'BR01',
        email,
        forename: 'Users',
        surname: 'Fullname',
        password: 'password',
        roles: ['bar-fee-clerk']
      });
      expect(service.authenticate(userModel, ['Y431'])).toBeTruthy();
    });
  }));

  it('call logout', () => {
    const cookieService = new CookieService({});
    spyOn(cookieService, 'delete').and.callFake(() => {});
    const userService = new UserService(cookieService);
    userService.logOut();
    expect(cookieService.delete).toHaveBeenCalledTimes(2);
  });

});
