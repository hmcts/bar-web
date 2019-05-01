export class PaymentStatus {
  static list = [
    { label: 'Reviewed', code: 'R' },
    { label: 'Completed', code: 'C' },
    { label: 'Draft', code: 'D' },
    { label: 'Pending', code: 'P' },
    { label: 'Pending Review', code: 'PR' },
    { label: 'Rejected', code: 'REJ' },
    { label: 'Rejected by DM', code: 'RDM' },
    { label: 'Transferred To Bar', code: 'TTB' },
    { label: 'Validated', code: 'V' }
  ];

  // make this redundant - gradually
  static REVIEWED = 'R';
  static COMPLETED = 'C';
  static DRAFT = 'D'; // TODO: This needs to be changed to Recorded (REC)
  static PENDING = 'P';
  static PENDINGREVIEW = 'PR';
  static REJECTED = 'REJ';
  static REJECTEDBYDM = 'RDM';
  static TRANSFERREDTOBAR = 'TTB';
  static VALIDATED = 'V';

  static  getPayment(value: string) {
    const paymentStatus = PaymentStatus.list.filter(item => item.label === value || item.code === value);
    if (paymentStatus.length > 0) {
      return paymentStatus[0];
    }
  }

}
