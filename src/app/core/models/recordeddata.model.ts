export class RecordedData {
  userFullName: string;
  userRole: string;
  count = 0;

  assign(data) {
    this.userFullName = data.bar_user_full_name;
    this.userRole = data.bar_user_role;
    this.count = data.count_of_payment_instruction_in_specified_status;
  }
}
