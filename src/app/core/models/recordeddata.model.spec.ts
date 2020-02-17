import { RecordedData } from './recordeddata.model';

describe('Recorded Type', () => {

  let recordedtype;

  beforeEach(() => {
    recordedtype = new RecordedData();
  });

  it('should have the data changed appropriately', () => {
    const data = { userFullName: 'John Doe', userRole: 'post-clerk' , count: 4};
    recordedtype.assign({
      count: 4,
      userFullName: 'John Doe',
      userRole: 'post-clerk'
    });
    recordedtype.userFullName = data.userFullName;
    recordedtype.count = data.count;
    recordedtype.userRole = data.userRole;
    expect(recordedtype.userFullName).toBe(data.userFullName);
    expect(recordedtype.count).toBe(data.count);
    expect(recordedtype.userRole).toBe(data.userRole);
});
});
