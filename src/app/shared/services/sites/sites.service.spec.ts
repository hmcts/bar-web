import { SitesService } from './sites.service';
import { BarHttpClient } from '../httpclient/bar.http.client';
import { mock, instance } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { of } from 'rxjs';
import { UserService } from '../user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../../../core/models/user.model';

const USER_OBJECT: UserModel = new UserModel({
  id: 365750,
  courtId: 'BR04',
  email: 'delivery.manager@hmcts.net',
  forename: 'Dee',
  surname: 'Aliu',
  password: 'password',
  roles: ['bar-post-clerk']
});

describe('SitesService', () => {
  let http, sitesService, userService, cookieService;

  beforeEach(() => {
    http = new BarHttpClient(instance(mock(HttpClient)), instance(mock(Meta)));
    userService = instance(mock(UserService));
    cookieService = new CookieService({});
    sitesService = new SitesService(http, cookieService, userService);
  });

  it('should load service', () => {
    expect(sitesService).toBeTruthy();
  });

  it('should send the right response', () => {
    let calledWithParam;
    spyOn(http, 'get').and.callFake(param => {
      calledWithParam = param;
      return of({ data: [], success: true });
    });

    spyOn(userService, 'getUser').and.returnValue(USER_OBJECT);

    sitesService.getSites();
    expect(calledWithParam).toEqual('/api/sites/users/delivery.manager@hmcts.net');
  });
});
