import { UserModel } from './user.model';

describe('UserModel', () => {
  const options = {
    courtId: 'courtId',
    email: 'user@email.com',
    forename: 'bar',
    surname: 'user',
    password: 'password',
    id: 'id',
    roles: ['bar-post-clerk']
  };

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
});
