export class PaymentStatus {
  static list = [
    { label: 'Approved', code: 'A' },  // Reviewed
    { label: 'Completed', code: 'C' },
    { label: 'Draft', code: 'D' },
    { label: 'Pending', code: 'P' },
    { label: 'Pending Approval', code: 'PA' }, // Pending Review
    { label: 'Rejected', code: 'REJ' },
    { label: 'Rejected by DM', code: 'RDM' },
    { label: 'Transferred To Bar', code: 'TTB' },
    { label: 'Validated', code: 'V' }
  ];

  // make this redundant - gradually
  static REVIEWED = 'A';   // TODO: This is tactical. Needs to be changed to R along with corresponding changes in API
  static COMPLETED = 'C';
  static DRAFT = 'D'; // TODO: This needs to be changed to Recorded (REC)
  static PENDING = 'P';
  static PENDINGREVIEW = 'PA'; // TODO: This is tactical. Needs to be changed to PR along with corresponding changes in API
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
