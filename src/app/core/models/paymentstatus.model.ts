export class PaymentStatus {
  static list = [
    { label: 'Approved', code: 'A' },
    { label: 'Draft', code: 'D' },
    { label: 'Pending', code: 'P' },
    { label: 'Pending Approval', code: 'PA' },
    { label: 'Rejected', code: 'REJ' },
    { label: 'Transferred To Bar', code: 'TTB' },
    { label: 'Validated', code: 'V' }
  ];

  static APPROVED = 'A';
  static DRAFT = 'D'; // TODO: This needs to be changed to Recorded (REC)
  static PENDING = 'P';
  static PENDINGAPPROVAL = 'PA'; // TODO: This need to be changed to Pending Review (PR)
  static REJECTED = 'REJ';
  static TRANSFERREDTOBAR = 'TTB';
  static VALIDATED = 'V';

  static getPayment(value: string) {
    const paymentStatus = PaymentStatus.list.filter(item => item.label === value || item.code === value);
    if (paymentStatus.length > 0) {
      return paymentStatus[0];
    }
  }

}
