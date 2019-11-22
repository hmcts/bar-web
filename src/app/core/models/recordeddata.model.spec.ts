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

    RecordedData.createRecordedDataModel('John Doe',  'post-clerk' , 4);
    expect(RecordedData.createRecordedDataModel).toHaveBeenCalled();
});
});
