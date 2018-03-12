export class PaymentStatus {
  static APPROVED = 'A';

  // TODO: This needs to be changed to Recorded (REC)
  static DRAFT = 'D';

  // TODO: This need to be changed to Pending Review (PR)
  static PENDINGAPPROVAL = 'PA';
  static PENDING = 'P';

  // TODO: This need to be changed to Rejected (REJ)
  static REJECTED = 'RE';

  static VALIDATED = 'V';
  static TRANSFERREDTOBAR = 'TTB';
}
