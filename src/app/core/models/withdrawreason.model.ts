export interface IWithdrawReason {
  id: number;
  reason: string;
}

export class WithdrawReasonModel {
  reasons: IWithdrawReason[] = [
    { id: 1, reason: 'Duplicate Entry' },
    { id: 2, reason: 'Fee not found' },
    { id: 3, reason: 'Other (add comment)' }
  ];

  getReasonById(id: number): IWithdrawReason {
    return this.reasons.find(item => item.id === id);
  }
}
