import { PaymentStatus } from './paymentstatus.model';

export class  SearchModel {
  id: string;
  action: string;
  allPayInstructionId: string;
  caseReference: string;
  chequeNumber: string;
  dailySequenceId: number;
  endDate: string;
  payerName: string;
  paymentType: string;
  postalOrderNumber: string;
  query: string;
  startDate: string;
  status = PaymentStatus.DRAFT;
  piIds: string;
}
