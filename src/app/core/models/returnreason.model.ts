export interface IReturnReason {
    id: number;
    reason: string;
}

export class ReturnReasonModel {
    reasons: IReturnReason[] = [
      { id: 1, reason: 'Overpayment' },
      { id: 2, reason: 'Incorrect payment amount' },
      { id: 3, reason: 'Other (add comment)' }
    ];

    getReasonById(id: number): IReturnReason {
      return this.reasons.find(item => item.id === id);
    }
}
