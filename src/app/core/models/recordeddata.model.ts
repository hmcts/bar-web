import { IRecordedDataType } from '../interfaces/index';
export class RecordedData implements IRecordedDataType {
  userFullName: string;
  userRole: string;
  count: number;

  assign(data) {
    this.userFullName = data.bar_user_full_name;
    this.userRole = data.bar_user_role;
    this.count = data.count_of_payment_instruction_in_specified_status;
  }
}
