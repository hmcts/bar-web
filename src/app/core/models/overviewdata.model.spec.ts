import { OverviewData } from './overviewdata.model';
import { UserRole } from './userrole.model';

describe('Overview data', () => {
  let model: OverviewData;

  beforeEach(() => {
    model = new OverviewData();
  });

  it('should be created', () => {
    expect(model).toBeTruthy();
  });

  it('should assign data', () => {
    const bar_user_full_name = 'James Donaldson';
    const bar_user_id = 1;
    const bar_user_role = UserRole.FEECLERK;
    model.assign({ bar_user_full_name, bar_user_id, bar_user_role });

    expect(model.userFullName).toBe('James Donaldson');
    expect(`${model.userId}`).toBe(`${bar_user_id}`);
    expect(model.userRole).toEqual(UserRole.FEECLERK);
  });

});
