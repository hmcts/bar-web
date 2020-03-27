import { UserModel } from './user.model';

describe('UserModel', () => {
  let options;
  beforeEach(() => {
    options = {
      courtId: 'courtId',
      sub: 'user@email.com',
      given_name: 'bar',
      family_name: 'user',
      password: 'password',
      uid: 123,
      roles: ['bar-post-clerk']
    };
  });

  it('create user post-clerk', () => {
    const user = new UserModel(options);
    expect(user.fullName).toBe('bar user');
    expect(user.type).toBe(UserModel.TYPES.postclerk.type);
    expect(user.typeText).toBe(UserModel.TYPES.postclerk.typeText);
  });

  it('create user fee-clerk', () => {
    options.roles = ['bar-fee-clerk'];
    const user = new UserModel(options);
    expect(user.fullName).toBe('bar user');
    expect(user.type).toBe(UserModel.TYPES.feeclerk.type);
    expect(user.typeText).toBe(UserModel.TYPES.feeclerk.typeText);
  });

  it('create user senior-clerk', () => {
    options.roles = ['bar-senior-clerk'];
    const user = new UserModel(options);
    expect(user.fullName).toBe('bar user');
    expect(user.type).toBe(UserModel.TYPES.seniorfeeclerk.type);
    expect(user.typeText).toBe(UserModel.TYPES.seniorfeeclerk.typeText);
  });

  it('create user delivery-manager', () => {
    options.roles = ['bar-delivery-manager'];
    const user = new UserModel(options);
    expect(user.fullName).toBe('bar user');
    expect(user.type).toBe(UserModel.TYPES.deliverymanager.type);
    expect(user.typeText).toBe(UserModel.TYPES.deliverymanager.typeText);
  });

  it('create user without roles', () => {
    options.roles = [];
    const user = new UserModel(options);
    expect(user.fullName).toBe('bar user');
    expect(user.type).toBe(UserModel.TYPES.user.type);
    expect(user.typeText).toBe(UserModel.TYPES.user.typeText);
  });

  it('should create user and verify everything', () => {
    const user = new UserModel(options);
    expect(user.uid).toBe(options.uid);
    expect(user.courtId).toBe(options.courtId);
    expect(user.sub).toBe(options.sub);
    expect(user.given_name).toBe(options.given_name);
    expect(user.family_name).toBe(options.family_name);
    expect(user.password).toBe(options.password);

    // clear the array
    user.roles.length = 0;
    expect(user.roles).toEqual([]);
  });

  it('should create user and verify everything', () => {
    const myOptions = { uid: 123 };
    const user = new UserModel(myOptions);
    expect(user.uid).toBe(myOptions.uid);
    expect(user.courtId).toBe('');
    expect(user.sub).toBe('');
    expect(user.given_name).toBe('');
    expect(user.family_name).toBe('');
    expect(user.password).toBe('');
    expect(user.roles).toEqual([]);
  });
});
