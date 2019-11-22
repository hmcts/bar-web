import { IRecordedDataType } from '../interfaces/index';

export class RecordedData implements IRecordedDataType  {
  static userFullName(userFullName: any) {
        throw new Error("Method not implemented.");
    }

  static userRole(userRole: any) {
      throw new Error("Method not implemented.");
  }

  static count(count: any) {
    throw new Error("Method not implemented.");
  }

  userFullName: string;
  userRole: string;
  count: number;

  static createRecordedDataModel(userFullName: string, userRole: string, count: number) {
    const rd = new RecordedData();
    rd.userRole = userRole;
    rd.userFullName = userFullName;
    rd.count = count;
    return rd;
  }

  assign(data) {
    this.userFullName = data.bar_user_full_name;
    this.userRole = data.bar_user_role;
    this.count = data.count_of_payment_instruction_in_specified_status;
  }
}
