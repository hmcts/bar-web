import { UserRole } from './userrole.model';

export class OverviewData {
  userFullName: string;
  userId: string;
  userRole: UserRole;
  submitted = 0;
  readyToReview = 0;
  validatedPayments = 0;
  approved = 0;
  reviewed = 0;
  rejected = 0;
  carryForwarded = 0;
  readyToTransferToBar = 0;

  assign(data) {
    this.userFullName = data.bar_user_full_name;
    this.userId = data.bar_user_id;
    this.userRole = data.bar_user_role;
  }
}
