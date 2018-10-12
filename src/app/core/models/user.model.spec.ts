import { UserModel } from './user.model';

describe('UserModel', () => {
  let options;
  beforeEach(() => {
    options = {
      courtId: 'courtId',
      email: 'user@email.com',
      forename: 'bar',
      surname: 'user',
      password: 'password',
      id: 123,
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
    expect(user.id).toBe(options.id);
    expect(user.courtId).toBe(options.courtId);
    expect(user.email).toBe(options.email);
    expect(user.forename).toBe(options.forename);
    expect(user.surname).toBe(options.surname);
    expect(user.password).toBe(options.password);

    // clear the array
    user.roles.length = 0;
    expect(user.roles).toEqual([]);
  });

  it('should create user and verify everything', () => {
    const myOptions = { id: 123 };
    const user = new UserModel(myOptions);
    expect(user.id).toBe(myOptions.id);
    expect(user.courtId).toBe('');
    expect(user.email).toBe('');
    expect(user.forename).toBe('');
    expect(user.surname).toBe('');
    expect(user.password).toBe('');
    expect(user.roles).toEqual([]);
  });
});
