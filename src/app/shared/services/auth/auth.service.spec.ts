import { AuthService } from './auth.service';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  const userService = instance(mock(UserService));
  const authService = new AuthService(userService);

  it('isAuthenticated when there is a user', () => {
    spyOn(userService, 'getUser').and.returnValue({});
    expect(authService.isAuthenticated()).toBeTruthy();
  });

  it('isAuthenticated when there is no user', () => {
    spyOn(userService, 'getUser').and.returnValue(null);
    expect(authService.isAuthenticated()).toBeFalsy();
  });
});
