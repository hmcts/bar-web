import { first, isEmpty } from 'lodash';

interface IRole {
  id: string;
  name: string;
}

export class UserRole {
  static postClerkUser: IRole = { id: 'bar-post-clerk', name: 'Post Clerk' };
  static feeClerkUser: IRole = { id: 'bar-fee-clerk', name: 'Fee Clerk' };
  static srFeeClerkUser: IRole = { id: 'bar-senior-clerk', name: 'Reviewer' };
  static deliveryManagerUser: IRole = { id: 'bar-delivery-manager', name: 'Approver' };
}
