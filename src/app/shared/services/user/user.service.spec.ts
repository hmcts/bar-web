import { TestBed, inject } from '@angular/core/testing';

import { UserService } from './user.service';
import { UserModel } from '../../../core/models/user.model';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService]
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it('Should authenticate user with the right credentials', inject([UserService], (service: UserService) => {
    const userModel = new UserModel({
      courtId: 'BR01',
      email: 'damien.hayes@hmcts.net',
      fullName: 'Damien Hayes',
      password: 'somethingrandom',
      type: 'feeclerk',
      typeText: 'Fee Clerk'
    });

    expect(service.authenticate(userModel)).toBeFalsy();
  }));

  it('Should authenticate user', inject([UserService], (service: UserService) => {
    const emails = ['fee.clerk@hmcts.net', 'post.clerk@hmcts.net', 'seniorfee.clerk@hmcts.net', 'delivery.manager@hmcts.net'];
    emails.forEach(email => {
      const userModel = new UserModel({
        courtId: 'BR01',
        email,
        fullName: 'Users Fullname',
        password: 'password',
        type: 'feeclerk',
        typeText: 'Fee Clerk'
      });
      expect(service.authenticate(userModel)).toBeTruthy();
    });
  }));
});
